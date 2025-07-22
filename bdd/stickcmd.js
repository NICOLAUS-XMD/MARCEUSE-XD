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

// Initialize PostgreSQL pool
const pool = new Pool(proConfig);

// Create the "stickcmd" table
async function createStickCmdTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stickcmd (
        cmd text PRIMARY KEY,
        id text NOT NULL
);
    `);
    console.log("The 'stickcmd' table was created successfully.");
} catch (e) {
    console.error("Error creating 'stickcmd' table:", e);
}
}

// Execute the table creation on load
createStickCmdTable();

// Add a new sticker command
async function addStickCmd(cmd, id) {
  let client;
  try {
    client = await pool.connect();
    await client.query("INSERT INTO stickcmd(cmd, id) VALUES ($1, $2)", [cmd, id]);
} catch (error) {
    console.log("Error adding sticker command:", error);
} finally {
    if (client) client.release();
}
}

// Check if a sticker command exists by ID
async function isInStickCmd(id) {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      "SELECT EXISTS (SELECT 1 FROM stickcmd WHERE id = $1)",
      [id]
);
    return result.rows[0].exists;
} catch (error) {
    return false;
} finally {
    if (client) client.release();
}
}

// Delete a sticker command by name
async function deleteCmd(cmd) {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM stickcmd WHERE cmd = $1", [cmd]);
    console.log(`Sticker command '${cmd}' was removed successfully.`);
} catch (error) {
    console.error("Error deleting sticker command:", error);
} finally {
    client.release();
}
}

// Get command name by sticker ID
async function getCmdById(id) {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT cmd FROM stickcmd WHERE id = $1", [id]);
    return result.rows.length> 0? result.rows[0].cmd: null;
} catch (error) {
    console.error("Error fetching sticker command by ID:", error);
    return null;
} finally {
    if (client) client.release();
}
}

// Get all stored sticker commands
async function getAllStickCmds() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT cmd FROM stickcmd");
    return result.rows;
} catch (error) {
    console.error("Error fetching all sticker commands:", error);
    return [];
} finally {
    client.release();
}
}

// Export module functions
module.exports = {
  addStickCmd,
  deleteCmd,
  getCmdById,
  isInStickCmd,
  getAllStickCmds,
};