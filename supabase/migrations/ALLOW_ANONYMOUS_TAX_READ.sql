-- Allow anonymous users to read tax slip data for analytics/reporting
-- This enables the Track Expenditure page to work without authentication
-- while keeping write operations restricted to authenticated users

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read tax slips for analytics" ON public.tax_slips;
DROP POLICY IF EXISTS "Authenticated users can view all tax slips for analytics" ON public.tax_slips;
DROP POLICY IF EXISTS "Users can view own tax slips" ON public.tax_slips;
DROP POLICY IF EXISTS "Users can insert own tax slips" ON public.tax_slips;
DROP POLICY IF EXISTS "Users can update own tax slips" ON public.tax_slips;
DROP POLICY IF EXISTS "Users can delete own tax slips" ON public.tax_slips;

-- Create new policies

-- Allow ANYONE (authenticated or not) to SELECT/READ tax slips for analytics
CREATE POLICY "Anyone can read tax slips for analytics" ON public.tax_slips
    FOR SELECT USING (true);

-- Users can only INSERT their own records (requires authentication)
CREATE POLICY "Authenticated users can insert own tax slips" ON public.tax_slips
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can only UPDATE their own records (requires authentication)
CREATE POLICY "Authenticated users can update own tax slips" ON public.tax_slips
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can only DELETE their own records (requires authentication)
CREATE POLICY "Authenticated users can delete own tax slips" ON public.tax_slips
    FOR DELETE USING (auth.uid()::text = user_id::text);
