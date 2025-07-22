require("dotenv").config();
const { Pool} = require("pg");
let s = require("../set");

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

// Create the "users_rank" table if it doesn't exist
async function createUsersRankTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users_rank (
        id SERIAL PRIMARY KEY,
        jid VARCHAR(255) UNIQUE,
        xp INTEGER DEFAULT 0,
        messages INTEGER DEFAULT 0
);
    `);
} catch (error) {
    console.error("Error creating 'users_rank' table:", error);
} finally {
    client.release();
}
}

// Add or update a user's data (XP +10, messages +1)
async function addOrUpdateUserData(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users_rank WHERE jid = $1", [jid]);
    const exists = result.rows.length> 0;

    if (exists) {
      await client.query(
        "UPDATE users_rank SET xp = xp + 10, messages = messages + 1 WHERE jid = $1",
        [jid]
);
} else {
      await client.query(
        "INSERT INTO users_rank (jid, xp, messages) VALUES ($1, $2, $3)",
        [jid, 10, 1]
);
}
} catch (error) {
    console.error("Error updating user data:", error);
} finally {
    client.release();
}
}

// Get XP and message count for a specific JID
async function getMessagesAndXPByJID(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT messages, xp FROM users_rank WHERE jid = $1",
      [jid]
);

    if (result.rows.length> 0) {
      const { messages, xp} = result.rows[0];
      return { messages, xp};
} else {
      return { messages: 0, xp: 0};
}
} catch (error) {
    console.error("Error fetching user data:", error);
    return { messages: 0, xp: 0};
} finally {
    client.release();
}
}

// Retrieve the top 10 users by XP (descending order)
async function getTop10Users() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT jid, xp, messages FROM users_rank ORDER BY xp DESC LIMIT 10"
);
    return result.rows;
} catch (error) {
    console.error("Error retrieving top 10 users:", error);
    return [];
} finally {
    client.release();
}
}

// Create the table on startup
createUsersRankTable();

// Export functions for external use
module.exports = {
  addOrUpdateUserData,
  getMessagesAndXPByJID,
  getTop10Users,
};