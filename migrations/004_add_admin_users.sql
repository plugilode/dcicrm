-- Add pgcrypto extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add new admin users
INSERT INTO users (username, email, password_hash, role, is_active)
VALUES 
('tobiasdci', 'tobias@dcimedia.de', crypt('Plugilo25!', gen_salt('bf')), 'admin', true),
('mmohr', 'mohr@dcimedia.de', crypt('Plugilo25!', gen_salt('bf')), 'admin', true)
ON CONFLICT (username) DO NOTHING;
