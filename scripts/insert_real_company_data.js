#!/usr/bin/env node
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const companies = [
  {
    catchall_email_domain: "false",
    city: "Munich",
    cleaned_phone_number: "+4989414172160",
    additional_industries: ["internet", "computer software"],
    address: "63 Erika-Mann-Strasse",
    name: "Building Radar",
    main_phone_number: "+49 89 414172160",
    country_name: "Germany",
    employee_estimate: 96,
    full_address: "erika-mann-str. 63, münchen, bayern 80636, de",
    main_domain: "buildingradar.com",
    website_url: "http://www.buildingradar.com",
    year_founded: 2015,
    zip_code: "80636"
  },
  {
    catchall_email_domain: "false",
    city: "Bonn",
    cleaned_phone_number: "+4922818190",
    additional_industries: ["information technology & services", "internet"],
    address: "140 Friedrich-Ebert-Allee",
    name: "Deutsche Telekom",
    main_phone_number: "+49 228 18190",
    country_name: "Germany",
    employee_estimate: 205000,
    full_address: "friedrich-ebert-allee 140, bonn, germany 53113, de",
    main_domain: "telekom.com",
    website_url: "http://www.telekom.com",
    year_founded: 1995,
    zip_code: "53113"
  }
  // Add more companies as needed
];

async function main() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Starting to insert companies...');
    
    for (const company of companies) {
      const query = `
        INSERT INTO companies (
          catchall_email_domain,
          city,
          cleaned_phone_number,
          additional_industries,
          address,
          name,
          main_phone_number,
          country_name,
          employee_estimate,
          full_address,
          main_domain,
          website_url,
          year_founded,
          zip_code
        ) VALUES (
          $1, $2, $3, $4::text[], $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        )
      `;
      const values = [
        company.catchall_email_domain,
        company.city,
        company.cleaned_phone_number,
        company.additional_industries,
        company.address,
        company.name,
        company.main_phone_number,
        company.country_name,
        company.employee_estimate,
        company.full_address,
        company.main_domain,
        company.website_url,
        company.year_founded,
        company.zip_code
      ];
      await client.query(query, values);
      console.log(`Inserted company: ${company.name}`);
    }
    
    console.log('Finished inserting companies');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
