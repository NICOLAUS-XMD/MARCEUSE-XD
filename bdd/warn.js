require("dotenv").config();
const { Pool} = require("pg");
const s = require("../set");

// Get the database URL from config or use fallback
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

// Create the "warn_users" table to track warnings
async function createWarnUsersTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS warn_users (
        jid TEXT PRIMARY KEY,
        warn_count INTEGER DEFAULT 0
);
    `);
    console.log("The 'warn_users' table was created successfully.");
} catch (error) {
    console.error("Error creating 'warn_users' table:", error);
} finally {
    client.release();
}
}

// Automatically execute table creation
createWarnUsersTable();

// Add a user or increment warning count
async function addOrUpdateWarnUser(jid) {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO warn_users (jid, warn_count)
      VALUES ($1, 1)
      ON CONFLICT (jid)
      DO UPDATE SET warn_count = warn_users.warn_count + 1;
    `, [jid]);
    console.log(`User ${jid} added or updated with 1 warning.`);
} catch (error) {
    console.error("Error updating warning count for user:", error);
} finally {
    client.release();
}
}

// Get warning count for a specific user
async function getWarnCountByJID(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT warn_count FROM warn_users WHERE jid = $1", [jid]
);
    return result.rows.length> 0? result.rows[0].warn_count: 0;
} catch (error) {
    console.error("Error retrieving warning count:", error);
    return -1;
} finally {
    client.release();
}
}

// Reset the warning count for a specific user
async function resetWarnCountByJID(jid) {
  const client = await pool.connect();
  try {
    await client.query("UPDATE warn_users SET warn_count = 0 WHERE jid = $1", [jid]);
    console.log(`Warning count for user ${jid} has been reset to 0.`);
} catch (error) {
    console.error("Error resetting warning count:", error);
} finally {
    client.release();
}
}

// Export the module’s functions
module.exports = {
  addOrUpdateWarnUser,
  getWarnCountByJID,
  resetWarnCountByJID,
};