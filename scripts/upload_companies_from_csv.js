const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const csv = require('csv-parser');

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://01961bf8-a6ff-7f3a-9205-91ea6089959a:954d2d57-91fc-4add-a596-c80338f9f4c0@eu-central-1.db.thenile.dev/nile_cyan_door';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

let batch = [];
let totalUploaded = 0;
let totalSkipped = 0;
let totalErrors = 0;
let processedRows = 0;

const generateLogoUrl = (domain) => {
  if (!domain || domain.trim() === '' || domain === 'N/A') return '/placeholder-logo.svg';
  return `https://logo.clearbit.com/${domain}`;
};

const insertBatch = async () => {
  for (const company of batch) {
    const name = company.name || company['company name'] || company.Company || '';

    if (!name || name.trim() === '') {
      console.error('❌ Critical error: Missing company name for entry:', company);
      throw new Error('Company name is required for all entries');
    }

    try {
      await client.query(
        'INSERT INTO companies (name, logo_url, city, foundation_date, domain, employee_range, categories, industry, address, contact_email, revenue, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [
          name.trim(),
          generateLogoUrl(company.domain),
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
    } catch (err) {
      console.error(`❌ Error inserting "${name}":`, err.message);
      totalErrors++;
    }
  }

  totalUploaded += batch.length;
  console.log(`✅ Uploaded ${batch.length} companies (total: ${totalUploaded})`);
  batch = [];
};

const uploadCompanies = async () => {
  try {
    await client.connect();
    console.log('🔌 Connected to the database');

    fs.createReadStream(path.join(__dirname, '..', 'public', 'crm.csv'))
      .pipe(csv())
      .on('data', async (data) => {
        // Normalize all fields
        Object.keys(data).forEach((key) => {
          data[key] = data[key]?.trim?.() || '';
        });

        // Extract company name from nested structure if available
        data.name = data['company/companyName'] || 
                   data['company name'] || 
                   data.name || 
                   data.Company || 
                   '';

        processedRows++;
        batch.push(data);

        if (batch.length >= 10) {
          await insertBatch();
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          await insertBatch(); // Final batch
        }

        console.log('🎉 CSV processing complete!');
        console.log('📊 Summary:');
        console.log(`- Total rows processed: ${processedRows}`);
        console.log(`- Successfully uploaded: ${totalUploaded}`);
        console.log(`- Skipped (missing name): ${totalSkipped}`);
        console.log(`- Errors: ${totalErrors}`);
        
        if (totalUploaded + totalSkipped + totalErrors !== processedRows) {
          console.error('❌ Data integrity issue: Counts do not match processed rows!');
          process.exit(1);
        }
        
        await client.end();
      });
  } catch (err) {
    console.error('💥 Error uploading companies:', err.message);
  }
};

uploadCompanies();
