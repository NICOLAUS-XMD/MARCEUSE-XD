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

// Function to create the "onlyAdmin" table
const createOnlyAdminTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS onlyAdmin (
        groupJid text PRIMARY KEY
);
    `);
    console.log("The 'onlyAdmin' table was created successfully.");
} catch (e) {
    console.error("Error creating the 'onlyAdmin' table:", e);
}
};

// Automatically create the table at runtime
createOnlyAdminTable();

// Function to add a group to the admin-only list
async function addGroupToOnlyAdminList(groupJid) {
  const client = await pool.connect();
  try {
    await client.query("INSERT INTO onlyAdmin (groupJid) VALUES ($1)", [groupJid]);
    console.log(`Group JID ${groupJid} added to the admin-only list.`);
} catch (error) {
    console.error("Error adding group to admin-only list:", error);
} finally {
    client.release();
}
}

// Function to check if a group is in the admin-only list
async function isGroupOnlyAdmin(groupJid) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT EXISTS (SELECT 1 FROM onlyAdmin WHERE groupJid = $1)",
      [groupJid]
);
    return result.rows[0].exists;
} catch (error) {
    console.error("Error checking if group is admin-only:", error);
    return false;
} finally {
    client.release();
}
}

// Function to remove a group from the admin-only list
async function removeGroupFromOnlyAdminList(groupJid) {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM onlyAdmin WHERE groupJid = $1", [groupJid]);
    console.log(`Group JID ${groupJid} removed from the admin-only list.`);
} catch (error) {
    console.error("Error removing group from admin-only list:", error);
} finally {
    client.release();
}
}

// Export functions for external use
module.exports = {
  addGroupToOnlyAdminList,
  isGroupOnlyAdmin,
  removeGroupFromOnlyAdminList,
};