const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

const logFile = './db_test.log';

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
}

async function main() {
  log('Starting database test');
  log(`Database URL is ${process.env.DATABASE_URL ? 'set' : 'not set'}`);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000 // 5 second timeout
  });

  // Set a timeout for the entire operation
  const timeout = setTimeout(() => {
    log('ERROR: Operation timed out after 10 seconds');
    process.exit(1);
  }, 10000);

  try {
    log('Attempting to connect...');
    await client.connect();
    log('Connected successfully');

    const result = await client.query('SELECT NOW() as time');
    log(`Query successful. Server time: ${result.rows[0].time}`);

    await client.end();
    log('Connection closed');
    clearTimeout(timeout);
    process.exit(0);
  } catch (err) {
    log('ERROR: ' + err.message);
    log('Stack trace: ' + err.stack);
    clearTimeout(timeout);
    process.exit(1);
  }
}

// Clear previous log
fs.writeFileSync(logFile, '');

// Run the test
main();