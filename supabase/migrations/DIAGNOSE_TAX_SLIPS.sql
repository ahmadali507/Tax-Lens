-- Diagnostic queries to check tax_slips table status

-- 1. Check total count of tax slips
SELECT COUNT(*) as total_tax_slips FROM public.tax_slips;

-- 2. Check RLS status on tax_slips table
SELECT 
    schemaname,
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'tax_slips';

-- 3. Check current RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'tax_slips'
ORDER BY policyname;

-- 4. Sample tax slip records (first 5)
SELECT 
    id,
    user_id,
    amount,
    date,
    category,
    created_at
FROM public.tax_slips
LIMIT 5;

-- 5. Date range in tax_slips
SELECT 
    MIN(date) as earliest_date,
    MAX(date) as latest_date,
    COUNT(*) as total_records
FROM public.tax_slips;
