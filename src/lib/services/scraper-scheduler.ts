import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

interface SchedulerConfig {
    intervalMs: number;
    scriptPath: string;
}

/**
 * Background scheduler that runs the web scraper at regular intervals
 * Runs every hour by default
 */
class ScraperScheduler {
    private intervalId: NodeJS.Timeout | null = null;
    private isRunning = false;
    private config: SchedulerConfig;
    private lastRunTime: Date | null = null;
    private successfulRuns = 0;
    private failedRuns = 0;

    constructor(config: Partial<SchedulerConfig> = {}) {
        this.config = {
            intervalMs: config.intervalMs || 3600000, // 1 hour default
            scriptPath: config.scriptPath || path.join(__dirname, '..', 'scripts', 'scrape-projects.ts'),
        };
    }

    /**
     * Starts the scheduler
     */
    start(): void {
        if (this.isRunning) {
            console.log('⚠️  Scheduler is already running');
            return;
        }

        this.isRunning = true;
        console.log(`🕐 Scraper scheduler started. Will run every ${this.config.intervalMs / 60000} minutes`);
        
        // Run immediately on start
        this.runScraper();
        
        // Schedule for future runs
        this.intervalId = setInterval(() => {
            this.runScraper();
        }, this.config.intervalMs);
    }

    /**
     * Stops the scheduler
     */
    stop(): void {
        if (!this.isRunning) {
            console.log('⚠️  Scheduler is not running');
            return;
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.isRunning = false;
        console.log('🛑 Scraper scheduler stopped');
    }

    /**
     * Executes the scraper
     */
    private async runScraper(): Promise<void> {
        if (this.isRunning) {
            try {
                const timestamp = new Date().toISOString();
                console.log(`\n📡 Running scraper at ${timestamp}...`);

                await execAsync(`npx tsx ${this.config.scriptPath}`);
                
                this.lastRunTime = new Date();
                this.successfulRuns++;
                console.log(`✅ Scraper completed successfully (Run #${this.successfulRuns})`);
                console.log(`⏰ Next run in ${this.config.intervalMs / 60000} minutes\n`);
            } catch (error) {
                this.failedRuns++;
                console.error(`❌ Scraper failed (Attempt #${this.failedRuns}):`, error);
                console.log(`🔄 Will retry in ${this.config.intervalMs / 60000} minutes\n`);
            }
        }
    }

    /**
     * Gets scheduler status
     */
    getStatus(): {
        isRunning: boolean;
        lastRunTime: Date | null;
        successfulRuns: number;
        failedRuns: number;
        intervalMs: number;
    } {
        return {
            isRunning: this.isRunning,
            lastRunTime: this.lastRunTime,
            successfulRuns: this.successfulRuns,
            failedRuns: this.failedRuns,
            intervalMs: this.config.intervalMs,
        };
    }
}

// Export for use as a service
export default ScraperScheduler;
