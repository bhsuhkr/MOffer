const express = require("express");
const cors = require("cors");
const sql = require("mssql/msnodesqlv8");

const app = express();

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

    return pool;
  })
  .catch((err) => console.log("Database Connection Failed", err));

app.get("/api/test", async (req, res) => {
  try {
    res.json([
      {
        ID: "01",
        Name: "Abiola Esther",
        Balance: "17",
      },
      {
        ID: "02",
        Name: "Robert V. Kratz",
        Balance: "19",
      },
      {
        ID: "03",
        Name: "Kristen Anderson",
        Balance: "20",
      },
      {
        ID: "04",
        Name: "Adam Simon",
        Balance: "21",
      },
      {
        ID: "05",
        Name: "Daisy Katherine",
        Balance: "22",
      },
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
