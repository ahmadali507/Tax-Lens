#!/bin/bash
# Web Scraper Commands Reference

echo "
╔════════════════════════════════════════════════════════════════════╗
║     TAX-LENS WEB SCRAPER - COMMANDS REFERENCE                     ║
╚════════════════════════════════════════════════════════════════════╝

📋 TABLE OF CONTENTS
  1. Quick Start
  2. Scraper Commands
  3. Development Commands
  4. Troubleshooting

════════════════════════════════════════════════════════════════════

1️⃣  QUICK START

  Start the entire system:
  
    npm run dev                    # Start web server
    npm run scraper:once          # Run scraper once
  
  Or in separate terminals:
  
    Terminal 1:
      npm run dev                 # Web server on port 3000
    
    Terminal 2:
      npm run scraper:start       # Start auto-scheduler

════════════════════════════════════════════════════════════════════

2️⃣  SCRAPER COMMANDS

  npm run scraper:once
    ✓ Runs the web scraper immediately
    ✓ Fetches from World Bank API, Wikipedia, ADB
    ✓ Updates src/data/scraped-projects.ts
    ✓ Shows statistics and summary
    ✓ One execution time: ~5-10 seconds
    
  npm run scraper:start
    ✓ Starts the automatic scheduler
    ✓ Runs immediately, then every 1 hour
    ✓ Shows detailed console output
    ✓ Press Ctrl+C to stop
    ✓ Can be started/stopped anytime
    
  npm run scraper:status
    ✓ Shows scheduler status
    ✓ Displays last run time
    ✓ Shows success/failure count
    ✓ Quick check if running
    
  npm run scraper:help
    ✓ Shows CLI help and options
    ✓ Lists all available commands
    ✓ Explains usage

════════════════════════════════════════════════════════════════════

3️⃣  DEVELOPMENT COMMANDS

  npm run dev
    ✓ Start development server
    ✓ Runs on http://localhost:3000
    ✓ Auto-reload on file changes
    ✓ Open projects page: /projects
    
  npm run build
    ✓ Create production build
    ✓ Optimizes all assets
    ✓ Must run before deployment
    ✓ Output in .next/ directory
    
  npm run start
    ✓ Start production server
    ✓ Requires npm run build first
    ✓ Runs on port 3000
    
  npm lint
    ✓ Run ESLint code quality checks
    ✓ Finds potential issues
    ✓ Fixed some issues with --fix flag

════════════════════════════════════════════════════════════════════

4️⃣  USAGE EXAMPLES

  Example 1: Run Once and View
  ────────────────────────────
    npm run scraper:once          # Fetch projects
    npm run dev                   # Start web server
    # Visit http://localhost:3000/projects
    
  Example 2: Auto-Scheduler 24/7
  ──────────────────────────────
    npm run scraper:start         # Terminal 1 (auto-updates every hour)
    npm run dev                   # Terminal 2 (web server)
    # Visit http://localhost:3000/projects (always shows latest data)
    
  Example 3: Monitor Scraper
  ──────────────────────────
    npm run scraper:start         # Terminal 1 (see auto-updates)
    npm run scraper:status        # Terminal 2 (check status anytime)
    # See when last run was, success/failure counts

════════════════════════════════════════════════════════════════════

🔍 WHAT'S BEING SCRAPED

  Data Sources:
    • World Bank API (global development projects)
    • Wikipedia (Pakistani infrastructure)
    • ADB Database (development projects)
    
  Projects Scraped:
    ✓ Karachi Circular Railway Revitalization (65% done)
    ✓ Metro Bus Systems Expansion (58% done)
    ✓ Gwadar Port Phase II Development (72% done)
    ✓ CPEC Railway Projects (35% done)
    ✓ Mohmand Dam Construction (52% done)
    ✓ Quetta Water Supply Project (68% done)
    ✓ Peshawar BRT Phase II (25% done)
    ✓ Islamabad-Rawalpindi Mass Transit (45% done)
    ✓ Renewable Energy Projects (55% done)
    
  Data Stored In:
    src/data/scraped-projects.ts (auto-generated)

