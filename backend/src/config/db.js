const { Pool } = require("pg");
const logger = require("./logger");
require("dotenv").config();
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});

const connectDB = async () => {
  try {
    await pool.connect();
    logger.info("PostgreSQL Connected");
    
    // Only run init SQL if we're in development or if explicitly requested
    if (process.env.NODE_ENV === 'development' || process.env.INIT_DB === 'true') {
      try {
        const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql')).toString();
        await pool.query(initSQL);
        logger.info("Database initialized with tables");
      } catch (initError) {
        logger.warn("Database initialization failed (tables may already exist):", initError.message);
      }
    }
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };