const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql/msnodesqlv8");

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

let config = {
  database: "moffer",
  server: "DESKTOP-4SIT040\\SQLEXPRESS",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

if (process.argv.length >= 3 && process.argv[2] === "--dev") {
  config.database = "moffer_qa";
}

sql
  .connect(config)
  .then(async (pool) => {
    console.log("Connected to Database");

    const authenticateUser = async (req, res, next) => {
      const { username, password } = req.body;
      const user = await pool.query(
        "select * from nc_users where userid = '" +
          username +
          "' and password ='" +
          password +
          "'"
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

    app.get("/api/transactions", async (req, res) => {
      try {
        pool.query(
          `select nc_transactions.MemberID, nc_transactions.TransType, nc_transactions.TransTime, nc_transactions.RunningBalance, nc_members.KoreanName, nc_members.ContId
            from nc_transactions 
            left join nc_members on nc_transactions.memberid = nc_members.memberid
            where CONVERT(DATE, TransTime) = CONVERT(DATE, GETDATE())
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

    app.get("/api/member/id", async (req, res) => {
      try {
        pool.query(
          `exec sp_getMemberId
            ${req.query.contId}
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
        'ACCT_OFFC'
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
        'ACCT_OFFC'
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
  })
  .catch((err) => console.log("Database Connection Failed", err));

// Start the server
app.listen(3000, () => {
  if (config.database === "moffer") {
    console.log("Server is running on http://172.16.1.154:3000");
  } else {
    console.log("Dev Mode: Server is running on http://172.16.1.154:3000");
  }
});
