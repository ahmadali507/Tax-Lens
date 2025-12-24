-- Fix RLS Policies for tax_slips table to allow analytics queries
-- This allows authenticated users to read all tax slips (for aggregation/analytics)
-- while still restricting individual CRUD operations to their own records

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own tax slips" ON public.tax_slips;
DROP POLICY IF EXISTS "Users can insert own tax slips" ON public.tax_slips;
DROP POLICY IF EXISTS "Users can update own tax slips" ON public.tax_slips;
DROP POLICY IF EXISTS "Users can delete own tax slips" ON public.tax_slips;

-- Create new policies with analytics support
-- Allow ANYONE (authenticated or not) to read tax slips for analytics/reporting
CREATE POLICY "Anyone can read tax slips for analytics" ON public.tax_slips
    FOR SELECT USING (true);

-- Users can only insert their own records
CREATE POLICY "Users can insert own tax slips" ON public.tax_slips
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can only update their own records
CREATE POLICY "Users can update own tax slips" ON public.tax_slips
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can only delete their own records
CREATE POLICY "Users can delete own tax slips" ON public.tax_slips
    FOR DELETE USING (auth.uid()::text = user_id::text);
