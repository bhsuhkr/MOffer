USE [MOFFER]
GO
/****** Object:  StoredProcedure [dbo].[sp_createMember]    Script Date: 8/8/2023 8:05:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_createMember]
	-- Add the parameters for the stored procedure here
      @ContID nvarchar(50)
      ,@FirstName nvarchar(255)
      ,@LastName nvarchar(255)
      ,@KoreanName nvarchar(255)
      ,@ZipCode nvarchar(20)
      ,@Phone_Home nvarchar(20)
      ,@Phone_Work nvarchar(20)
      ,@Phone_Mobile nvarchar(20)
      ,@Email nvarchar(255)
      ,@DOB date

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @MemberID nvarchar(50), @FamilyID nvarchar(50), @nextSeq varchar(20)

	IF NOT EXISTS(select * from NC_Members where ContID=@ContID)
	BEGIN -- ### Start of IF
		BEGIN TRY
			-- Start a new transaction
			BEGIN TRANSACTION;
				select @nextSeq=varValue from NC_Variables where varName='MMR_SEQ'
				select @FamilyID='00'+@nextSeq
				select @MemberID=@FamilyID+'00'

				--### Insert into NC_Members

				insert into NC_Members(
				  [MemberID]
				  ,[FamilyID]
				  ,[ContID]
				  ,[FirstName]
				  ,[LastName]
				  ,[KoreanName]
				  ,[ZipCode]
				  ,[Phone_Home]
				  ,[Phone_Work]
				  ,[Phone_Mobile]
				  ,[Email]
				  ,[DOB]
				)
				values(
				  @MemberID
				  ,@FamilyID
				  ,@ContID 
				  ,@FirstName 
				  ,@LastName
				  ,@KoreanName 
				  ,@ZipCode 
				  ,@Phone_Home 
				  ,@Phone_Work 
				  ,@Phone_Mobile 
				  ,@Email 
				  ,@DOB 
				)

				update NC_Variables set varValue=convert(varchar(20),convert(int,@nextSeq)+1) where varName='MMR_SEQ'
			
			
			-- If everything is fine, commit the transaction
			COMMIT TRANSACTION;
		END TRY
		BEGIN CATCH
			IF @@TRANCOUNT > 0
				ROLLBACK TRANSACTION;

			-- Then throw the error message
			DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
			DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
			DECLARE @ErrorState INT = ERROR_STATE();

			RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
		END CATCH
	END -- ### END of IF
	ELSE
		select 'Existing Cont ID'

END
