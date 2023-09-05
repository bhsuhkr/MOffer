USE [MOFFER]
GO

/*
* in case we need to drop and recreate them
DROP TABLE NC_Transactions;
DROP TABLE NC_Members;
DROP TABLE NC_Users;
DROP TABLE NC_UserRoles;
DROP TABLE NC_TransTypes;
DROP TABLE NC_TransPoints;
DROP TABLE NC_TransPmntMethods;
DROP TABLE NC_Items;
DROP TABLE NC_Variables;
*/

/****** Object:  Table [dbo].[NC_Variables]    Script Date: 8/8/2023 8:13:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_Variables](
	[varName] [varchar](50) NULL,
	[varValue] [varchar](250) NULL,
	[varDesc] [varchar](250) NULL
) ON [PRIMARY]
GO



/****** Object:  Table [dbo].[NC_TransTypes]    Script Date: 8/8/2023 8:12:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_TransTypes](
	[TransType] [varchar](10) NOT NULL,
	[TransDesc] [nvarchar](250) NULL,
 CONSTRAINT [PK_NC_TransTypes] PRIMARY KEY CLUSTERED 
(
	[TransType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO




/****** Object:  Table [dbo].[NC_TransPoints]    Script Date: 8/8/2023 8:11:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_TransPoints](
	[TransPoint] [varchar](10) NOT NULL,
	[TransPointDesc] [nvarchar](50) NULL,
 CONSTRAINT [PK_NC_TransPoints] PRIMARY KEY CLUSTERED 
(
	[TransPoint] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO




/****** Object:  Table [dbo].[NC_TransPmntMethods]    Script Date: 8/8/2023 8:11:46 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_TransPmntMethods](
	[TransPmntMethod] [varchar](10) NOT NULL,
	[TransPmntMethodDesc] [nvarchar](50) NULL,
 CONSTRAINT [PK_NC_TransPmntMethods] PRIMARY KEY CLUSTERED 
(
	[TransPmntMethod] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO



/****** Object:  Table [dbo].[NC_UserRoles]    Script Date: 8/8/2023 8:13:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_UserRoles](
	[Role] [varchar](10) NOT NULL,
	[RoleDesc] [nvarchar](50) NULL,
 CONSTRAINT [PK_NC_UserRoles] PRIMARY KEY CLUSTERED 
(
	[Role] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[NC_Users]    Script Date: 8/8/2023 8:12:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_Users](
	[UserId] [nvarchar](20) NOT NULL,
	[Password] [nvarchar](20) NULL,
	[FullName] [nvarchar](250) NULL,
	[Phone] [nvarchar](20) NULL,
	[Email] [nvarchar](250) NULL,
	[LastLoginTime] [datetime] NULL,
	[LastLoginIP] [nvarchar](50) NULL,
	[LastLoginHostname] [nvarchar](250) NULL,
	[Role] [varchar](10) NULL,
	[Active] [int] NULL,
	[RecId] [int] IDENTITY(1,1) NOT NULL,
	[RecCreatedDate] [datetime] NULL,
 CONSTRAINT [PK_NC_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[NC_Users] ADD  CONSTRAINT [DF_NC_Users_Active]  DEFAULT ((1)) FOR [Active]
GO

ALTER TABLE [dbo].[NC_Users] ADD  CONSTRAINT [DF_NC_Users_RecCreatedDate]  DEFAULT (getdate()) FOR [RecCreatedDate]
GO

ALTER TABLE [dbo].[NC_Users]  WITH CHECK ADD  CONSTRAINT [FK_NC_Users_NC_UserRoles] FOREIGN KEY([Role])
REFERENCES [dbo].[NC_UserRoles] ([Role])
GO

ALTER TABLE [dbo].[NC_Users] CHECK CONSTRAINT [FK_NC_Users_NC_UserRoles]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0=Inactive, 1=Active' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'NC_Users', @level2type=N'COLUMN',@level2name=N'Active'
GO


/****** Object:  Table [dbo].[NC_Members]    Script Date: 8/8/2023 8:11:09 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_Members](
	[MemberID] [nvarchar](50) NOT NULL,
	[MemberPassword] [varchar](50) NULL,
	[FamilyID] [nvarchar](50) NULL,
	[ContID] [nvarchar](50) NULL,
	[FirstName] [nvarchar](255) NULL,
	[LastName] [nvarchar](255) NULL,
	[KoreanName] [nvarchar](255) NULL,
	[ZipCode] [nvarchar](20) NULL,
	[Phone_Home] [nvarchar](20) NULL,
	[Phone_Work] [nvarchar](20) NULL,
	[Phone_Mobile] [nvarchar](200) NULL,
	[Email] [nvarchar](255) NULL,
	[DOB] [date] NULL,
	[Barcode1] [image] NULL,
	[Barcode2] [image] NULL,
	[Active] [int] NULL,
	[CurrentBalance] [float] NULL,
	[LastBalUpdate] [datetime] NULL,
	[LastBalUpdateBy] [nvarchar](20) NULL,
	[LastRecUpdate] [datetime] NULL,
	[LastRecUpdateBy] [nvarchar](20) NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_NC_Members_Unique] PRIMARY KEY CLUSTERED 
(
	[MemberID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[NC_Members] ADD  CONSTRAINT [DF_NC_Members_Active]  DEFAULT ((1)) FOR [Active]
GO

ALTER TABLE [dbo].[NC_Members] ADD  CONSTRAINT [DF_NC_Members_CurrentBalance]  DEFAULT ((0)) FOR [CurrentBalance]
GO

ALTER TABLE [dbo].[NC_Members] ADD  CONSTRAINT [DF_NC_Members_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO

ALTER TABLE [dbo].[NC_Members]  WITH CHECK ADD  CONSTRAINT [FK_NC_Members_NC_Users] FOREIGN KEY([LastRecUpdateBy])
REFERENCES [dbo].[NC_Users] ([UserId])
GO

ALTER TABLE [dbo].[NC_Members] CHECK CONSTRAINT [FK_NC_Members_NC_Users]
GO

ALTER TABLE [dbo].[NC_Members]  WITH CHECK ADD  CONSTRAINT [FK_NC_Members_NC_Users1] FOREIGN KEY([LastBalUpdateBy])
REFERENCES [dbo].[NC_Users] ([UserId])
GO

ALTER TABLE [dbo].[NC_Members] CHECK CONSTRAINT [FK_NC_Members_NC_Users1]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'0=Inactive, 1=Active' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'NC_Members', @level2type=N'COLUMN',@level2name=N'Active'
GO



/****** Object:  Table [dbo].[NC_Items]    Script Date: 8/8/2023 8:10:38 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_Items](
	[ItemNumber] [varchar](50) NOT NULL,
	[ItemDesc] [nvarchar](250) NULL,
	[Price] [float] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_NC_Items] PRIMARY KEY CLUSTERED 
(
	[ItemNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[NC_Items] ADD  CONSTRAINT [DF_NC_Items_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO


/****** Object:  Table [dbo].[NC_Transactions]    Script Date: 8/8/2023 8:11:29 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[NC_Transactions](
	[TransID] [int] IDENTITY(1,1) NOT NULL,
	[MemberID] [nvarchar](50) NULL,
	[TransType] [varchar](10) NULL,
	[TransItem] [varchar](50) NULL,
	[TransAmount] [float] NULL,
	[TransPmntMethod] [varchar](10) NULL,
	[TransTime] [datetime] NULL,
	[TransIP] [varchar](50) NULL,
	[TransHostname] [varchar](250) NULL,
	[TransBrowser] [varchar](250) NULL,
	[TransUserId] [nvarchar](20) NULL,
	[TransPoint] [varchar](10) NULL,
	[RunningBalance] [float] NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[NC_Transactions]  WITH CHECK ADD  CONSTRAINT [FK_NC_Transactions_NC_Items] FOREIGN KEY([TransItem])
REFERENCES [dbo].[NC_Items] ([ItemNumber])
GO

ALTER TABLE [dbo].[NC_Transactions] CHECK CONSTRAINT [FK_NC_Transactions_NC_Items]
GO

ALTER TABLE [dbo].[NC_Transactions]  WITH CHECK ADD  CONSTRAINT [FK_NC_Transactions_NC_Members] FOREIGN KEY([MemberID])
REFERENCES [dbo].[NC_Members] ([MemberID])
GO

ALTER TABLE [dbo].[NC_Transactions] CHECK CONSTRAINT [FK_NC_Transactions_NC_Members]
GO

ALTER TABLE [dbo].[NC_Transactions]  WITH CHECK ADD  CONSTRAINT [FK_NC_Transactions_NC_TransPmntMethods] FOREIGN KEY([TransPmntMethod])
REFERENCES [dbo].[NC_TransPmntMethods] ([TransPmntMethod])
GO

ALTER TABLE [dbo].[NC_Transactions] CHECK CONSTRAINT [FK_NC_Transactions_NC_TransPmntMethods]
GO

ALTER TABLE [dbo].[NC_Transactions]  WITH CHECK ADD  CONSTRAINT [FK_NC_Transactions_NC_TransPoints] FOREIGN KEY([TransPoint])
REFERENCES [dbo].[NC_TransPoints] ([TransPoint])
GO

ALTER TABLE [dbo].[NC_Transactions] CHECK CONSTRAINT [FK_NC_Transactions_NC_TransPoints]
GO

ALTER TABLE [dbo].[NC_Transactions]  WITH CHECK ADD  CONSTRAINT [FK_NC_Transactions_NC_TransTypes] FOREIGN KEY([TransType])
REFERENCES [dbo].[NC_TransTypes] ([TransType])
GO

ALTER TABLE [dbo].[NC_Transactions] CHECK CONSTRAINT [FK_NC_Transactions_NC_TransTypes]
GO



--DROP TABLE [dbo].[NC_DailySummary];
CREATE TABLE [dbo].[NC_DailySummary](
	[DSID] [int] IDENTITY(1,1) NOT NULL,
	[SummaryDate] [date] NOT NULL,
	[DailyTotalDebitAmount] [float] NOT NULL,
	[DailyTotalCreditAmount] [float] NOT NULL,
	[DailyTotalRefundAmount] [float] NOT NULL,
	[DailyBalance] [float] NOT NULL,
	[DailyActiveMembers] [int] NOT NULL,
	[GrandTotalTransBalance] [float] NOT NULL,
	[GrandTotalMemberBalance] [float] NOT NULL,
	[GrandTotalActiveMembers] [int] NOT NULL,
	[DailyNewMembers] [int] NOT NULL
) ON [PRIMARY]
GO