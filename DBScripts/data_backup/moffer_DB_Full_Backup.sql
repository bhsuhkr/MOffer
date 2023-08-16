USE master
GO

DECLARE @dateString VARCHAR(20)
SET @dateString = CONVERT(VARCHAR, GETDATE(), 112) + '_' + 
                  REPLACE(CONVERT(VARCHAR, GETDATE(), 108), ':', '')

DECLARE @backupPath VARCHAR(255)
SET @backupPath = 'C:\Backup\MOFFER_FULL_' + @dateString + '.bak' 

BACKUP DATABASE [MOFFER]
TO DISK = @backupPath
WITH INIT;
