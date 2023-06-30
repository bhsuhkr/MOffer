const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql/msnodesqlv8");

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

const config = {
  database: "moffer",
  server: "DESKTOP-4SIT040\\SQLEXPRESS",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

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
      console.log("user", user.recordset[0]);

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

    app.post("/api/transaction", async (req, res) => {
      try {
        pool.query(
          "select TransType, TransTime, RunningBalance from  nc_transactions where memberid = '" +
            req.body.memberId +
            "'",
          function (err, recordset) {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Paid successfully",
                recordset,
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    });

    app.get("/api/member/id", async (req, res) => {
        try {
          pool.query(
            `exec sp_getMemberId
            ${req.body.contId}
          `,
            function (err,recordset) {
              if (err) console.log(err);
              else {
                res.status(200).json({
                  memgerId: recordset.recordset[0].MemberID
                });
              }
            }
          );
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Can't fetch Member ID" });
        }
      });

    app.get("/api/member/pay", async (req, res) => {
      try {
        pool.query(
          `exec sp_insertTransaction
        '00731100',
        'DEBIT',
        'MAINMEAL',
        0,
        'SCAN',
        '172.16.1.25',
        'LAPTOP21',
        'MS EDGE',
        'bsuh', 
        'MAINCAFE'
        `,
          function (err, recordset) {
            if (err) console.log(err);
            else {
              res.status(200).json({
                message: "Paid successfully",
                data: recordset
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    });
  })
  .catch((err) => console.log("Database Connection Failed", err));

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
