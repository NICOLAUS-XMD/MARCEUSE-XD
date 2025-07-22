require("dotenv").config();
const { Pool} = require("pg");
const s = require("../set");

// Get the database URL either from config or use the default fallback
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

// Function to create the "banGroup" table
const createBanGroupTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banGroup (
        groupJid text PRIMARY KEY
);
    `);
    console.log("The 'banGroup' table was created successfully.");
} catch (e) {
    console.error("Error creating the 'banGroup' table:", e);
}
};

// Create the table on script start
createBanGroupTable();

// Function to add a group to the ban list
async function addGroupToBanList(groupJid) {
  const client = await pool.connect();
  try {
    const query = "INSERT INTO banGroup (groupJid) VALUES ($1)";
    await client.query(query, [groupJid]);
    console.log(`Group JID ${groupJid} was added to the ban list.`);
} catch (error) {
    console.error("Error adding group to ban list:", error);
} finally {
    client.release();
}
}

// Function to check if a group is banned
async function isGroupBanned(groupJid) {
  const client = await pool.connect();
  try {
    const query = "SELECT EXISTS (SELECT 1 FROM banGroup WHERE groupJid = $1)";
    const result = await client.query(query, [groupJid]);
    return result.rows[0].exists;
} catch (error) {
    console.error("Error checking if group is banned:", error);
    return false;
} finally {
    client.release();
}
}

// Function to remove a group from the ban list
async function removeGroupFromBanList(groupJid) {
  const client = await pool.connect();
  try {
    const query = "DELETE FROM banGroup WHERE groupJid = $1";
    await client.query(query, [groupJid]);
    console.log(`Group JID ${groupJid} was removed from the ban list.`);
} catch (error) {
    console.error("Error removing group from ban list:", error);
} finally {
    client.release();
}
}

// Exporting functions for external use
module.exports = {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList,
};