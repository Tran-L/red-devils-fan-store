const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const databasePath =
    process.env.DATABASE_PATH || path.join(__dirname, "database", "store.db");

const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.run("PRAGMA foreign_keys = ON");

module.exports = db;