#!/usr/bin/env node

/**
 * CLI tool to manage the web scraper scheduler
 * Usage:
 *   npm run scraper:start    - Start the scheduler
 *   npm run scraper:stop     - Stop the scheduler
 *   npm run scraper:status   - Check scheduler status
 *   npm run scraper:once     - Run scraper once
 */

import ScraperScheduler from '../src/lib/services/scraper-scheduler';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

const command = process.argv[2];

async function runScraperOnce(): Promise<void> {
    try {
        const scriptPath = path.join(__dirname, 'scripts', 'scrape-projects.ts');
        console.log('🚀 Running scraper once...\n');
        await execAsync(`npx tsx ${scriptPath}`);
        console.log('\n✅ Scraper completed successfully');
    } catch (error) {
        console.error('❌ Scraper failed:', error);
        process.exit(1);
    }
}

function startScheduler(): void {
    const scheduler = new ScraperScheduler({
        intervalMs: 3600000, // 1 hour
    });
    
    scheduler.start();
    
    // Keep the process running
    console.log('\n📌 Press Ctrl+C to stop the scheduler\n');
    
    process.on('SIGINT', () => {
        console.log('\n\nShutting down scheduler...');
        scheduler.stop();
        process.exit(0);
    });
}

function showStatus(): void {
    const scheduler = new ScraperScheduler();
    const status = scheduler.getStatus();
    
    console.log('\n📊 Scraper Scheduler Status:');
    console.log(`   Running: ${status.isRunning ? '✅ Yes' : '❌ No'}`);
    console.log(`   Last run: ${status.lastRunTime ? new Date(status.lastRunTime).toISOString() : 'Never'}`);
    console.log(`   Successful runs: ${status.successfulRuns}`);
    console.log(`   Failed runs: ${status.failedRuns}`);
    console.log(`   Interval: ${status.intervalMs / 60000} minutes`);
    console.log('');
}

function showHelp(): void {
    console.log(`
Pakistani Government Projects Web Scraper CLI
==============================================

Commands:
  start       Start the scheduler (runs every 1 hour)
  stop        Stop the scheduler
  once        Run the scraper once
  status      Show scheduler status
  help        Show this help message

Examples:
  npx tsx scripts/cli.ts start
  npx tsx scripts/cli.ts once
  npx tsx scripts/cli.ts status

Environment Variables:
  SCRAPER_INTERVAL_MS    Set custom interval (default: 3600000 = 1 hour)

    `);
}

async function main(): Promise<void> {
    switch (command) {
        case 'start':
            startScheduler();
            break;
        case 'once':
            await runScraperOnce();
            break;
        case 'status':
            showStatus();
            break;
        case 'help':
        case '--help':
        case '-h':
            showHelp();
            break;
        default:
            console.log(`Unknown command: ${command}\n`);
            showHelp();
            process.exit(1);
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
