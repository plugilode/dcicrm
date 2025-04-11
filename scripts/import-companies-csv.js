/**
 * Import Companies CSV Script
 * 
 * This script imports company data from a CSV file into the database.
 */

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const readline = require('readline');

// Create a new database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Process command line arguments
const args = process.argv.slice(2);
const defaultCsvPath = path.resolve(__dirname, '../public/crm.csv');

// Parse command line arguments
let csvFilePath = defaultCsvPath;
let maxRows = 1000;
let dryRun = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && i + 1 < args.length) {
    csvFilePath = path.resolve(process.cwd(), args[i + 1]);
    i++;
  } else if (args[i] === '--max-rows' && i + 1 < args.length) {
    maxRows = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--dry-run') {
    dryRun = true;
  } else if (args[i] === '--help') {
    console.log(`
Usage: node import-companies-csv.js [options]

Options:
  --file <path>     Path to the CSV file (default: ../public/crm.csv)
  --max-rows <n>    Maximum number of rows to process (default: 1000)
  --dry-run         Parse CSV but don't insert into database
  --help            Show this help message
    `);
    process.exit(0);
  }
}

console.log(`Using CSV file: ${csvFilePath}`);

// Counter for tracking progress
let totalRows = 0;
let importedRows = 0;
let errorRows = 0;

// Function to clean data
const cleanData = (value) => {
  if (value === undefined || value === null) return null;
  
  // Remove quotes if present
  value = String(value).replace(/^"(.*)"$/, '$1');
  
  // Return null for empty strings
  if (value.trim() === '') return null;
  
  return value;
};

// Function to parse CSV line
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add the last field
  return result;
}

