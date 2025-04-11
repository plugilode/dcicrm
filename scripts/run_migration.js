const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://01961bf8-a6ff-7f3a-9205-91ea6089959a:954d2d57-91fc-4add-a596-c80338f9f4c0@eu-central-1.db.thenile.dev/nile_cyan_door';

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read and execute migration file
    const fs = require('fs');
    const path = require('path');
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'migrations', '004_add_admin_users.sql'),
      'utf8'
    );

    await client.query(sql);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

runMigration();
