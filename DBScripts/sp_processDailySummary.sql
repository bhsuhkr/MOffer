use Moffer
go

/****** Object:  StoredProcedure [dbo].[sp_insertTransaction]    Script Date: 8/8/2023 8:07:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Jung Yang
-- Create date: 9/1/2023
-- Description:	Compute daily summary and insert the data into table NC_DailySummary
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND OBJECT_ID = OBJECT_ID('dbo.sp_processDailySummary'))
   exec('CREATE PROCEDURE [dbo].[sp_processDailySummary] AS BEGIN SET NOCOUNT ON; END')
GO

ALTER PROCEDURE [dbo].[sp_processDailySummary] 
	@summaryDate date,
	@endOfDayProcess bit
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @debitTotalAmt float
	DECLARE @creditTotalAmt float
	DECLARE @mealRefundTotalAmt float
	DECLARE @depositRefundTotalAmt float
	DECLARE @dailyBalance float
	DECLARE @totalTransBalance float
	DECLARE @totalMemberBalance float
	DECLARE @totalActiveMembers int
	DECLARE @dailyActiveMembers int
	DECLARE @dailyNewMembers int
	DECLARE @dailyExists bit

	SET @dailyExists = 0
	IF NULLIF(@summaryDate, '') IS NULL
		SET @summaryDate = getdate();
	IF NULLIF(@endOfDayProcess, '') IS NULL
		SET @endOfDayProcess = 0;

	--PRINT @summaryDate
	--SELECT @summaryDate AS 'Date';

	SELECT @dailyExists = 1 
	from [NC_DailySummary] 
	WHERE [SummaryDate] = @summaryDate

	-- query to get all debits / meals sold using member balance for a given day
	select @debitTotalAmt=sum(nc_transactions.transamount)
	from nc_transactions 
	where CONVERT(DATE, TransTime) = @summaryDate
	and nc_transactions.TransType in ('DEBIT', 'DEBIT_ADM', 'DEBIT_SYS')

	IF @debitTotalAmt is null
	BEGIN
		SET @debitTotalAmt = 0
	END

	-- query to get all credits / deposits came into church for a given day
	select @creditTotalAmt=sum(nc_transactions.transamount)
	from nc_transactions 
	where CONVERT(DATE, TransTime) = @summaryDate
	and nc_transactions.TransType in ('CREDIT', 'CREDIT_ADM', 'CREDIT_SYS') and TransAmount > 3

	IF @creditTotalAmt is null
	BEGIN
		SET @creditTotalAmt = 0
	END

	-- query to get all meal refunds for a given day
	select @mealRefundTotalAmt=sum(nc_transactions.transamount)
	from nc_transactions 
	where CONVERT(DATE, TransTime) = @summaryDate
	and (nc_transactions.TransType in ('CREDIT', 'CREDIT_ADM', 'CREDIT_SYS') and TransAmount < 3)

	IF @mealRefundTotalAmt is null
	BEGIN
		SET @mealRefundTotalAmt = 0
	END

	-- query to get all deposit refunds / reservals for a given day
	select @depositRefundTotalAmt=sum(nc_transactions.transamount)
	from nc_transactions 
	where CONVERT(DATE, TransTime) = @summaryDate
	and  nc_transactions.TransType in ('REFUND')

	IF @depositRefundTotalAmt is null
	BEGIN
		SET @depositRefundTotalAmt = 0
	END

	-- total credit $ came into church as deposit minus any deposit refunded 
	-- this is the reversal for deposit
	SET @creditTotalAmt = @creditTotalAmt - @depositRefundTotalAmt

	-- query to get daily balance for a given day
	SET @dailyBalance = (@creditTotalAmt - @debitTotalAmt + @mealRefundTotalAmt)

	IF @dailyBalance is null
	BEGIN
		SET @dailyBalance = 0
	END

	-- query to get grand totals from the beginning of time!
	DECLARE @grandTotalDebit float
	select @grandTotalDebit=sum(nc_transactions.transamount)
	from nc_transactions 
	WHERE nc_transactions.TransType in ('DEBIT', 'DEBIT_ADM', 'DEBIT_SYS', 'REFUND')
	AND CONVERT(DATE, TransTime) <= @summaryDate

	DECLARE @grandTotalCredit float
	select @grandTotalCredit=sum(nc_transactions.transamount)
	from nc_transactions 
	WHERE nc_transactions.TransType NOT in ('DEBIT', 'DEBIT_ADM', 'DEBIT_SYS', 'REFUND')
	AND CONVERT(DATE, TransTime) <= @summaryDate

	SET @totalTransBalance = @grandTotalCredit- @grandTotalDebit
	IF @totalTransBalance is null
	BEGIN
		SET @totalTransBalance = 0
	END

	select @totalMemberBalance=sum(nc_members.CurrentBalance)
	from nc_members 

	IF @totalMemberBalance is null
	BEGIN
		SET @totalMemberBalance = 0
	END
	

	-- query to get total number of members 
	select @totalActiveMembers=count(distinct nc_transactions.MemberID) 
	from nc_transactions 
	where CONVERT(DATE, TransTime) <= @summaryDate

	IF @totalActiveMembers is null
	BEGIN
		SET @totalActiveMembers = 0
	END

	-- query to get unique number of members who had transaction for a given day
	select @dailyActiveMembers=count(distinct nc_transactions.MemberID) 
	from nc_transactions 
	where CONVERT(DATE, TransTime) = @summaryDate
	
	IF @dailyActiveMembers is null
	BEGIN
		SET @dailyActiveMembers = 0
	END

	-- query to get unique number of members who had transaction for a given day
	select @dailyNewMembers=count(distinct nc_transactions.MemberID) 
	from nc_transactions 
	where CONVERT(DATE, TransTime) = @summaryDate
	and nc_transactions.MemberID  NOT in 
	(select distinct nc_transactions.MemberID
		from nc_transactions 
		where CONVERT(DATE, TransTime) < @summaryDate)

	IF @dailyNewMembers is null
	BEGIN
		SET @dailyNewMembers = 0
	END

	BEGIN TRY
		-- Start a new transaction
		BEGIN TRANSACTION;
			
			IF @dailyExists = 1 
				BEGIN
					-- for end of day process, update grand total member balance 
					IF @endOfDayProcess = 1 
						BEGIN
							UPDATE  [NC_DailySummary] 
							SET [DailyTotalDebitAmount] = @debitTotalAmt
								  ,[DailyTotalCreditAmount] = @creditTotalAmt
								  ,[DailyTotalRefundAmount] = @mealRefundTotalAmt 
								  ,[DailyBalance] = @dailyBalance
								  ,[DailyActiveMembers] = @dailyActiveMembers
								  ,[GrandTotalTransBalance] = @totalTransBalance
								  ,[GrandTotalMemberBalance] = @totalMemberBalance
								  ,[GrandTotalActiveMembers] = @totalActiveMembers
								  ,[DailyNewMembers] = @dailyNewMembers
							WHERE [SummaryDate] = @summaryDate
						END
					-- for non-end-of-day process, do not update grand total member balance as it cannot be calculated based on date
					ELSE
						BEGIN
							UPDATE  [NC_DailySummary] 
							SET [DailyTotalDebitAmount] = @debitTotalAmt
								  ,[DailyTotalCreditAmount] = @creditTotalAmt
								  ,[DailyTotalRefundAmount] = @mealRefundTotalAmt 
								  ,[DailyBalance] = @dailyBalance
								  ,[DailyActiveMembers] = @dailyActiveMembers
								  ,[GrandTotalTransBalance] = @totalTransBalance
								  ,[GrandTotalActiveMembers] = @totalActiveMembers
								  ,[DailyNewMembers] = @dailyNewMembers
							WHERE [SummaryDate] = @summaryDate
						END
				END				
			ELSE 
				BEGIN
					-- #### Insert 
					Insert into [NC_DailySummary] 
					(
					  [SummaryDate]
					  ,[DailyTotalDebitAmount]
					  ,[DailyTotalCreditAmount]
					  ,[DailyTotalRefundAmount]
					  ,[DailyBalance]
					  ,[DailyActiveMembers]
					  ,[GrandTotalTransBalance]
					  ,[GrandTotalMemberBalance]
					  ,[GrandTotalActiveMembers]
					  ,[DailyNewMembers]
					)
					values (
						@summaryDate
						,@debitTotalAmt
						,@creditTotalAmt
						,@mealRefundTotalAmt 
						,@dailyBalance
						,@dailyActiveMembers
						,@totalTransBalance
						,@totalMemberBalance
						,@totalActiveMembers
						,@dailyNewMembers
					)
			END
		-- If everything is fine, commit the transaction
		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		-- In case of error, roll back the transaction
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;

		-- Then throw a custom error message
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();

		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH

END
