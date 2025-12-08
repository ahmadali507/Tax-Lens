-- Create tax_slips table to store user tax slip uploads
CREATE TABLE IF NOT EXISTS public.tax_slips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tax_slips_user_id ON public.tax_slips(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_slips_category ON public.tax_slips(category);
CREATE INDEX IF NOT EXISTS idx_tax_slips_date ON public.tax_slips(date);
CREATE INDEX IF NOT EXISTS idx_tax_slips_created_at ON public.tax_slips(created_at);

-- Enable Row Level Security
ALTER TABLE public.tax_slips ENABLE ROW LEVEL SECURITY;

-- Create policies for tax_slips
CREATE POLICY "Users can view own tax slips" ON public.tax_slips
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own tax slips" ON public.tax_slips
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own tax slips" ON public.tax_slips
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own tax slips" ON public.tax_slips
    FOR DELETE USING (auth.uid()::text = user_id::text);
