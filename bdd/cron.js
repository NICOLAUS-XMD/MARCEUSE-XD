require("dotenv").config();
const { Pool} = require("pg");
let s = require("../set");

// Get the database URL from configuration or fallback to a default
var dbUrl = s.DATABASE_URL
? s.DATABASE_URL
: "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
},
};

// Create a PostgreSQL connection pool
const pool = new Pool(proConfig);

// Function to create the "cron" table
async function createTableCron() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cron (
        group_id text PRIMARY KEY,
        mute_at text DEFAULT null,
        unmute_at text DEFAULT null
);
    `);
    console.log("The 'cron' table was created successfully.");
} catch (error) {
    console.error("Error creating the 'cron' table:", error);
} finally {
    client.release();
}
}

// Automatically create the table on script load
createTableCron();

// Retrieve all entries from the "cron" table
async function getCron() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM cron");
    return result.rows;
} catch (error) {
    console.error("Error retrieving data from the 'cron' table:", error);
} finally {
    client.release();
}
}

// Add or update mute/unmute value in the "cron" table
async function addCron(group_id, columnName, value) {
  const client = await pool.connect();
  try {
    const response = await client.query("SELECT * FROM cron WHERE group_id = $1", [group_id]);
    const exists = response.rows.length> 0;

    if (exists) {
      await client.query(`UPDATE cron SET ${columnName} = $1 WHERE group_id = $2`, [value, group_id]);
} else {
      await client.query(`INSERT INTO cron (group_id, ${columnName}) VALUES ($1, $2)`, [group_id, value]);
}
} catch (error) {
    console.error("Error adding data to the 'cron' table:", error);
} finally {
    client.release();
}
}

// Get a specific cron entry by group ID
async function getCronById(group_id) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM cron WHERE group_id = $1", [group_id]);
    return result.rows[0];
} catch (error) {
    console.error("Error retrieving cron data by group ID:", error);
} finally {
    client.release();
}
}

// Delete a cron entry by group ID
async function deleteCron(group_id) {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM cron WHERE group_id = $1", [group_id]);
} catch (error) {
    console.error("Error deleting cron data:", error);
} finally {
    client.release();
}
}

// Export functions for external use
module.exports = {
  getCron,
  addCron,
  deleteCron,
  getCronById,
};