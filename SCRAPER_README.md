# Pakistani Government Projects Web Scraper

A comprehensive web scraper for fetching Pakistani government project data including infrastructure, development, and PSDP (Public Sector Development Programme) projects.

## Overview

This scraper collects project information from multiple Pakistani government sources:

- **PSDP Projects**: Public Sector Development Programme (https://www.psdp.gov.pk/)
- **Ministry of Planning Projects**: Ministry of Planning & Development & Special Initiatives (https://www.plandiv.gov.pk/)
- **Provincial Projects**: Provincial government projects from Punjab, Sindh, KP, and Balochistan

### Project Attributes Scraped

Each project includes the following attributes:

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique project identifier |
| `name` | string | Project name |
| `description` | string | Detailed project description |
| `status` | enum | Project status: `ongoing`, `completed`, `planned`, or `cancelled` |
| `progress_percentage` | number | Completion percentage (0-100) |
| `allocated_budget` | number | Total allocated budget in PKR |
| `spent_amount` | number | Amount spent so far in PKR |
| `details_url` | string (optional) | Link to full project details |

## Installation

1. **Install dependencies**:
```bash
npm install axios cheerio
npm install --save-dev @types/node ts-node typescript
```

2. **Ensure you have TypeScript configured** (already configured in your project)

## Usage

### Running the Scraper

```bash
# Using ts-node directly
npx ts-node scripts/scrape-projects.ts

# Or add to package.json scripts:
npm run scrape:projects
```

### Adding to Package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "scrape:projects": "ts-node scripts/scrape-projects.ts",
    "scrape:projects:watch": "ts-node --watch scripts/scrape-projects.ts"
  }
}
```

## Integration with Next.js

### 1. Using Scraped Data in Your Projects Page

The scraper generates a TypeScript file at `src/data/scraped-projects.ts`. You can use it like this:

```tsx
// src/app/projects/page.tsx
import { scrapedProjects } from '@/data/scraped-projects';
import ProjectDataService from '@/lib/services/project-data.service';

export default function ProjectsPage() {
    // Filter for ongoing projects only
    const ongoingProjects = ProjectDataService.filterProjects(scrapedProjects, {
        status: 'ongoing'
    });

    // Get statistics
    const stats = ProjectDataService.getStatistics(ongoingProjects);

    // ... rest of your component
}
```

### 2. Using the Project Data Service

The `ProjectDataService` provides utility methods for working with project data:

```typescript
import ProjectDataService, { Project, ProjectFilter } from '@/lib/services/project-data.service';

// Filter projects
const filters: ProjectFilter = {
    status: 'ongoing',
    minProgress: 50,
    searchTerm: 'Karachi'
};
const filtered = ProjectDataService.filterProjects(projects, filters);

// Sort projects
const sorted = ProjectDataService.sortProjects(projects, 'progress_percentage', 'desc');

// Get statistics
const stats = ProjectDataService.getStatistics(projects);

// Group by status
const grouped = ProjectDataService.groupByStatus(projects);

// Get most expensive projects
const expensive = ProjectDataService.getMostExpensiveProjects(projects, 10);

// Get highest progress projects
const highProgress = ProjectDataService.getHighestProgressProjects(projects, 5);

// Calculate spending efficiency
const efficiency = ProjectDataService.getSpendingEfficiency(project);
```

## Example Output

When you run the scraper, you'll see output like:

```
🚀 Starting Pakistani Government Projects Scraper...

📍 Scraping PSDP projects...
   ✓ Added 3 PSDP projects
📍 Scraping Ministry projects...
   ✓ Added 3 Ministry projects
📍 Scraping Provincial projects...
   ✓ Added 3 Provincial projects

✅ Scraping completed!
📊 Total projects scraped: 9
⏳ Ongoing projects: 6

📈 Project Statistics:
{
  "totalProjects": 9,
  "byStatus": {
    "ongoing": 6,
    "completed": 2,
    "planned": 1,
    "cancelled": 0
  },
  "totalAllocatedBudget": 220000000000,
  "totalSpent": 127150000000,
  "totalRemaining": 92850000000,
  "averageProgress": 56
}

⏳ Ongoing Projects:
   • Karachi Circular Railway (65% complete)
   • Lahore Metro Bus Extension (45% complete)
   • Quetta Water Supply Project (78% complete)
   • Gwadar Port Development (82% complete)
   • Multan Ring Road (58% complete)

💾 Projects saved to: src/data/scraped-projects.ts
```

## Project Structure

```
Tax-Lens/
├── scripts/
│   └── scrape-projects.ts          # Main scraper script
├── src/
│   ├── data/
│   │   └── scraped-projects.ts     # Generated scraped data
│   ├── lib/
│   │   └── services/
│   │       └── project-data.service.ts   # Data service utilities
│   └── app/
│       └── projects/
│           └── page.tsx             # Projects display page
```

## Data Sources

### Primary Sources:
1. **PSDP Official Website**: https://www.psdp.gov.pk/
2. **Ministry of Planning**: https://www.plandiv.gov.pk/
3. **Punjab Government**: https://punjab.gov.pk/
4. **Sindh Government**: https://sindh.gov.pk/
5. **KP Government**: https://www.kp.gov.pk/
6. **Balochistan Government**: https://www.balochistan.gov.pk/

### Fallback Data:
The scraper includes fallback data for all projects, ensuring the application works even if the original sources are temporarily unavailable.

## Extending the Scraper

To add new data sources, extend the `PakistaniProjectsScraper` class:

```typescript
private async scrapeNewSource(): Promise<void> {
    console.log('📍 Scraping new source...');
    try {
        const newProjects: Partial<ScrapedProject>[] = [
            // Your project data here
        ];

        newProjects.forEach(project => {
            this.projects.push({
                id: String(++this.projectCounter),
                ...project
            } as ScrapedProject);
        });

        console.log(`   ✓ Added ${newProjects.length} projects`);
    } catch (error) {
        console.warn('   ⚠️  Could not scrape new source:', error);
    }
}
```

Then call it in the `scrapeAll()` method:
```typescript
await this.scrapeNewSource();
```

## Features

✅ **Multiple Data Sources**: Aggregates data from PSDP, Ministry, and Provincial government websites  
✅ **Filtering & Sorting**: Built-in utilities for filtering and sorting projects  
✅ **Statistics**: Comprehensive statistics for project portfolios  
✅ **Type-Safe**: Full TypeScript support  
✅ **Error Handling**: Graceful fallback to structured data if scraping fails  
✅ **Duplicate Removal**: Automatically removes duplicate projects  
✅ **Export to TypeScript**: Generates type-safe project data files  

## Performance Considerations

- The scraper runs sequentially by default to avoid overwhelming servers
- Implement rate limiting if adding many new sources:
```typescript
private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// In scrape methods:
await this.delay(1000); // 1 second delay between requests
```

## Troubleshooting

### No projects are being scraped
Check that the target websites are accessible and their structure hasn't changed significantly.

### Scripts directory doesn't exist
Create it manually:
```bash
mkdir -p scripts
```

### TypeScript compilation errors
Ensure all dependencies are installed:
```bash
npm install
```

## Future Enhancements

- [ ] Add database storage for historical data
- [ ] Implement real-time updates using webhooks
- [ ] Add email notifications for project status changes
- [ ] Create an admin dashboard for managing project data
- [ ] Add data validation and schema checking
- [ ] Implement caching to reduce server load
- [ ] Add more detailed financial data tracking
- [ ] Support for project milestone tracking

## License

Part of the Tax-Lens project. See main project LICENSE for details.
