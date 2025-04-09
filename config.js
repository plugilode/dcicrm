// ... existing code ...

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates for development
    require: true
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
