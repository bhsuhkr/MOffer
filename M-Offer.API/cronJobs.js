const cron = require('node-cron');
const sql = require("mssql/msnodesqlv8");

let config = require("./config.js");
// currency formatter
let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// mail configuration
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailHost,
    auth: {
        user: config.emailFromAddress,
        pass: config.emailFromAddressPwd
    },
});


/**
 * Cron to run daily summary job
 * this will generate daily summary record in database with daily totals and grand totals
 */
function runDailySummary() {
    let summaryDate = new Date().toLocaleDateString();
    console.log('Cron job runDailySummary starting...', new Date().toLocaleString());
    sql
        .connect(config)
        .then(async (pool) => {
            //console.log("Connected to Database");
            try {
                pool.query(`exec sp_processDailySummary '` + summaryDate + `', 1`,
                    (err, recordset) => {
                        if (err) console.log(err);
                        else {
                            console.log("executed sp_processDailySummary for " + summaryDate);
                        }
                    }
                );
            } catch (error) {
                console.error(error);
            }
        })
        .catch((err) => console.log("Database Connection Failed", err));
    console.log('Cron job runDailySummary executed at:', new Date().toLocaleString());
}

/**
 * Cron to email daily recon to configured email addresses (ex. offering@newsongdallas.org)
 * this will retrieve current date's daily summary and send an email
 */
function runDailyEmailRecon() {
    let summaryDate = new Date().toLocaleDateString();
    let htmlContent = new String();
    // if (config.NODE_ENV === "dev")
    //     summaryDate = '1/14/2024';
    console.log('Cron job runDailyEmailRecon starting...', new Date().toLocaleString());
    sql
        .connect(config)
        .then(async (pool) => {
            //console.log("Connected to Database");
            try {
                await pool.query(`SELECT [DSID]
                ,[SummaryDate]
                ,[DailyTotalDebitAmount]
                ,[DailyTotalCreditAmount]
                ,[DailyTotalRefundAmount]
                ,[DailyBalance]
                ,[DailyActiveMembers]
                ,[GrandTotalTransBalance]
                ,[GrandTotalMemberBalance]
                ,[GrandTotalActiveMembers]
                ,[DailyNewMembers]
                ,[TransPoint]
                from [NC_DailySummary] 
                where SummaryDate = '${summaryDate}' 
                order by [SummaryDate] desc`,
                    (err, recordset) => {
                        if (err) console.log(err);
                        else {
                            if (recordset && recordset.recordsets && recordset.recordsets[0] && recordset.recordsets[0][0]) {
                                console.log("find daily summary records: " + recordset.recordsets[0].length);

                                // for each summary record, compile the html content
                                for (index = 0; index < recordset.recordsets[0].length; index++) {

                                    console.log("daily summary record ID: " + recordset.recordsets[0][index].DSID);
                                    if (index === 0) {
                                        htmlContent = "<p>This email is for <b>New Song POS Reconciliation</b>."
                                            + "<p><b>Here is Today's (" + summaryDate + ") Summary:</b><br>"
                                            + "<table style='border: 1px solid black; border-collapse: collapse; cell-padding:30;'>"
                                            + "<tr style='border: 1px solid black; border-collapse: collapse; vertical-align:bottom;'>"
                                            + "<th>Location</th><th>Daily<br>Credit</th><th>Daily<br>Debit</th><th>Meal<br>Refund</th>"
                                            + "<th>Daily<br>Balance</th><th>Members<br>Active</th><th>Members<br>New</th>"
                                            + "<th>Members<br>Total</th><th>Members<br>Balance</th><th>Transaction<br>Balance</th>"
                                            + "</tr>";
                                    }
                                    htmlContent = htmlContent
                                        + "<tr style='border: 1px solid black; border-collapse: collapse;'>"
                                        + "<td align=center><font color='blue'><b>" + recordset.recordsets[0][index].TransPoint + "</b></font>"
                                        + "<td align=right><font color='blue'><b>" + USDollar.format(recordset.recordsets[0][index].DailyTotalCreditAmount) + "</b></font>"
                                        + "<td align=right><font color='blue'><b>" + USDollar.format(recordset.recordsets[0][index].DailyTotalDebitAmount) + "</b></font>"
                                        + "<td align=right><font color='blue'><b>" + USDollar.format(recordset.recordsets[0][index].DailyTotalRefundAmount) + "</b></font>"
                                        + "<td align=right><font color='blue'><b>" + USDollar.format(recordset.recordsets[0][index].DailyBalance) + "</b></font>"
                                        + "<td align=center><font color='blue'><b>" + recordset.recordsets[0][index].DailyActiveMembers + "</b></font>"
                                        + "<td align=center><font color='blue'><b>" + recordset.recordsets[0][index].DailyNewMembers + "</b></font>"
                                        + "<td align=center><font color='green'><b>" + recordset.recordsets[0][index].GrandTotalActiveMembers + "</b></font>"
                                        + "<td align=right><font color='green'><b>" + USDollar.format(recordset.recordsets[0][index].GrandTotalMemberBalance) + "</b></font>"
                                        + "<td align=right><font color='green'><b>" + USDollar.format(recordset.recordsets[0][index].GrandTotalTransBalance) + "</b></font>"
                                        + "</tr>"
                                    if (index === recordset.recordsets[0].length - 1) {
                                        htmlContent = htmlContent + "</table>"
                                            + "<p style='font-size:10px; color:black;'>Legend: "
                                            + "<br>Credit = Daily Total Deposits"
                                            + "<br>Debit = Daily Total Purchases"
                                            + "<br>Meal Refund = Daily Total Purchase Refund"
                                            + "<br>Daily Balance = Credit - Debit + Refunds"
                                            + "<br>Members Active = Members with at least One Purchase"
                                            + "<br>Members New = First-time Members for Today"
                                            + "<br>Members Total = Total Members with at least One Purchase"
                                            + "<br>Member Balance = Total Balance calculated using Member Balances"
                                            + "<br>Transaction Balance = Total Balance calculated using Transactions"
                                            + "<p style='font-size:12px; color:black;'>--- End of the daily summary email ---";
                                    }
                                }

                                if (htmlContent.length > 0) {
                                    transporter.verify()
                                        .then(console.log("Email host", config.emailHost, "connected using", config.emailFromAddress))
                                        .catch(console.error);
                                    transporter.sendMail({
                                        from: config.emailFromAddress, // sender address
                                        to: config.cronDailyEmailReconToAddress, // list of receivers
                                        subject: config.cronDailyEmailReconSubject, // Subject line
                                        html: htmlContent // plain text body
                                    }).then(info => {
                                        //console.log({ info });
                                        console.log('Cron job runDailyEmailRecon sent email to', config.cronDailyEmailReconToAddress, 'at', new Date().toLocaleString());
                                    }).catch(console.error);
                                }
                            } else {
                                // when there is no record for today
                                console.log("Cron job runDailyEmailRecon did not have any records to send at", new Date().toLocaleString());
                            }
                        }
                    }
                );
            } catch (error) {
                console.error(error);
            }
        })
        .catch((err) => console.log("Database Connection Failed", err));

    console.log('Cron job runDailyEmailRecon executed at:', new Date().toLocaleString());
}

