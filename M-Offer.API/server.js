const express = require("express");
const sql = require("mssql");

const app = express();

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

app.get("/tests", async (req, res) => {
  try {
    res.send("<htm><h1>Hello World!</h1></htm>");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
