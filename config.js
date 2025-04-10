
require('dotenv').config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const { Pool } = require('pg');

process.env.PGSSLMODE = 'require';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for development
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
