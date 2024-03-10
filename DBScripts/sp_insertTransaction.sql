USE [MOFFER]
GO
/****** Object:  StoredProcedure [dbo].[sp_insertTransaction]    Script Date: 8/8/2023 8:07:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Stanley Kim
-- Create date: 6/10/2023
-- Description:	Insert Xact and update current balance automatically
-- Updated: 9/10/2023 to allow taking in refund transactions
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND OBJECT_ID = OBJECT_ID('dbo.sp_insertTransaction'))
   exec('CREATE PROCEDURE [dbo].[sp_insertTransaction] AS BEGIN SET NOCOUNT ON; END')
GO


ALTER PROCEDURE [dbo].[sp_insertTransaction]
	-- Add the parameters for the stored procedure here
	@memberID nvarchar(50),
	@transType varchar(10),
	@transItem varchar(50),
	@transAmt float,
	@transPmntMethod varchar(10),
	@transIP varchar(50),
	@transBrowser varchar(250),
	@transHostname varchar(250),
	@transUserId nvarchar(20),
	@transPoint varchar(10),
	@orderNumber varchar(50) = NULL

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @currBal float
	BEGIN TRY
		-- Start a new transaction
		BEGIN TRANSACTION;
			-- #### Checking Member ID 
			IF NOT EXISTS(select MemberID from NC_Members where MemberId=@memberID)
			BEGIN
				RAISERROR('Invalid Member ID',16,1)
			END
			-- #### Retrieving current balance
			select @currBal=CurrentBalance from NC_Members WITH (XLOCK) where MemberID=@memberID

			IF @transItem!='XACT' 
			BEGIN
				select @transAmt=Price from NC_Items where ItemNumber=@transItem
			END

			-- validation: only accept credit, debit or refund
			IF LEFT(@transType,3)<>'CRE' and LEFT(@transType,3)<>'DEB' AND LEFT(@transType, 7) <> 'PAY_REF' AND LEFT(@transType, 7) <> 'DEP_REF'
			BEGIN
				RAISERROR('TransType should start with either CREDIT or DEBIT or REFUND', 16, 1)
			END

			IF (LEFT(@transType, 7) = 'PAY_REF')
				SET @currBal = @currBal+@transAmt
			ELSE IF (left(@transType,3) = 'CRE')
				SET @currBal = @currBal+@transAmt
			ELSE IF (left(@transType,3) = 'DEB')
				SET @currBal = @currBal-@transAmt
			ELSE IF (left(@transType,7) = 'DEP_REF')
				SET @currBal = @currBal-@transAmt
			ELSE 
				SET @currBal = @currBal-@transAmt 
			
			-- #### Insert Xact
			Insert into NC_Transactions 
			(
			   [MemberID]
			  ,[TransType]
			  ,[TransItem]
			  ,[TransAmount]
			  ,[TransPmntMethod]
			  ,[TransTime]
			  ,[TransIP]
			  ,[TransHostname]
			  ,[TransBrowser]
			  ,[TransUserId]
			  ,[TransPoint]
			  ,[RunningBalance]
			  ,[OrderNumber]
			)
			values (
				@memberID
				,@transType
				,@transItem
				,@transAmt
				,@transPmntMethod
				,getdate()
				,@transIP
				,@transHostname
				,@transBrowser
				,@transUserId
				,@transPoint
				,@currBal
				,@orderNumber
			)

			-- update current balance
			update NC_Members set CurrentBalance=@currBal
			where MemberId=@memberID
		-- ...

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
