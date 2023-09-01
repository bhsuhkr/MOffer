
-- query to get all debit and credits for a given day
-- you can change the string date value folloing mm-dd-yyyy format
select nc_transactions.TransType, sum(nc_transactions.transamount) as 'Total Amount'
from nc_transactions 
where CONVERT(DATE, TransTime) = CONVERT(DATE, '08-20-2023')
group by nc_transactions.TransType
order by nc_transactions.TransType desc


-- query to get unique number of members who had transaction for a given day
-- you can change the string date value folloing mm-dd-yyyy format
select count(distinct nc_transactions.MemberID) as 'Unique number of Members'
from nc_transactions 
where CONVERT(DATE, TransTime) = CONVERT(DATE, '08-20-2023')

-- query to get refunds
-- this query finds all credit records with amount below 5 for a given day
select nc_transactions.MemberID, nc_transactions.TransType, nc_transactions.TransTime, nc_transactions.TransPmntMethod, nc_transactions.RunningBalance,transamount, nc_members.KoreanName, nc_members.ContId
from nc_transactions 
left join nc_members on nc_transactions.memberid = nc_members.memberid
where CONVERT(DATE, TransTime) = CONVERT(DATE, '8-20-2023')
and transtype in ('CREDIT', 'REFUND', 'CREDIT_ADM', 'CREDIT_SYS') and TransAmount < 5
order by TransTime desc


-- query to get unique number of members who had transaction for two Sundays
-- you can change the string date value folloing mm-dd-yyyy format
select count(distinct nc_transactions.MemberID) as 'Two Weeks'
from nc_transactions 
where CONVERT(DATE, TransTime) = CONVERT(DATE, '08-27-2023')
and nc_transactions.MemberID  in 
	(select distinct nc_transactions.MemberID
	from nc_transactions 
	where CONVERT(DATE, TransTime) = CONVERT(DATE, '08-20-2023'))

-- query to get unique number of members who started this week but not last week
-- you can change the string date value folloing mm-dd-yyyy format
select count(distinct nc_transactions.MemberID) as 'New this Week'
from nc_transactions 
where CONVERT(DATE, TransTime) = CONVERT(DATE, '08-27-2023')
and nc_transactions.MemberID  NOT in 
	(select distinct nc_transactions.MemberID
	from nc_transactions 
	where CONVERT(DATE, TransTime) = CONVERT(DATE, '08-20-2023'))
