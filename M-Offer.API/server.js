const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();

// Enable CORS
app.use(cors());

// Database configuration
const dbConfig = {
  server: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database",
  options: {
    trustServerCertificate: true, // For development/testing purposes only
  },
};

// API endpoint to fetch data from SQL Express
app.get("/api/data", async (req, res) => {
  try {
    // Create a connection pool
    const pool = await sql.connect(dbConfig);

    // Execute a query
    const result = await pool.request().query("SELECT * FROM YourTable");

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/api/transactions", async (req, res) => {
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
