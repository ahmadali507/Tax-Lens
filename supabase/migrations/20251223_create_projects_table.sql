-- Create projects table for government projects
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

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS idx_projects_source ON projects(source);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT USING (true);

-- Create policy to allow anyone to insert projects
CREATE POLICY "Allow anyone to insert projects" ON projects
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to update projects
CREATE POLICY "Allow anyone to update projects" ON projects
    FOR UPDATE USING (true) WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');
