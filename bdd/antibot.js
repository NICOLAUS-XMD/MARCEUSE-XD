require("dotenv").config();
const { Pool} = require("pg");
let s = require("../set");

// Get the database URL either from config or use the default
var dbUrl = s.DATABASE_URL
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

// Function to create the "antibot" table if it doesn't exist
async function createAntibotTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS antibot (
        jid text PRIMARY KEY,
        state text,
        action text
);
    `);
    console.log("The 'antibot' table was created successfully.");
} catch (error) {
    console.error("Error while creating the 'antibot' table:", error);
} finally {
    client.release();
}
}

// Create the table on startup
createAntibotTable();

// Add or update a JID entry with a given state, default action is 'supp'
async function atbAddOrUpdateJid(jid, state) {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM antibot WHERE jid = $1", [jid]);
    const jidExists = result.rows.length> 0;

    if (jidExists) {
      await client.query("UPDATE antibot SET state = $1 WHERE jid = $2", [state, jid]);
} else {
      await client.query(
        "INSERT INTO antibot (jid, state, action) VALUES ($1, $2, $3)",
        [jid, state, "supp"]
);
}

    console.log(`JID ${jid} has been successfully added or updated in the 'antibot' table.`);
} catch (error) {
    console.error("Error while adding or updating the JID:", error);
} finally {
    client.release();
}
}

// Update the action for a specific JID
async function atbUpdateAction(jid, action) {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM antibot WHERE jid = $1", [jid]);
    const jidExists = result.rows.length> 0;

    if (jidExists) {
      await client.query("UPDATE antibot SET action = $1 WHERE jid = $2", [action, jid]);
} else {
      await client.query(
        "INSERT INTO antibot (jid, state, action) VALUES ($1, $2, $3)",
        [jid, "non", action]
);
}

    console.log(`Action for JID ${jid} has been successfully updated in the 'antibot' table.`);
} catch (error) {
    console.error("Error while updating action for JID:", error);
} finally {
    client.release();
}
}

// Check if a JID has a state of "oui"
async function atbCheckJidState(jid) {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT state FROM antibot WHERE jid = $1", [jid]);

    if (result.rows.length> 0) {
      const state = result.rows[0].state;
      return state === "oui";
} else {
      return false;
}
} catch (error) {
    console.error("Error while checking state for JID:", error);
    return false;
} finally {
    client.release();
}
}

// Retrieve the action associated with a JID
async function atbGetJidAction(jid) {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT action FROM antibot WHERE jid = $1", [jid]);

    if (result.rows.length> 0) {
      return result.rows[0].action;
} else {
      return "supp";
}
} catch (error) {
    console.error("Error while retrieving action for JID:", error);
    return "supp";
} finally {
    client.release();
}
}

// Export functions to be used elsewhere
module.exports = {
  atbUpdateAction,
  atbAddOrUpdateJid,
  atbCheckJidState,
  atbGetJidAction,
};