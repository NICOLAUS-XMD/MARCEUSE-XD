// Import dotenv and load environment variables from the.env file
require("dotenv").config();

const { Pool} = require("pg");

// Use the 'set' module to get the value of DATABASE_URL from your configuration
const s = require("../set");

// Retrieve the database URL from s.DATABASE_URL, or use the default value
var dbUrl = s.DATABASE_URL
? s.DATABASE_URL
: "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9";

const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
},
};

// Create a PostgreSQL connection pool
const pool = new Pool(proConfig);

// Function to create the "alive" table with a column "id"
const createAliveTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alive (
        id serial PRIMARY KEY,
        message text,
        link text
);
    `);
    console.log("The 'alive' table was created successfully.");
} catch (e) {
    console.error("An error occurred while creating the 'alive' table:", e);
}
};

// Call the function to create the "alive" table
createAliveTable();

// Function to add or update a record in the "alive" table
async function addOrUpdateDataInAlive(message, link) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO alive (id, message, link)
      VALUES (1, $1, $2)
      ON CONFLICT (id)
      DO UPDATE SET message = excluded.message, link = excluded.link;
    `;
    const values = [message, link];

    await client.query(query, values);
    console.log("Data successfully added or updated in the 'alive' table.");
} catch (error) {
    console.error("Error while adding or updating data in the 'alive' table:", error);
} finally {
    client.release();
}
}

// Function to retrieve data from the "alive" table
async function getDataFromAlive() {
  const client = await pool.connect();
  try {
    const query = "SELECT message, link FROM alive WHERE id = 1";
    const result = await client.query(query);

    if (result.rows.length> 0) {
      const { message, link} = result.rows[0];
      return { message, link};
} else {
      console.log("No data found in the 'alive' table.");
      return null;
}
} catch (error) {
    console.error("Error while retrieving data from the 'alive' table:", error);
    return null;
} finally {
    client.release();
}
}

// Export the functions for use in other files
module.exports = {
  addOrUpdateDataInAlive,
  getDataFromAlive,
};