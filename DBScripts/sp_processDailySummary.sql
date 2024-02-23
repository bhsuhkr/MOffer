
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
	DECLARE @dailyActiveMembers int
	DECLARE @dailyNewMembers int
	DECLARE @dailyExists bit

	DECLARE @grandTotalDebitAmt float
	DECLARE @grandTotatCreditAmt float
	DECLARE @grandTotalTransBalance float
	DECLARE @grandTotalMemberBalance float
	DECLARE @grandTotalActiveMembers int
	DECLARE @oneLocation varchar(10)

	SET @dailyExists = 0
	IF NULLIF(@summaryDate, '') IS NULL
		SET @summaryDate = getdate();
	IF NULLIF(@endOfDayProcess, '') IS NULL
		SET @endOfDayProcess = 0;

	--PRINT @summaryDate
	--SELECT @summaryDate AS 'Date';

	DECLARE TransactionLocations CURSOR FAST_FORWARD READ_ONLY
	FOR
		SELECT Totals.TransPoint, Totals.DebitAmount, Totals.CreditAmount, 
		Totals.MealRefAmount, Totals.DepositRefAmount, 
		(Totals.CreditAmount - Totals.DepositRefAmount) - (Totals.DebitAmount - Totals.MealRefAmount) as TotalBalance,
		DailyActiveMembers, DailyNewMembers, GrandTotalActiveMembers, 
		GrandTotalDebitAmount, GrandTotalCreditAmount, 
		(GrandTotalCreditAmount - GrandTotalDebitAmount) as GrandTotalTransBalance, GrandTotalMemberBalance
		From 
		(SELECT TP.TransPoint, @summaryDate as TransDate, 
		ISNULL((
			select sum(nc_transactions.transamount)  
			from nc_transactions 
			where CONVERT(DATE, TransTime) = @summaryDate
			and nc_transactions.TransType in ('DEBIT', 'DEBIT_ADM', 'DEBIT_SYS')
			AND nc_transactions.TransPoint = TP.TransPoint), 0) as DebitAmount,
		ISNULL((
			select  sum(nc_transactions.transamount)
			from nc_transactions 
			where CONVERT(DATE, TransTime) = @summaryDate
			and nc_transactions.TransType in ('CREDIT', 'CREDIT_ADM', 'CREDIT_SYS')
			and nc_transactions.TransPoint = TP.TransPoint), 0) as CreditAmount,
		ISNULL((
			select sum(nc_transactions.transamount)
			from nc_transactions 
			where CONVERT(DATE, TransTime) = @summaryDate
			and nc_transactions.TransType in ('PAY_REFUND')
			and nc_transactions.TransPoint = TP.TransPoint), 0) as MealRefAmount,
		ISNULL((
			select sum(nc_transactions.transamount)
			from nc_transactions 
			where CONVERT(DATE, TransTime) = @summaryDate
			and nc_transactions.TransType in ('DEP_REFUND')
			and nc_transactions.TransPoint = TP.TransPoint), 0) as DepositRefAmount,
		ISNULL((
			select count(distinct nc_transactions.MemberID) 
			from nc_transactions 
			where CONVERT(DATE, TransTime) = @summaryDate
			and nc_transactions.TransPoint = TP.TransPoint), 0) as DailyActiveMembers,
		ISNULL((
			select count(distinct t2.MemberID) 
			from nc_transactions t2
			where CONVERT(DATE, t2.TransTime) = @summaryDate
			AND t2.TransPoint = TP.TransPoint
			and t2.MemberID  NOT in 
			(select distinct t3.MemberID
				from nc_transactions t3
				where CONVERT(DATE, t3.TransTime) < @summaryDate
				AND t3.TransPoint = TP.TransPoint)), 0) as DailyNewMembers, 
		ISNULL((
			select count(distinct nc_transactions.MemberID) 
			from nc_transactions 
			where CONVERT(DATE, TransTime) <= @summaryDate
			and nc_transactions.TransPoint = TP.TransPoint), 0) as GrandTotalActiveMembers,
		ISNULL((
		-- query to get grand totals from the beginning of time!
			select sum(nc_transactions.transamount)
			from nc_transactions 
			WHERE nc_transactions.TransType in ('DEBIT', 'DEBIT_ADM', 'DEBIT_SYS', 'DEP_REFUND')
			AND CONVERT(DATE, TransTime) <= @summaryDate
			and nc_transactions.TransPoint = TP.TransPoint), 0) as GrandTotalDebitAmount,
		ISNULL((
		-- query to get grand totals from the beginning of time!
			select sum(nc_transactions.transamount)
			from nc_transactions 
			WHERE nc_transactions.TransType in ('CREDIT', 'CREDIT_ADM', 'CREDIT_SYS', 'PAY_REFUND')
			AND CONVERT(DATE, TransTime) <= @summaryDate
			and nc_transactions.TransPoint = TP.TransPoint), 0) as GrandTotalCreditAmount,
		ISNULL((
		select sum(nc_members.CurrentBalance)
			from nc_members), 0) as GrandTotalMemberBalance
		FROM NC_TransPoints TP ) AS Totals
		WHERE (Totals.DebitAmount + Totals.CreditAmount) > 0

	OPEN TransactionLocations

	FETCH NEXT FROM TransactionLocations INTO @oneLocation, @debitTotalAmt, @creditTotalAmt, 
		@mealRefundTotalAmt, @depositRefundTotalAmt, 
		@dailyBalance, 
		@dailyActiveMembers, @dailyNewMembers, @grandTotalActiveMembers, 
		@grandTotalDebitAmt, @grandTotatCreditAmt, 
		@grandTotalTransBalance, @grandTotalMemberBalance

	-- iterate over each location from reference/lookup table and run summary logic
	-- if main caferia and book cafe are configured, then this will summarize based on each location

	WHILE @@FETCH_STATUS = 0
		BEGIN
			SELECT @dailyExists = 0

			SELECT @dailyExists = 1 
			from [NC_DailySummary] 
			WHERE [SummaryDate] = @summaryDate AND TransPoint = @oneLocation

			PRINT @oneLocation
			PRINT @dailyExists


			BEGIN TRY
				-- Start a new transaction
				BEGIN TRANSACTION;
					IF @dailyActiveMembers > 0 
						IF @dailyExists = 1 
							BEGIN
								-- for end of day process, update grand total member balance 
								IF @endOfDayProcess = 1 
									BEGIN
										UPDATE  [NC_DailySummary] 
										SET [DailyTotalDebitAmount] = @debitTotalAmt
											,[DailyTotalCreditAmount] = @creditTotalAmt
											,[DailyTotalRefundAmount] = @mealRefundTotalAmt 
											,[DailyTotalDepositRefAmount] = @depositRefundTotalAmt 
											,[DailyBalance] = @dailyBalance
											,[DailyActiveMembers] = @dailyActiveMembers
											,[DailyNewMembers] = @dailyNewMembers
											,[GrandTotalDebitAmount] = @grandTotalDebitAmt
											,[GrandTotalCreditAmount] = @grandTotatCreditAmt
											,[GrandTotalTransBalance] = @grandTotalTransBalance
											,[GrandTotalMemberBalance] = @grandTotalMemberBalance
											,[GrandTotalActiveMembers] = @grandTotalActiveMembers
										WHERE [SummaryDate] = @summaryDate
										AND TransPoint = @oneLocation
									END
								-- for non-end-of-day process, do not update grand total member balance as it cannot be calculated based on date
								ELSE
									BEGIN
										UPDATE  [NC_DailySummary] 
										SET [DailyTotalDebitAmount] = @debitTotalAmt
											,[DailyTotalCreditAmount] = @creditTotalAmt
											,[DailyTotalRefundAmount] = @mealRefundTotalAmt 
											,[DailyTotalDepositRefAmount] = @depositRefundTotalAmt
											,[DailyBalance] = @dailyBalance
											,[DailyActiveMembers] = @dailyActiveMembers
											,[DailyNewMembers] = @dailyNewMembers
											,[GrandTotalDebitAmount] = @grandTotalDebitAmt
											,[GrandTotalCreditAmount] = @grandTotatCreditAmt
											,[GrandTotalTransBalance] = @grandTotalTransBalance
											,[GrandTotalActiveMembers] = @grandTotalActiveMembers
										WHERE [SummaryDate] = @summaryDate
										AND TransPoint = @oneLocation
									END
							END				
						ELSE 
							
							BEGIN
								-- #### Insert 
								Insert into [NC_DailySummary] 
								(
								[SummaryDate]
								,[TransPoint]
								,[DailyTotalDebitAmount]
								,[DailyTotalCreditAmount]
								,[DailyTotalRefundAmount]
								,[DailyTotalDepositRefAmount]
								,[DailyBalance]
								,[DailyActiveMembers]
								,[DailyNewMembers]
								,[GrandTotalTransBalance]
								,[GrandTotalDebitAmount]
								,[GrandTotalCreditAmount] 
								,[GrandTotalMemberBalance]
								,[GrandTotalActiveMembers]
								)
								values (
									@summaryDate
									,@oneLocation
									,@debitTotalAmt
									,@creditTotalAmt
									,@mealRefundTotalAmt 
									,@depositRefundTotalAmt
									,@dailyBalance
									,@dailyActiveMembers
									,@dailyNewMembers
									,@grandTotalTransBalance
									,@grandTotalDebitAmt
									,@grandTotatCreditAmt
									,@grandTotalMemberBalance
									,@grandTotalActiveMembers
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

			-- get next location
			FETCH NEXT FROM TransactionLocations INTO @oneLocation, @debitTotalAmt, @creditTotalAmt, 
				@mealRefundTotalAmt, @depositRefundTotalAmt, 
				@dailyBalance, 
				@dailyActiveMembers, @dailyNewMembers, @grandTotalActiveMembers, 
				@grandTotalDebitAmt, @grandTotatCreditAmt, 
				@grandTotalTransBalance, @grandTotalMemberBalance

		END

	CLOSE TransactionLocations
	DEALLOCATE TransactionLocations


END
