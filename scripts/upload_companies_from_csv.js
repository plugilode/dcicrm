const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const csv = require('csv-parser');

const connectionString = process.env.DATABASE_URL || 'postgres://01961bf8-a6ff-7f3a-9205-91ea6089959a:954d2d57-91fc-4add-a596-c80338f9f4c0@eu-central-1.db.thenile.dev/nile_cyan_door';

async function uploadCompanies() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const results = [];

    fs.createReadStream(path.join(__dirname, '../public/crm.csv'))
      .pipe(csv())
      .on('data', (data) => {
        console.log("Processing row:", data); // Log the row being processed
        results.push(data);
      })
      .on('end', async () => {
        for (const company of results) {
          await client.query(
            'INSERT INTO companies (name, logo_url, city, foundation_date, domain, employee_range, categories, industry, address, contact_email, revenue, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
            [
              company.name,
              company.logo_url || '/placeholder-logo.svg',
              company.city || 'N/A',
              company.foundation_date || null,
              company.domain || 'N/A',
              company.employee_range || '1-10',
              company.categories ? company.categories.split(',') : [],
              company.industry || 'N/A',
              company.address || 'N/A',
              company.contact_email || 'N/A',
              parseFloat(company.revenue) || 0,
              true,
            ]
          );
        }
        console.log('Companies uploaded successfully');
        await client.end();
      });
  } catch (err) {
    console.error('Error uploading companies:', err);
  }
}

uploadCompanies();
