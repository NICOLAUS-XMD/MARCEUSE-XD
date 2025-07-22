require("dotenv").config();
const { Pool} = require("pg");
const s = require("../set");

// Retrieve the database URL from config or use fallback
const dbUrl = s.DATABASE_URL
? s.DATABASE_URL
: "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
},
};

// Initialize PostgreSQL pool
const pool = new Pool(proConfig);

// Function to create the "events" table
const createEventsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        jid TEXT UNIQUE,
        welcome TEXT DEFAULT 'non',
        goodbye TEXT DEFAULT 'non',
        antipromote TEXT DEFAULT 'non',
        antidemote TEXT DEFAULT 'non'
);
    `);
    console.log("The 'events' table was created successfully.");
} catch (error) {
    console.error("Error creating the 'events' table:", error);
}
};

// Execute table creation on startup
createEventsTable();

// Function to assign a value to a specified column for a given JID
async function setEventValue(jid, column, value) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM events WHERE jid = $1", [jid]);
    const jidExists = result.rows.length> 0;

    if (jidExists) {
      await client.query(`UPDATE events SET ${column} = $1 WHERE jid = $2`, [value, jid]);
      console.log(`Updated column '${column}' to '${value}' for JID ${jid}`);
} else {
      await client.query(`INSERT INTO events (jid, ${column}) VALUES ($1, $2)`, [jid, value]);
      console.log(`Inserted new JID ${jid} with column '${column}' set to '${value}'`);
}
} catch (error) {
    console.error("Error updating the events table:", error);
} finally {
    client.release();
}
}

// Function to retrieve the value of a specific column for a given JID
async function getEventValue(jid, column) {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT ${column} FROM events WHERE jid = $1`, [jid]);
    return result.rows.length> 0? result.rows[0][column]: "non";
} catch (error) {
    console.error("Error retrieving event value:", error);
    return "non";
} finally {
    client.release();
}
}

// Export functions
module.exports = {
  setEventValue,
  getEventValue,
};