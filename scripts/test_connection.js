require('dotenv').config();
const { Client } = require('pg');

console.log('Starting connection test...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '[Set]' : '[Not set]');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Connected to database');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('Database time:', result.rows[0].now);
    return client.end();
  })
  .then(() => {
    console.log('Connection closed');
    setTimeout(() => process.exit(0), 100);
  })
  .catch(err => {
    console.error('Error:', err);
    setTimeout(() => process.exit(1), 100);
  });