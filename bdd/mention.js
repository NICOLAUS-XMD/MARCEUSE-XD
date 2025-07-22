require("dotenv").config();
const { Pool} = require("pg");
const s = require("../set");

// Get the database URL from configuration or fallback to default
const dbUrl = s.DATABASE_URL
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

// Function to create the "mention" table with primary key 'id'
async function createMentionTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS mention (
        id serial PRIMARY KEY,
        status text DEFAULT 'non',
        url text,
        type text,
        message text
);
    `);
    console.log("The 'mention' table was created successfully.");
} catch (e) {
    console.error("Error creating the 'mention' table:", e);
} finally {
    client.release();
}
}

// Execute table creation when the module loads
createMentionTable();

// Function to insert or update the row with ID = 1
async function addOrUpdateMentionData(url, type, message) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO mention (id, url, type, message)
      VALUES (1, $1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE SET url = excluded.url, type = excluded.type, message = excluded.message;
    `;
    await client.query(query, [url, type, message]);
    console.log("Mention data was added or updated successfully.");
} catch (error) {
    console.error("Error adding or updating mention data:", error);
} finally {
    client.release();
}
}

// Function to update the status field for ID = 1
async function updateStatusById(nouveauStatus) {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE mention
      SET status = $1
      WHERE id = 1;
    `;
    await client.query(query, [nouveauStatus]);
    console.log("Status updated successfully for ID 1 in the 'mention' table.");
} catch (error) {
    console.error("Error updating status for ID 1:", error);
} finally {
    client.release();
}
}

// Function to retrieve all rows from the "mention" table
async function getAllMentionValues() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM mention;");
    console.log("Fetched all rows from the 'mention' table:", result.rows);
    return result.rows;
} catch (error) {
    console.error("Error fetching data from 'mention' table:", error);
} finally {
    client.release();
}
}

// Exporting functions for use in other files
module.exports = {
  addOrUpdateMentionData,
  getAllMentionValues,
  updateStatusById,
};