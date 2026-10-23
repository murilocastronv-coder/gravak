"use strict";

const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require("./schema");

// Load environment variables
require("dotenv").config();

let db = null;
let pool = null;

async function ensureSchema() {
    const connection = getDatabase();
    await pool.query("CREATE SCHEMA IF NOT EXISTS gravak_test");
    await pool.query(`CREATE TABLE IF NOT EXISTS gravak_test.accounts (
        id SERIAL PRIMARY KEY,
        account VARCHAR(32) NOT NULL,
        hash VARCHAR(60) NOT NULL,
        name VARCHAR(32) NOT NULL,
        character TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )`);
    await pool.query("CREATE UNIQUE INDEX IF NOT EXISTS account_name_unique ON gravak_test.accounts (account, name)");
    return connection;
}

/**
 * Initialize the database connection
 * @returns {Object} Drizzle database instance
 */
function initDatabase() {
    if (db) {
        return db;
    }

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            "DATABASE_URL environment variable is not set. " +
            "Please create a .env file with DATABASE_URL=postgresql://user:password@localhost:5432/t_engine"
        );
    }

    pool = new Pool({
        connectionString,
        max: 10, // Maximum number of connections in the pool
    });

    db = drizzle(pool, { schema });

    console.log("PostgreSQL database connection initialized");

    return db;
}

/**
 * Get the database instance (initializes if not already done)
 * @returns {Object} Drizzle database instance
 */
function getDatabase() {
    if (!db) {
        return initDatabase();
    }
    return db;
}

/**
 * Close the database connection
 */
async function closeDatabase() {
    if (pool) {
        await pool.end();
        pool = null;
        db = null;
        console.log("PostgreSQL database connection closed");
    }
}

module.exports = {
    initDatabase,
    getDatabase,
    closeDatabase,
    ensureSchema,
    schema,
};
