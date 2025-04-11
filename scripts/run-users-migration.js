const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { query } = require('../config.js');

async function runUsersMigration() {
  try {
    console.log('Reading migration file...');
    const sql = fs.readFileSync(
      path.join(__dirname, '../migrations/004_create_users_table.sql'),
      'utf8'
    );
    
    console.log('Executing migration...');
    await query(sql);
    console.log('Users migration completed successfully');
    
    // Verify tables were created
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'organizations', 'access_requests');
    `);
    
    console.log('Created tables:', tablesResult.rows.map(r => r.table_name).join(', '));
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runUsersMigration();