/**
 * Cron to email daily receipt to member email addresses 
 * this will retrieve uqniey member record who had any transaction for a given day and
 * email their respective transaction details
 */
function runDailyEmailMemberReceipt() {
    let receiptSent = 0;
    console.log('Cron job runDailyEmailMemberReceipt starting...', new Date().toLocaleString());
    sql
        .connect(config)
        .then(async (pool) => {
            //console.log("Connected to Database");
            try {
                pool.query(`select distinct memberId from nc_transactions where CONVERT(DATE, TransTime) = '2024-01-14'`,
                    (err, recordset) => {
                        if (err) console.log(err);
                        else {
                            if (recordset && recordset.recordsets && recordset.recordsets[0] && recordset.recordsets[0][0]) {
                                console.log("find all members who had transactions: " + recordset.recordsets[0].length);
                                console.log("first member who had at least one transaction: " + recordset.recordsets[0][0].memberId);
                                for (var i = 0; i < recordset.recordsets[0].length; i++) {
                                    //console.log(recordset.recordsets[0][i].memberId);
                                    // for each member, we need to compile a receipt for the day
                                    receiptSent++;
                                }
                            }
                        }
                    }
                );
            } catch (error) {
                console.error(error);
            }
        })
        .catch((err) => console.log("Database Connection Failed", err));

    console.log('Cron job runDailyEmailMemberReceipt sent email to', receiptSent, 'members');
    console.log('Cron job runDailyEmailMemberReceipt executed at:', new Date().toLocaleString());
}

// schedule runDailySummary based on configuration
console.log("runDailySummary: " + config.cronDailySummary);
cron.schedule(config.cronDailySummary, () => {
    runDailySummary();
});

// schedule runDailyEmailRecon based on configuration
console.log("runDailyEmailRecon: " + config.cronDailyEmailRecon);
cron.schedule(config.cronDailyEmailRecon, () => {
    runDailyEmailRecon();
});

// schedule runDailyEmailMemberReceipt based on configuration
console.log("runDailyEmailMemberReceipt: " + config.cronDailyEmailMemberReceipt);
cron.schedule(config.cronDailyEmailMemberReceipt, () => {
    runDailyEmailMemberReceipt();
});

