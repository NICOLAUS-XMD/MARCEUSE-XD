require("dotenv").config();
const { Pool} = require("pg");
const s = require("../set");

// Get the database URL from config or fallback to default
const dbUrl = s.DATABASE_URL
? s.DATABASE_URL
: "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
},
};

// Initialize PostgreSQL connection pool
const pool = new Pool(proConfig);

// Create the "sudo" table to store authorized user IDs
async function createSudoTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS sudo (
        id SERIAL PRIMARY KEY,
        jid TEXT NOT NULL
);
    `);
    console.log("The 'sudo' table was created successfully.");
} catch (error) {
    console.error("Error creating the 'sudo' table:", error);
} finally {
    client.release();
}
}

// Call the table creation function on initialization
createSudoTable();

// Check if a JID is in the sudo list
async function isSudo(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT EXISTS (SELECT 1 FROM sudo WHERE jid = $1)",
      [jid]
);
    return result.rows[0].exists;
} catch (error) {
    console.error("Error checking sudo status:", error);
    return false;
} finally {
    client.release();
}
}

// Add a JID to the sudo list
async function addSudoNumber(jid) {
  const client = await pool.connect();
  try {
    await client.query("INSERT INTO sudo (jid) VALUES ($1)", [jid]);
    console.log(`JID ${jid} added to the sudo list.`);
} catch (error) {
    console.error("Error adding JID to sudo list:", error);
} finally {
    client.release();
}
}

// Remove a JID from the sudo list
async function removeSudoNumber(jid) {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM sudo WHERE jid = $1", [jid]);
    console.log(`JID ${jid} removed from the sudo list.`);
} catch (error) {
    console.error("Error removing JID from sudo list:", error);
} finally {
    client.release();
}
}

// Get all JIDs from the sudo list
async function getAllSudoNumbers() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT jid FROM sudo");
    return result.rows.map(row => row.jid);
} catch (error) {
    console.error("Error fetching all sudo JIDs:", error);
    return [];
} finally {
    client.release();
}
}

// Check if the sudo table is not empty
async function isSudoTableNotEmpty() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT COUNT(*) FROM sudo");
    const rowCount = parseInt(result.rows[0].count);
    return rowCount> 0;
} catch (error) {
    console.error("Error checking if sudo table is empty:", error);
    return false;
} finally {
    client.release();
}
}

// Export module functions
module.exports = {
  isSudo,
  addSudoNumber,
  removeSudoNumber,
  getAllSudoNumbers,
  isSudoTableNotEmpty
};