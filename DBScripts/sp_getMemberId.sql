USE [MOFFER]
GO
/****** Object:  StoredProcedure [dbo].[sp_getMemberId]    Script Date: 8/8/2023 8:06:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND OBJECT_ID = OBJECT_ID('dbo.sp_getMemberId'))
   exec('CREATE PROCEDURE [dbo].[sp_getMemberId] AS BEGIN SET NOCOUNT ON; END')
GO


ALTER PROCEDURE  [dbo].[sp_getMemberId] @ContId nvarchar(50) 
-- =============================================
-- Author:		Jung Yang
-- Create date: 1/10/2024
-- Description:	Stored procedure for identifying member id based on CondId (phone number) or Library card number
-- =============================================
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @MemberID nvarchar(50)
    -- Insert statements for procedure here
	IF EXISTS (select MemberID from [dbo].[NC_Members] where ContID=@ContId OR LibraryCardNumber=@ContId)
		SELECT @MemberID=MemberID from [dbo].[NC_Members] where ContID=@ContId OR LibraryCardNumber=@ContId
	ELSE
		SELECT @MemberID='NONE'

	SELECT @MemberID as MemberID
	
END
