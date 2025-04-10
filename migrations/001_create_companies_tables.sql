-- Drop existing tables if they exist to avoid conflicts (adjust if data preservation is needed)
DROP TABLE IF EXISTS company_tasks;
DROP TABLE IF EXISTS company_contacts;
DROP TABLE IF EXISTS companies;

-- Create the updated companies table based on the image template
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    city VARCHAR(255),
    foundation_date INTEGER,
    domain VARCHAR(255),
    employee_range VARCHAR(50),
    categories TEXT[],
    industry VARCHAR(100),
    address TEXT,
    contact_email VARCHAR(255),
    revenue NUMERIC,
    active BOOLEAN DEFAULT true,
    catchall_email_domain VARCHAR(255),
    cleaned_phone_number VARCHAR(50),
    additional_industries TEXT[],
    alexa_rank INTEGER,
    angel_list_profile_url VARCHAR(255),
    blog_url VARCHAR(255),
    business_industries TEXT[],
    country_name VARCHAR(255),
    crunchbase_url VARCHAR(255),
    employee_estimate INTEGER,
    facebook_profile_url VARCHAR(255),
    full_address TEXT,
    linkedin_id VARCHAR(255),
    linkedin_profile_url VARCHAR(255),
    main_domain VARCHAR(255),
    main_phone_cleaned_number VARCHAR(50),
    main_phone_number VARCHAR(50),
    main_phone_source VARCHAR(255),
    search_keywords TEXT[],
    spoken_languages TEXT[],
    state_name VARCHAR(255),
    stock_exchange VARCHAR(255),
    stock_symbol VARCHAR(255),
    store_count INTEGER,
    twitter_profile_url VARCHAR(255),
    website_url VARCHAR(255),
    year_founded INTEGER,
    zip_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_categories ON companies USING GIN (categories); -- Index for array searching

-- Recreate related tables
CREATE TABLE IF NOT EXISTS company_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(100),
    is_primary BOOLEAN DEFAULT false -- Optional: Mark primary contact
);
CREATE INDEX IF NOT EXISTS idx_company_contacts_company_id ON company_contacts(company_id);

CREATE TABLE IF NOT EXISTS company_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- e.g., pending, in_progress, completed
    due_date DATE,
    assigned_user_id UUID -- Optional: Link to a users table
);
CREATE INDEX IF NOT EXISTS idx_company_tasks_company_id ON company_tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_company_tasks_status ON company_tasks(status);
CREATE INDEX IF NOT EXISTS idx_company_tasks_due_date ON company_tasks(due_date);

-- Trigger function removed as it's not supported in this environment.
-- updated_at will need to be managed by the application logic.
