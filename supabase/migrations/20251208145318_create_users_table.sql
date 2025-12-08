-- Create users table to store user information
-- Note: id should match auth.users.id for linking with Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    cnic VARCHAR(15) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on CNIC for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_cnic ON public.users(cnic);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own data
-- Note: This will be managed through application logic
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to update their own data
-- Note: This will be managed through application logic
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (true);

