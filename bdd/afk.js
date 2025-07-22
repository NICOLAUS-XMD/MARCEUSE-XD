// Import dotenv and load environment variables from the.env file
require("dotenv").config();

const { Pool} = require("pg");

// Use the 'set' module to get the value of DATABASE_URL from your config
const s = require("../set");

// Get the database URL from the variable s.DATABASE_URL
var dbUrl = s.DATABASE_URL? s.DATABASE_URL: "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
},
};

// Create a PostgreSQL connection pool
const pool = new Pool(proConfig);

// Create a table named 'afk' if it doesn’t already exist
const createAfkTable = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS afk (
          id serial PRIMARY KEY,
          state text DEFAULT 'off',
          message text,
          link text
);
      `);
      console.log("The 'afk' table was created successfully.");
} catch (e) {
      console.error("An error occurred while creating the 'afk' table:", e);
}
};

createAfkTable();

// Add or update an AFK record
async function addOrUpdateAfk(id, message, link) {
    try {
       await pool.query(`
        INSERT INTO afk (id, message, link)
        VALUES ($1, $2, $3)
        ON CONFLICT (id)
        DO UPDATE SET message = $2, link = $3;
      `, [id, message, link]);

      console.log("The AFK record was added or updated successfully.");
} catch (e) {
      console.error("An error occurred while adding or updating the AFK record:", e);
}
}

// Get a specific AFK record by ID
async function getAfkById(id) {
    try {
      const { rows} = await pool.query(`
        SELECT * FROM afk
        WHERE id = $1;
      `, [id]);

      return rows[0];
} catch (e) {
      console.error("An error occurred while retrieving the AFK record by ID:", e);
      return null;
}
}

// Change the 'state' of an AFK record
async function changeAfkState(id, state) {
    try {
      const result = await pool.query(`
        UPDATE afk
        SET state = $1
        WHERE id = $2
        RETURNING *;
      `, [state, id]);

      if (result.rows.length === 0) {
          console.log("The AFK record does not exist.");
          return "not defined";
} else {
          console.log("The AFK record's state was updated successfully.");
          return "success";
}
} catch (e) {
      console.error("An error occurred while changing the state of the AFK record:", e);
}
}

// Export the functions for external use
module.exports = {
      addOrUpdateAfk,
      getAfkById,
      changeAfkState
}
