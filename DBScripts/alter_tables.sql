USE [MOFFER]
GO

/*
 * We added new colume to store library card number to match members
 * Date: 1/10/2024
 */

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
 
ALTER TABLE [dbo].[NC_Members]
ADD LibraryCardNumber VARCHAR(20) NULL ;