const { Pool } = require("pg");
const logger = require("./logger");
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.PG_URI, // Example: "postgres://user:password@localhost:5432/mydb"
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    await pool.connect();
    logger.info("PostgreSQL Connected");
    const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql')).toString();
    await pool.query(initSQL);
    logger.info("Database initialized with tables")
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };