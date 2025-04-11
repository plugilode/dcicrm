require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('Database URL:', process.env.DATABASE_URL ? '[Set]' : '[Not set]');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('Successfully connected to database.');

    console.log('Attempting to query users table...');
    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log('Query result:', result.rows[0]);

    await client.release();
    await pool.end();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Database error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testConnection().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});