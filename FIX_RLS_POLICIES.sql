-- Fix RLS Policies for Public Insert/Update
-- Run this in Supabase SQL Editor to allow the scraper to insert/update projects

-- Drop old policies
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;

-- Create new policies that allow public insert/update
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Allow anyone to insert projects" ON projects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anyone to update projects" ON projects
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');
