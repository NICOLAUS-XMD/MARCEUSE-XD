require("dotenv").config();
const { Pool} = require("pg");
const s = require("../set");

// Get the database URL from configuration or use a default fallback
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

// Function to create the "banUser" table if it doesn't already exist
const createBanUserTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS banUser (
        jid text PRIMARY KEY
);
    `);
    console.log("The 'banUser' table was successfully created.");
} catch (e) {
    console.error("An error occurred while creating the 'banUser' table:", e);
}
};

// Call the method to ensure table creation at startup
createBanUserTable();

// Function to add a user to the ban list
async function addUserToBanList(jid) {
  const client = await pool.connect();
  try {
    const query = "INSERT INTO banUser (jid) VALUES ($1)";
    await client.query(query, [jid]);
    console.log(`JID ${jid} was added to the ban list.`);
} catch (error) {
    console.error("Error adding user to ban list:", error);
} finally {
    client.release();
}
}

// Function to check whether a user is banned
async function isUserBanned(jid) {
  const client = await pool.connect();
  try {
    const query = "SELECT EXISTS (SELECT 1 FROM banUser WHERE jid = $1)";
    const result = await client.query(query, [jid]);
    return result.rows[0].exists;
} catch (error) {
    console.error("Error checking if user is banned:", error);
    return false;
} finally {
    client.release();
}
}

// Function to remove a user from the ban list
async function removeUserFromBanList(jid) {
  const client = await pool.connect();
  try {
    const query = "DELETE FROM banUser WHERE jid = $1";
    await client.query(query, [jid]);
    console.log(`JID ${jid} was removed from the ban list.`);
} catch (error) {
    console.error("Error removing user from ban list:", error);
} finally {
    client.release();
}
}

// Export the module's public functions
module.exports = {
  addUserToBanList,
  isUserBanned,
  removeUserFromBanList,
};