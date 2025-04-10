const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgres://01961bf8-a6ff-7f3a-9205-91ea6089959a:954d2d57-91fc-4add-a596-c80338f9f4c0@eu-central-1.db.thenile.dev/nile_cyan_door';

async function applySchemaChanges() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const sql = fs.readFileSync(path.join(__dirname, '../migrations/001_create_companies_tables.sql'), 'utf8');
    await client.query(sql);
    console.log('Schema changes applied successfully');
  } catch (err) {
    console.error('Error applying schema changes:', err);
  } finally {
    await client.end();
  }
}

applySchemaChanges();
