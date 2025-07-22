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

// Create the PostgreSQL connection pool
const pool = new Pool(proConfig);

// Function to create the "hentai" table if it doesn't exist
const createHentaiTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hentai (
        groupJid text PRIMARY KEY
);
    `);
    console.log("The 'hentai' table with 'groupJid' as primary key was created successfully.");
} catch (e) {
    console.error("Error creating the 'hentai' table:", e);
}
};

// Call the function to create the "hentai" table
createHentaiTable();

// Function to add a group to the hentai list
async function addToHentaiList(groupJid) {
  const client = await pool.connect();
  try {
    const query = "INSERT INTO hentai (groupJid) VALUES ($1)";
    await client.query(query, [groupJid]);
    console.log(`Group JID ${groupJid} was added to the hentai list.`);
} catch (error) {
    console.error("Error adding group to hentai list:", error);
} finally {
    client.release();
}
}

// Function to check if a group is in the hentai list
async function checkFromHentaiList(groupJid) {
  const client = await pool.connect();
  try {
    const query = "SELECT EXISTS (SELECT 1 FROM hentai WHERE groupJid = $1)";
    const result = await client.query(query, [groupJid]);
    return result.rows[0].exists;
} catch (error) {
    console.error("Error checking if group is in hentai list:", error);
    return false;
} finally {
    client.release();
}
}

// Function to remove a group from the hentai list
async function removeFromHentaiList(groupJid) {
  const client = await pool.connect();
  try {
    const query = "DELETE FROM hentai WHERE groupJid = $1";
    await client.query(query, [groupJid]);
    console.log(`Group JID ${groupJid} was removed from the hentai list.`);
} catch (error) {
    console.error("Error removing group from hentai list:", error);
} finally {
    client.release();
}
}

// Export the functions for use in other modules
module.exports = {
  addToHentaiList,
  checkFromHentaiList,
  removeFromHentaiList,
};