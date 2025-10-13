const { Pool } = require("pg");
const logger = require("./logger");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const pool = new Pool({
    connectionString: process.env.PG_URI,
    ssl:
        process.env.NODE_ENV === "production"
            ? {
                  rejectUnauthorized: false,
              }
            : false,
});

// Global flag to indicate if database is available
let isDatabaseAvailable = false;

const connectDB = async () => {
    try {
        await pool.connect();
        logger.info("PostgreSQL Connected");
        isDatabaseAvailable = true;

        // Only run init SQL if we're in development or if explicitly requested
        if (
            process.env.NODE_ENV === "production" ||
            process.env.INIT_DB === "true"
        ) {
            try {
                const initSQL = fs
                    .readFileSync(path.join(__dirname, "init.sql"))
                    .toString();
                await pool.query(initSQL);
                logger.info("Database initialized with tables");
            } catch (initError) {
                logger.warn(
                    "Database initialization failed (tables may already exist):",
                    initError.message
                );
            }
        }
    } catch (error) {
        logger.warn("Database connection failed, using mock data mode:", error.message);
        isDatabaseAvailable = false;
        // Don't exit process - continue with mock data
    }
};

// Function to check if database is available
const isDBAvailable = () => {
    return isDatabaseAvailable;
};

module.exports = { connectDB, pool, isDBAvailable };
