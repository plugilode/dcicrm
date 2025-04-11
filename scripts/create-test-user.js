const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const { query } = require('../config.js');
const fs = require('fs');

const logFile = './create_user.log';
function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `${timestamp}: ${message}\n`);
}

// Debug environment variables
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '[Set]' : '[Not set]');
console.log('Current directory:', process.cwd());
console.log('.env path:', path.join(__dirname, '../.env'));

async function createTestUser() {
  try {
    log('Checking if test user already exists...');
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@test.com']
    );

    if (existingUser.rows.length > 0) {
      log('Test user already exists, skipping creation');
      return;
    }

    log('Creating test organization...');
    const orgResult = await query(
      'INSERT INTO organizations (name, domain) VALUES ($1, $2) RETURNING id',
      ['Test Organization', 'test.com']
    );
    
    const organizationId = orgResult.rows[0].id;
    log(`Organization created with ID: ${organizationId}`);
    
    log('Creating admin user...');
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const userResult = await query(
      `INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        role, 
        organization_id,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'admin@test.com',
        passwordHash,
        'Admin',
        'User',
        'admin',
        organizationId,
        true
      ]
    );
    
    log(`Test user created with ID: ${userResult.rows[0].id}`);
    log('\nTest user credentials:');
    log('Email: admin@test.com');
    log('Password: admin123');

  } catch (error) {
    log('\nError creating test user:');
    log(`Error message: ${error.message}`);
    if (error.code) log(`Error code: ${error.code}`);
    if (error.stack) log(`Stack trace: ${error.stack}`);
    process.exit(1);
  }
}

// Clear the log file
fs.writeFileSync(logFile, '');
log('Starting test user creation process...');

// Run with timeout
const timeout = setTimeout(() => {
  log('Operation timed out after 10 seconds');
  process.exit(1);
}, 10000);

createTestUser()
  .then(() => {
    clearTimeout(timeout);
    process.exit(0);
  })
  .catch(error => {
    log(`Unhandled error: ${error}`);
    clearTimeout(timeout);
    process.exit(1);
  });