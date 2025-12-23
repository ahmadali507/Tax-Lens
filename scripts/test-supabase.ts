#!/usr/bin/env node

/**
 * Test Supabase connection
 */

import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...\n');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase credentials not found');
    process.exit(1);
}

console.log('✓ URL:', SUPABASE_URL);
console.log('✓ Key loaded\n');

// Test 1: Check if table exists
console.log('1️⃣  Testing table existence...');
axios.get(
    `${SUPABASE_URL}/rest/v1/projects?limit=1`,
    {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
    }
)
.then(res => {
    console.log('   ✓ Table exists\n');
    return res;
})
.catch(err => {
    console.error('   ❌ Error:', err.response?.status, err.response?.data?.message || err.message);
    process.exit(1);
})
.then(async () => {
    // Test 2: Try inserting a test project
    console.log('2️⃣  Testing INSERT...');
    
    const testProject = {
        name: `TEST_PROJECT_${Date.now()}`,
        description: 'Test project to verify connection',
        status: 'ongoing',
        progress_percentage: 50,
        allocated_budget: 1000000000,
        spent_amount: 500000000,
        source: 'test',
    };

    try {
        const insertRes = await axios.post(
            `${SUPABASE_URL}/rest/v1/projects`,
            testProject,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation',
                },
            }
        );

        console.log('   ✓ INSERT successful\n');

        // Test 3: Delete the test project
        console.log('3️⃣  Cleaning up test data...');
        await axios.delete(
            `${SUPABASE_URL}/rest/v1/projects?name=eq.${encodeURIComponent(testProject.name)}`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                },
            }
        );

        console.log('   ✓ Cleanup successful\n');

        console.log('✅ All tests passed! Supabase is ready for scraper.\n');
        console.log('Run: npm run scraper:once');
        process.exit(0);
    } catch (err: any) {
        console.error('   ❌ Error:', err.response?.status, err.response?.data);
        console.error('\n   Full error:', err.message);
        process.exit(1);
    }
});
