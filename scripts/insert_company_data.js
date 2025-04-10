const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://01961bf8-a6ff-7f3a-9205-91ea6089959a:954d2d57-91fc-4add-a596-c80338f9f4c0@eu-central-1.db.thenile.dev/nile_cyan_door';

async function insertData() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    const companies = [];
    for (let i = 1; i <= 20; i++) {
      companies.push(`(
        'Company ${i}', 
        'https://example.com/logo${i}.png', 
        'City ${i}', 
        2020, 
        'company${i}.com', 
        '1-10', 
        ARRAY['category1', 'category2'], 
        'industry${i}', 
        'Address ${i}', 
        'contact@company${i}.com', 
        1000000, 
        true
      )`);
    }

    const sql = `
      INSERT INTO companies (name, logo_url, city, foundation_date, domain, employee_range, categories, industry, address, contact_email, revenue, active)
      VALUES ${companies.join(', ')}
    `;

    await client.query(sql);
    console.log('20 companies inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await client.end();
  }
}

insertData();
