const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql/msnodesqlv8");

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

let config = require("./config.js");

console.log("config env: " + config.NODE_ENV);
console.log("config db: " + config.connectionString);

sql
  .connect(config)
  .then(async (pool) => {
    console.log("Connected to Database");

    const authenticateUser = async (req, res, next) => {
      const { username, password } = req.body;
      const user = await pool.query(
        "select * from nc_users where userid = '" + username + "' and password ='" + password + "'"
      );
      // console.log("user", user.recordset[0]);

      if (user && user.recordset && user.recordset.length) {
        req.user = username;
        req.role = user.recordset[0]["Role"];
        next();
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    };

    app.post("/api/auth/signin", authenticateUser, (req, res) => {
      res.json({
        message: "Access granted to protected route",
        user: req.user,
        role: req.role,
      });
    });

    app.get("/api/balance", async (req, res) => {
      try {
        pool.query(
          `select TOP 1 RunningBalance from  nc_transactions where memberid = ${req.query.memberId} ORDER BY TransTime DESC`,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              if (recordset && recordset.recordset && recordset.recordset[0]) {
                res.status(200).json({
                  message: "Balance fetched successfully",
                  balance: recordset.recordset[0].RunningBalance,
                });
              } else {
                res.status(200).json({
                  message: "No transaction history",
                  balance: 0,
                });
              }
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch a transaction" });
      }
    });

    app.get("/api/transaction", async (req, res) => {
      try {
        pool.query(
          `select TOP 1 nc_transactions.MemberID, nc_transactions.TransType, nc_transactions.TransTime, nc_transactions.RunningBalance, nc_members.KoreanName, nc_members.ContId
            from  nc_transactions left join nc_members on nc_transactions.memberid = nc_members.memberid
            where nc_transactions.memberid = ${req.query.memberId} ORDER BY TransTime DESC`,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Transaction fetched successfully",
                recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch a transaction" });
      }
    });

    app.get("/api/member/transactions", async (req, res) => {
      try {
        pool.query(
          `select nc_transactions.MemberID, nc_transactions.TransType, nc_transactions.TransTime, nc_transactions.RunningBalance, nc_members.KoreanName, nc_members.ContId
            from  nc_transactions left join nc_members on nc_transactions.memberid = nc_members.memberid
            where nc_transactions.memberid = ${req.query.memberId} ORDER BY TransTime DESC`,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: `Transactions for ${req.query.memberId} fetched successfully`,
                recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch a transaction" });
      }
    });

    // transactions made today from MAINCAFE
    app.get("/api/transactions", async (req, res) => {
      try {
        pool.query(
          `select nc_transactions.MemberID, nc_transactions.TransType, nc_transactions.TransTime, nc_transactions.RunningBalance, nc_members.KoreanName, nc_members.ContId
            from nc_transactions 
            left join nc_members on nc_transactions.memberid = nc_members.memberid
            where CONVERT(DATE, TransTime) = CONVERT(DATE, GETDATE()) AND nc_transactions.TransPoint='MAINCAFE'
            order by TransTime desc`,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Transactions fetched successfully",
                recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch transactions" });
      }
    });

    app.get("/api/email", async (req, res) => {
      try {
        pool.query(
          `select nc_members.Email from nc_members where nc_members.memberid = ${req.query.memberId}`,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              if (recordset && recordset.recordset && recordset.recordset[0]) {
                res.status(200).json({
                  message: "Email fetched successfully",
                  first_four_char_email: recordset.recordset[0].Email.substring(0, 4),
                });
              } else {
                res.status(200).json({
                  message: "No email found",
                });
              }
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch transactions" });
      }
    });

    app.get("/api/item-prices", async (req, res) => {
      try {
        pool.query(`select nc_items.price, nc_items.itemDesc, nc_items.itemNumber from nc_items`, (err, recordset) => {
          if (err) console.log(err);
          else {
            if (recordset && recordset.recordset) {
              res.status(200).json({
                message: "Items fetched successfully",
                items: recordset.recordset,
              });
            } else {
              res.status(200).json({
                message: "No item found",
              });
            }
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch transactions" });
      }
    });

    app.get("/api/member/id", async (req, res) => {
      try {
        pool.query(
          `exec sp_getMemberId
            ${req.query.phoneNumber}
          `,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              if (recordset && recordset.recordset && recordset.recordset[0]) {
                res.status(200).json({
                  memberId: recordset.recordset[0].MemberID,
                });
              } else {
                res.status(404).json({ error: "Can't find Member ID" });
              }
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch Member ID" });
      }
    });

    app.post("/api/member/register", async (req, res) => {
      try {
        pool.query(
          `exec sp_createMember
          '${req.body.phoneNumber}',
          '${req.body.engName}',
          null,
          N'${req.body.korName}',
          null,
          null,
          null,
          '${req.body.phoneNumber}',
          '${req.body.email}',
          null
          `,
          (err, recordset) => {
            if (err) console.log(err);
            else if (recordset && recordset.recordsets && recordset.recordsets[0] && recordset.recordsets[0][0]) {
              if (recordset.recordsets[0][0].Result == "Registered") {
                res.status(200).json({ message: "Successfully registered" });
              } else {
                res.status(400).json({
                  error: "Can't register with this number. Already existed.",
                });
              }
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't register" });
      }
    });

    app.post("/api/member/pay", async (req, res) => {
      try {
        pool.query(
          `exec sp_insertTransaction 
        '${req.body.memberId}',
        'DEBIT',
        'MAINMEAL',
        0,
        'SCAN',
        '${req.body.ipAddress}',
        'LAPTOP21',
        '${req.body.browserName}',
        '${req.body.username}', 
        'MAINCAFE'
        `,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Paid successfully",
                data: recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't make a payment" });
      }
    });

    app.post("/api/member/pay-cafe", async (req, res) => {
      try {
        pool.query(
          `exec sp_insertTransaction 
        '${req.body.memberId}',
        '${req.body.transType}',
        '${req.body.item}',
        0,
        '${req.body.paymentMethod}',
        '${req.body.ipAddress}',
        'LAPTOP21',
        '${req.body.browserName}',
        '${req.body.username}', 
        'BOOKCAFE'
        `,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Paid successfully",
                data: recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't make a payment" });
      }
    });

    app.post("/api/member/deposit", async (req, res) => {
      try {
        pool.query(
          `exec sp_insertTransaction 
        '${req.body.memberId}',
        'CREDIT',
        'XACT',
        ${req.body.amount},
        '${req.body.transType}',
        '${req.body.ipAddress}',
        'LAPTOP21',
        '${req.body.browserName}',
        '${req.body.username}', 
        'MAINCAFE'
        `,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Added deposit successfully",
                data: recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't make a deposit" });
      }
    });

    app.post("/api/member/refund", async (req, res) => {
      try {
        pool.query(
          `exec sp_insertTransaction 
        '${req.body.memberId}',
        'CREDIT',
        'XACT',
        '2',
        'CASH',
        '${req.body.ipAddress}',
        'LAPTOP21',
        '${req.body.browserName}',
        '${req.body.username}', 
        'MAINCAFE'
        `,
          (err, recordset) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Refunded successfully",
                data: recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't make a deposit" });
      }
    });

    app.get("/api/report/tx/dailytotal", async (req, res) => {
      try {
        let whereClause = "";
        if (req.query.date !== undefined && req.query.date !== "")
          whereClause = ` WHERE SummaryDate = CONVERT(DATE, '${req.query.date}') `;

        let queryString = `SELECT [DSID]
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
          from [NC_DailySummary] 
          ${whereClause} 
          order by [SummaryDate] desc`;
        //console.log (queryString);

        pool.query(queryString, (err, recordset) => {
          if (err) console.log(err);
          else {
            res.status(200).json({
              message: "Report fetched successfully",
              recordset,
            });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Can't fetch report" });
      }
    });
  })
  .catch((err) => console.log("Database Connection Failed", err));

// Start the server
if (config.database === "moffer") {
  app.listen(3000, () => {
    console.log("Server is running on http://172.16.1.154:3000");
  });
} else {
  app.listen(3001, () => {
    console.log("Dev Mode: server is running on http://172.16.1.154:3001");
  });
}
