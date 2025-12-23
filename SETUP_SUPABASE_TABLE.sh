#!/bin/bash

# Initialize Supabase projects table
# Run this script to create the projects table in your Supabase database

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SUPABASE_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"

# SQL to create the projects table
SQL="
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT CHECK (status IN ('completed', 'ongoing', 'planned', 'cancelled')) DEFAULT 'ongoing',
    progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
    allocated_budget BIGINT DEFAULT 0,
    spent_amount BIGINT DEFAULT 0,
    details_url TEXT,
    source TEXT NOT NULL,
    location TEXT,
    ministry TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_source ON projects(source);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY \"Allow public read access\" ON projects
    FOR SELECT USING (true);

CREATE POLICY \"Allow authenticated users to manage projects\" ON projects
    FOR ALL USING (auth.role() = 'authenticated');
"

echo "To create the projects table, please execute the following SQL in your Supabase dashboard:"
echo "1. Go to https://app.supabase.com"
echo "2. Select your project (Tax-Lens)"
echo "3. Go to SQL Editor"
echo "4. Create a new query and paste the following SQL:"
echo ""
echo "$SQL"
