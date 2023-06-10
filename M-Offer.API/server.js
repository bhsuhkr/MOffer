const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql/msnodesqlv8");
// const jwt = require("jsonwebtoken");

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

// function createToken(payload) {
//   return jwt.sign(payload, "newsongtest");
// }

// function verifyToken(token) {
//   return jwt.verify(token, "newsongtest");
// }

sql
  .connect(config)
  .then(async (pool) => {
    console.log("Connected to Database");

    // Middleware to authenticate user
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
        // const accessToken = createToken({ id: username });
        // res.cookie("sessionCookieName", accessToken, { httpOnly: true });
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

    app.get("/api/transactions", async (req, res) => {
      try {
        pool.query("select * from nc_transactions", function (err, recordSet) {
          if (err) console.log(err);
          else {
            console.log(recordSet);
            res.json(recordSet);
          }
        });
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
