const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function testConnection() {
  console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false // Disable SSL for testing
  });

  try {
    console.log('Attempting database connection...');
    const client = await pool.connect();
    console.log('Successfully connected to database');
    
    const result = await client.query('SELECT NOW()');
    console.log('Query successful. Current timestamp:', result.rows[0].now);
    
    await client.end();
  } catch (error) {
    console.error('Database connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.stack) console.error('Stack trace:', error.stack);
  } finally {
    await pool.end().catch(console.error);
  }
}

testConnection().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