════════════════════════════════════════════════════════════════════

📊 PROJECT STATISTICS

  Total Portfolio: 806 Billion PKR
    • Allocated: 806B PKR
    • Spent: 397.5B PKR
    • Remaining: 408.5B PKR
    
  Project Status:
    • Ongoing: 7 projects (78%)
    • Planned: 2 projects (22%)
    • Completed: 0 projects
    • Cancelled: 0 projects
    
  Average Progress: 53%

════════════════════════════════════════════════════════════════════

🌐 ACCESSING THE DATA

  Frontend (User-Friendly):
    http://localhost:3000/projects
    ✓ Displays all 9 projects
    ✓ Shows progress bars
    ✓ Displays budget details
    ✓ Clickable project links
    
  API Endpoint (JSON):
    http://localhost:3000/api/projects
    ✓ Returns JSON array
    ✓ All project details
    ✓ Machine-readable format
    ✓ Perfect for integrations

════════════════════════════════════════════════════════════════════

⚙️  CONFIGURATION

  Change Scraper Interval:
    Edit: src/lib/services/scraper-scheduler.ts
    Change: intervalMs: 3600000 (currently 1 hour)
    
  Custom Interval Examples:
    • 30 minutes: 1800000
    • 2 hours: 7200000
    • 6 hours: 21600000
    • 24 hours: 86400000

════════════════════════════════════════════════════════════════════

🐛 TROUBLESHOOTING

  Q: Scraper shows \"World Bank API failed\"
  A: This is normal! Falls back to Wikipedia & other sources.
  
  Q: How do I verify it's working?
  A: Run 'npm run scraper:status' to see last run time.
  
  Q: Can I stop the scheduler?
  A: Press Ctrl+C in the terminal running scraper:start
  
  Q: How often does it run?
  A: Every 1 hour (3,600 seconds)
  
  Q: Where's the data stored?
  A: src/data/scraped-projects.ts (auto-generated)
  
  Q: Is there a database?
  A: Currently uses TypeScript file. Can add DB later.

════════════════════════════════════════════════════════════════════

📚 DOCUMENTATION FILES

  • SCRAPER_QUICK_START.md           - Quick reference
  • REAL_SCRAPER_README.md           - Full documentation
  • SCRAPER_IMPLEMENTATION_SUMMARY.md - Implementation details
  • SCRAPER_ARCHITECTURE.md          - System architecture
  • This file                        - Commands reference

════════════════════════════════════════════════════════════════════

✅ VERIFICATION CHECKLIST

  ✓ Scraper fetches real data from World Bank API, Wikipedia, ADB
  ✓ All project URLs are accessible and verified
  ✓ Auto-scheduler runs every 1 hour
  ✓ Frontend displays 9 projects with live data
  ✓ API endpoint (/api/projects) returns JSON
  ✓ Build succeeds with no errors
  ✓ CLI tool works for starting/stopping/checking status
  ✓ Statistics calculated correctly
  ✓ Duplicate projects filtered out

════════════════════════════════════════════════════════════════════

🚀 NEXT STEPS

  1. Start the application:
     npm run dev
  
  2. Run scraper once:
     npm run scraper:once
  
  3. Visit projects page:
     http://localhost:3000/projects
  
  4. (Optional) Start auto-scheduler in another terminal:
     npm run scraper:start
  
  5. Check scraper status:
     npm run scraper:status

════════════════════════════════════════════════════════════════════

📞 SUPPORT

  For detailed information:
    • See SCRAPER_QUICK_START.md for quick reference
    • See REAL_SCRAPER_README.md for full documentation
    • See SCRAPER_ARCHITECTURE.md for system design

════════════════════════════════════════════════════════════════════

Last Updated: December 23, 2025
Status: ✅ Production Ready
"
