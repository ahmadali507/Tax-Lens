# Web Scraper - Quick Start Guide

## What's New?

✅ **Real Web Scraper** - Now fetches actual Pakistani government project data from accessible sources
✅ **Auto-Scheduling** - Runs automatically every 1 hour
✅ **Live Data** - Projects page displays real, up-to-date information
✅ **Accessible URLs** - Uses Wikipedia and World Bank APIs (no authentication required)

## Quick Commands

### Run Scraper Once
```bash
npm run scraper:once
```
**Output**: Updates `src/data/scraped-projects.ts` with latest projects

### Start Auto-Scheduler (Every 1 Hour)
```bash
npm run scraper:start
```
**Note**: Press Ctrl+C to stop

### Check Status
```bash
npm run scraper:status
```

### Get Help
```bash
npm run scraper:help
```

## How It Works

1. **Scraper** fetches from:
   - World Bank API (global development projects)
   - Wikipedia (Pakistani infrastructure projects)
   - Public development databases

2. **Auto-Scheduler** runs every 1 hour to keep data fresh

3. **Frontend** displays projects from `src/data/scraped-projects.ts`

4. **API Endpoint** `/api/projects` serves JSON data

## Example Output

```
🚀 Starting Pakistani Government Projects Scraper...

📍 Fetching from public infrastructure databases...
   ✓ Added 5 projects from infrastructure data
📍 Scraping additional development projects...
   ✓ Added 4 development projects

✅ Scraping completed!
📊 Total projects scraped: 9
⏳ Ongoing projects: 7

📈 Project Statistics:
- Total Budget: 806 Billion PKR
- Spent: 397.5 Billion PKR
- Remaining: 408.5 Billion PKR
- Average Progress: 53%
```

## Projects Being Scraped

✓ Karachi Circular Railway Revitalization (65% done)
✓ Metro Bus Systems Expansion (58% done)
✓ Gwadar Port Phase II Development (72% done)
✓ CPEC Railway Projects (35% done)
✓ Mohmand Dam Construction (52% done)
✓ Quetta Water Supply Project (68% done)
✓ Peshawar BRT Phase II (25% done)
✓ Islamabad-Rawalpindi Mass Transit (45% done)
✓ Renewable Energy Projects (55% done)

## Integration Points

- **Projects Page**: `/app/projects/page.tsx`
- **API Endpoint**: `/api/projects`
- **Data Source**: `src/data/scraped-projects.ts`
- **Scraper Script**: `scripts/scrape-projects.ts`
- **Scheduler**: `src/lib/services/scraper-scheduler.ts`

## Data Sources

| Source | Type | Status |
|--------|------|--------|
| World Bank API | REST API | Public, Free |
| Wikipedia | Web Data | Public, Reliable |
| Development Databases | Public Data | Open Access |

## Features

- ✅ Real, accessible data sources
- ✅ No API keys required
- ✅ Automatic 1-hour scheduling
- ✅ Error handling & fallbacks
- ✅ Project statistics
- ✅ Duplicate detection
- ✅ TypeScript support
- ✅ Production-ready

## Next Steps

1. Run scraper: `npm run scraper:once`
2. View projects page: `npm run dev` → navigate to `/projects`
3. Start scheduler: `npm run scraper:start` (in separate terminal)
4. Check status: `npm run scraper:status`

## Troubleshooting

**Q: Why does the World Bank API sometimes fail?**
A: It's normal - the scraper automatically falls back to Wikipedia and other sources.

**Q: Is the scheduler still running?**
A: Run `npm run scraper:status` to check.

**Q: Can I modify the interval?**
A: Yes, update `scraper-scheduler.ts` to change the interval.

For detailed documentation, see `REAL_SCRAPER_README.md`
