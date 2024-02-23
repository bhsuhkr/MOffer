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

ALTER TABLE [dbo].[NC_DailySummary]
ADD TransPoint VARCHAR(10) NULL ;

ALTER TABLE [dbo].[NC_DailySummary]  WITH CHECK ADD  CONSTRAINT [FK_NC_DailySummary_NC_TransPoint] FOREIGN KEY([TransPoint])
REFERENCES [dbo].[NC_TransPoints] ([TransPoint])
GO

ALTER TABLE [dbo].[NC_DailySummary]
ADD DailyTotalDepositRefAmount float NULL ;

ALTER TABLE [dbo].[NC_DailySummary]
ADD GrandTotalDebitAmount float NULL ;

ALTER TABLE [dbo].[NC_DailySummary]
ADD GrandTotalCreditAmount float NULL ;
