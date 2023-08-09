USE [MOFFER]
GO
/****** Object:  StoredProcedure [dbo].[sp_getMemberId]    Script Date: 8/8/2023 8:06:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_getMemberId] @ContId nvarchar(50) 
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @MemberID nvarchar(50)
    -- Insert statements for procedure here
	IF EXISTS (select MemberID from [dbo].[NC_Members] where ContID=@ContId)
		SELECT @MemberID=MemberID from [dbo].[NC_Members] where ContID=@ContId
	ELSE
		SELECT @MemberID='NONE'

	SELECT @MemberID as MemberID
	
END
