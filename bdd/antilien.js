require("dotenv").config();
const { Pool} = require("pg");
let s = require("../set");

// Get the database URL from config or fallback to default
var dbUrl = s.DATABASE_URL
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

// Function to create the "antilien" table
async function createAntilienTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS antilien (
        jid text PRIMARY KEY,
        state text,
        action text
);
    `);
    console.log("The 'antilien' table was successfully created.");
} catch (error) {
    console.error("Error creating the 'antilien' table:", error);
} finally {
    client.release();
}
}

// Create table at startup
createAntilienTable();

// Function to add or update JID entry with a given state
async function addOrUpdateJid(jid, state) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM antilien WHERE jid = $1", [jid]);
    const exists = result.rows.length> 0;

    if (exists) {
      await client.query("UPDATE antilien SET state = $1 WHERE jid = $2", [state, jid]);
} else {
      await client.query(
        "INSERT INTO antilien (jid, state, action) VALUES ($1, $2, $3)",
        [jid, state, "supp"]
);
}

    console.log(`JID ${jid} successfully added or updated.`);
} catch (error) {
    console.error("Error updating JID:", error);
} finally {
    client.release();
}
}

// Function to update action value for a given JID
async function updateAction(jid, action) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM antilien WHERE jid = $1", [jid]);
    const exists = result.rows.length> 0;

    if (exists) {
      await client.query("UPDATE antilien SET action = $1 WHERE jid = $2", [action, jid]);
} else {
      await client.query(
        "INSERT INTO antilien (jid, state, action) VALUES ($1, $2, $3)",
        [jid, "non", action]
);
}

    console.log(`Action successfully updated for JID ${jid}.`);
} catch (error) {
    console.error("Error updating action:", error);
} finally {
    client.release();
}
}

// Function to check if JID has a state of 'oui'
async function checkJidState(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT state FROM antilien WHERE jid = $1", [jid]);

    if (result.rows.length> 0) {
      return result.rows[0].state === "oui";
} else {
      return false;
}
} catch (error) {
    console.error("Error checking state:", error);
    return false;
} finally {
    client.release();
}
}

// Function to retrieve action value for a given JID
async function getJidAction(jid) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT action FROM antilien WHERE jid = $1", [jid]);

    if (result.rows.length> 0) {
      return result.rows[0].action;
} else {
      return "supp"; // Default fallback action
}
} catch (error) {
    console.error("Error retrieving action:", error);
    return "supp";
} finally {
    client.release();
}
}

// Export module functions
module.exports = {
  updateAction,
  addOrUpdateJid,
  checkJidState,
  getJidAction,
};