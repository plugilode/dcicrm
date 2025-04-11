const { Client } = require('pg');
require('dotenv').config();

async function main() {
  console.log('Database URL:', process.env.DATABASE_URL ? '[Set]' : '[Not set]');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 5000, // 5 second query timeout
    query_timeout: 5000
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    console.log('Running test query...');
    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log('User count:', result.rows[0].count);
    
    await client.end();
    console.log('Connection closed');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

main();