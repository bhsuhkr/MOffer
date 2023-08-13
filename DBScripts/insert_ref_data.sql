USE [MOFFER]
GO
INSERT [dbo].[NC_Items] ([ItemNumber], [ItemDesc], [Price], [CreatedDate]) VALUES (N'2NDMEAL', N'Meals in 2nd floor cafe', 2, CAST(N'2023-06-08T22:26:17.017' AS DateTime))
GO
INSERT [dbo].[NC_Items] ([ItemNumber], [ItemDesc], [Price], [CreatedDate]) VALUES (N'COFFEE', N'Coffee', 1.5, CAST(N'2023-06-08T22:24:51.890' AS DateTime))
GO
INSERT [dbo].[NC_Items] ([ItemNumber], [ItemDesc], [Price], [CreatedDate]) VALUES (N'ICEAMER', N'Ice Americano', 1, CAST(N'2023-06-08T22:24:06.140' AS DateTime))
GO
INSERT [dbo].[NC_Items] ([ItemNumber], [ItemDesc], [Price], [CreatedDate]) VALUES (N'MAINMEAL', N'Meals in Main Cafeteria', 2, CAST(N'2023-06-08T22:23:46.990' AS DateTime))
GO
INSERT [dbo].[NC_Items] ([ItemNumber], [ItemDesc], [Price], [CreatedDate]) VALUES (N'SANDWICH', N'Sandwich', 3, CAST(N'2023-06-08T22:25:11.140' AS DateTime))
GO
INSERT [dbo].[NC_Items] ([ItemNumber], [ItemDesc], [Price], [CreatedDate]) VALUES (N'XACT', N'Transactions', 0, CAST(N'2023-06-10T23:39:18.030' AS DateTime))
GO
INSERT [dbo].[NC_TransPmntMethods] ([TransPmntMethod], [TransPmntMethodDesc]) VALUES (N'CASH', N'Cash')
GO
INSERT [dbo].[NC_TransPmntMethods] ([TransPmntMethod], [TransPmntMethodDesc]) VALUES (N'CC', N'Credit Card')
GO
INSERT [dbo].[NC_TransPmntMethods] ([TransPmntMethod], [TransPmntMethodDesc]) VALUES (N'CHECK', N'Check')
GO
INSERT [dbo].[NC_TransPmntMethods] ([TransPmntMethod], [TransPmntMethodDesc]) VALUES (N'PAYPAL', N'PayPal')
GO
INSERT [dbo].[NC_TransPmntMethods] ([TransPmntMethod], [TransPmntMethodDesc]) VALUES (N'SCAN', N'Scanner')
GO
INSERT [dbo].[NC_TransPmntMethods] ([TransPmntMethod], [TransPmntMethodDesc]) VALUES (N'VENMO', N'Venmo')
GO
INSERT [dbo].[NC_TransPmntMethods] ([TransPmntMethod], [TransPmntMethodDesc]) VALUES (N'ZELLE', N'Zelle')
GO
INSERT [dbo].[NC_TransPoints] ([TransPoint], [TransPointDesc]) VALUES (N'2F_CAFE', N'Second Floor Cafeteria')
GO
INSERT [dbo].[NC_TransPoints] ([TransPoint], [TransPointDesc]) VALUES (N'ACCT_OFFC', N'Accounting Office')
GO
INSERT [dbo].[NC_TransPoints] ([TransPoint], [TransPointDesc]) VALUES (N'CHR_OFFC', N'Church Office')
GO
INSERT [dbo].[NC_TransPoints] ([TransPoint], [TransPointDesc]) VALUES (N'MAINCAFE', N'Main Cafetria (Gym)')
GO
INSERT [dbo].[NC_TransTypes] ([TransType], [TransDesc]) VALUES (N'CREDIT', N'Credit')
GO
INSERT [dbo].[NC_TransTypes] ([TransType], [TransDesc]) VALUES (N'CREDIT_ADM', N'Administrative Credit')
GO
INSERT [dbo].[NC_TransTypes] ([TransType], [TransDesc]) VALUES (N'CREDIT_SYS', N'Credit by System')
GO
INSERT [dbo].[NC_TransTypes] ([TransType], [TransDesc]) VALUES (N'DEBIT', N'Debit')
GO
INSERT [dbo].[NC_TransTypes] ([TransType], [TransDesc]) VALUES (N'DEBIT_ADM', N'Administrative Debit')
GO
INSERT [dbo].[NC_TransTypes] ([TransType], [TransDesc]) VALUES (N'DEBIT_SYS', N'Debit by System')
GO
INSERT [dbo].[NC_TransTypes] ([TransType], [TransDesc]) VALUES (N'REFUND', N'Refund')
GO
INSERT [dbo].[NC_UserRoles] ([Role], [RoleDesc]) VALUES (N'ADMIN', N'Administrators')
GO
INSERT [dbo].[NC_UserRoles] ([Role], [RoleDesc]) VALUES (N'MANAGER', N'Managers')
GO
INSERT [dbo].[NC_UserRoles] ([Role], [RoleDesc]) VALUES (N'USER', N'Regular Users')
GO
INSERT [dbo].[NC_Variables] ([varName], [varValue], [varDesc]) VALUES (N'MNGR_PW', N'newsong7654', N'Manager Password')
GO
INSERT [dbo].[NC_Variables] ([varName], [varValue], [varDesc]) VALUES (N'MMR_SEQ', N'7410', N'Member Next Number')
GO
INSERT [dbo].[NC_Variables] ([varName], [varValue], [varDesc]) VALUES (N'MMEAL_CRD', N'1q2w3e4r%T', N'MainMeal Credit Password')
GO
INSERT [dbo].[NC_Variables] ([varName], [varValue], [varDesc]) VALUES (N'MAX_NEG', N'-10', N'Maximum negative balace allowance')
GO