// Run the import
async function importCompanies() {
  console.log(`Starting import from ${csvFilePath}`);
  
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Check if the companies table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'companies'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating companies table...');
      
      // Create the companies table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          logo_url TEXT,
          city VARCHAR(255),
          foundation_date INTEGER,
          source_of_lead VARCHAR(255),
          domain VARCHAR(255),
          employee_range VARCHAR(100),
          categories TEXT[],
          industry VARCHAR(255),
          address TEXT,
          contact_email VARCHAR(255),
          revenue DECIMAL,
          active BOOLEAN DEFAULT true,
          country_name VARCHAR(255),
          state_name VARCHAR(255),
          employee_estimate INTEGER,
          linkedin_profile_url TEXT,
          facebook_profile_url TEXT,
          twitter_profile_url TEXT,
          website_url TEXT,
          main_domain VARCHAR(255),
          main_phone_number VARCHAR(100),
          year_founded INTEGER,
          zip_code VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Process the CSV file line by line
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    // Read header line first to get column names
    let headerLine = null;
    let headers = [];
    
    // Process each line
    for await (const line of rl) {
      if (!headerLine) {
        headerLine = line;
        headers = parseCSVLine(headerLine);
        continue;
      }
      
      totalRows++;
      
      try {
        // Parse the CSV line
        const values = parseCSVLine(line);
        
        // Create a record from the CSV line
        const record = {};
        for (let i = 0; i < headers.length; i++) {
          if (i < values.length) {
            record[headers[i]] = values[i].replace(/^"(.*)"$/, '$1'); // Remove double quotes
          }
        }
        
        // Extract company data
        const company = {
          id: uuidv4(), // Generate a new UUID
          name: cleanData(record['company/companyName']) || cleanData(record['companyName']),
          logo_url: cleanData(record['company/logoUrl']),
          city: cleanData(record['company/cityName']) || cleanData(record['cityName']),
          foundation_date: cleanData(record['company/yearFounded']),
          domain: cleanData(record['company/mainDomain']) || cleanData(record['catchallEmailDomain']),
          employee_range: null, // Will calculate based on employee_estimate
          industry: cleanData(record['company/businessIndustry']),
          address: cleanData(record['company/fullAddress']) || cleanData(record['company/addressLine']),
          contact_email: null, // Not directly in CSV
          revenue: null, // Not directly in CSV
          active: true,
          country_name: cleanData(record['company/countryName']) || cleanData(record['countryName']),
          state_name: cleanData(record['company/stateName']) || cleanData(record['stateName']),
          employee_estimate: parseInt(cleanData(record['company/employeeEstimate']) || '0'),
          linkedin_profile_url: cleanData(record['company/linkedInProfileUrl']),
          facebook_profile_url: cleanData(record['company/facebookProfileUrl']),
          twitter_profile_url: cleanData(record['company/twitterProfileUrl']),
          website_url: cleanData(record['company/websiteUrl']),
          main_domain: cleanData(record['company/mainDomain']),
          main_phone_number: cleanData(record['company/mainPhone/phoneNumber']) || cleanData(record['contactPhoneNumbers/0/rawNumber']),
          year_founded: parseInt(cleanData(record['company/yearFounded']) || '0'),
          zip_code: cleanData(record['company/zipCode'])
        };

        // Skip rows without a company name
        if (!company.name) {
          console.log(`Skipping row ${totalRows}: No company name`);
          continue;
        }

        // Convert employee count to a range
        if (company.employee_estimate) {
          if (company.employee_estimate < 10) company.employee_range = '1-9';
          else if (company.employee_estimate < 50) company.employee_range = '10-49';
          else if (company.employee_estimate < 200) company.employee_range = '50-199';
          else if (company.employee_estimate < 500) company.employee_range = '200-499';
          else if (company.employee_estimate < 1000) company.employee_range = '500-999';
          else if (company.employee_estimate < 5000) company.employee_range = '1,000-4,999';
          else if (company.employee_estimate < 10000) company.employee_range = '5,000-9,999';
          else company.employee_range = '10,000+';
        }

        // Build categories array - since we're not using csv-parser, we need to manually extract categories
        const categories = [];
        for (let i = 0; i < 3; i++) {
          const industry = cleanData(record[`company/businessIndustries/${i}`]);
          if (industry) categories.push(industry);
        }
        
        for (let i = 0; i < 2; i++) {
          const additionalIndustry = cleanData(record[`company/additionalIndustries/${i}`]);
          if (additionalIndustry) categories.push(additionalIndustry);
        }

        company.categories = categories.length > 0 ? categories : null;

        // If dry run, skip database insertion
        if (dryRun) {
          console.log(`[DRY RUN] Would insert company: ${company.name}`);
          importedRows++;
        } else {
          // Insert the company data
          const insertQuery = `
            INSERT INTO companies (
              id, name, logo_url, city, foundation_date, domain, 
              employee_range, categories, industry, address, active,
              country_name, state_name, employee_estimate, linkedin_profile_url,
              facebook_profile_url, twitter_profile_url, website_url,
              main_domain, main_phone_number, year_founded, zip_code
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
              $15, $16, $17, $18, $19, $20, $21, $22
            )
            ON CONFLICT (id) DO NOTHING
          `;

          await client.query(insertQuery, [
            company.id,
            company.name,
            company.logo_url,
            company.city,
            company.foundation_date,
            company.domain,
            company.employee_range,
            company.categories,
            company.industry,
            company.address,
            company.active,
            company.country_name,
            company.state_name,
            company.employee_estimate,
            company.linkedin_profile_url,
            company.facebook_profile_url,
            company.twitter_profile_url,
            company.website_url,
            company.main_domain,
            company.main_phone_number,
            company.year_founded,
            company.zip_code
          ]);
          
          importedRows++;
        }

        if (importedRows % 100 === 0) {
          console.log(`Processed ${importedRows} companies so far...`);
        }

      } catch (err) {
        errorRows++;
        console.error(`Error processing row ${totalRows}:`, err);
      }
      
      // Break after processing the maximum number of rows
      if (totalRows >= maxRows) {
        console.log(`Reached maximum row limit (${maxRows}). Stopping import.`);
        break;
      }
    }

    // Commit the transaction
    await client.query('COMMIT');
    
    console.log(`
      Import completed:
      Total rows processed: ${totalRows}
      Companies imported: ${importedRows}
      Errors: ${errorRows}
    `);

  } catch (err) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error during import:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

// Check if the CSV file exists
if (!fs.existsSync(csvFilePath)) {
  console.error(`Error: CSV file not found at ${csvFilePath}`);
  console.log('Use --file option to specify the correct path to the CSV file');
  process.exit(1);
}

// Run the import
console.log(`Starting import with the following settings:
- CSV File: ${csvFilePath}
- Max Rows: ${maxRows}
- Dry Run: ${dryRun ? 'Yes (no database changes will be made)' : 'No'}
`);

importCompanies().catch(err => {
  console.error('Failed to import companies:', err);
  process.exit(1);
});
