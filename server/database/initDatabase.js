const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const databasePath =
    process.env.DATABASE_PATH || path.join(__dirname, "store.db");

const schemaPath = path.join(__dirname, "schema.sql");
const seedPath = path.join(__dirname, "seed.sql");

const db = new sqlite3.Database(databasePath);

const runSqlScript = (script) => {
    return new Promise((resolve, reject) => {
        db.exec(script, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

const runSqlQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(this);
            }
        });
    });
};

const initialiseDatabase = async () => {
    try {
        const schema = fs.readFileSync(schemaPath, "utf8");
        const seed = fs.readFileSync(seedPath, "utf8");

        await runSqlScript(schema);
        await runSqlScript(seed);

        const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
        const userPasswordHash = await bcrypt.hash("User123!", 10);

        await runSqlQuery(
            `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      `,
            ["Admin User", "admin@redstore.com", adminPasswordHash, "admin"]
        );

        await runSqlQuery(
            `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      `,
            ["Demo User", "user@redstore.com", userPasswordHash, "user"]
        );

        console.log("Database initialised successfully.");
        console.log("Admin login: admin@redstore.com / Admin123!");
        console.log("User login: user@redstore.com / User123!");
    } catch (error) {
        console.error("Database initialisation failed:", error.message);
    } finally {
        db.close();
    }
};

initialiseDatabase();