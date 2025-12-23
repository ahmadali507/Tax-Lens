# Pakistani Government Projects Scraper - Quick Reference

## 🚀 Quick Start (5 minutes)

### Option 1: Using the Shell Script (Easiest)
```bash
cd /home/ali/Documents/Web_Engineering/project/Tax-Lens

# Install everything and run in one command
./scraper.sh all

# View the results
./scraper.sh view

# Check statistics
./scraper.sh stats
```

### Option 2: Using npm (Manual)
```bash
cd /home/ali/Documents/Web_Engineering/project/Tax-Lens

# Install dependencies
npm install axios cheerio --save
npm install --save-dev @types/node ts-node typescript

# Run the scraper
npx ts-node scripts/scrape-projects.ts
```

---

## 📊 What Gets Scraped

```typescript
type Project = {
    id: string;                              // "1", "2", etc.
    name: string;                            // "Karachi Circular Railway"
    description: string;                     // Detailed description
    status: "ongoing" | "completed" | "planned" | "cancelled";
    progress_percentage: number;             // 0-100
    allocated_budget: number;                // in PKR (e.g., 25000000000)
    spent_amount: number;                    // in PKR
    details_url?: string;                    // Link to official details
};
```

---

## 🎯 Data Sources

1. **PSDP** - https://www.psdp.gov.pk/
2. **Ministry of Planning** - https://www.plandiv.gov.pk/
3. **Punjab** - https://punjab.gov.pk/
4. **Sindh** - https://sindh.gov.pk/
5. **KP** - https://www.kp.gov.pk/
6. **Balochistan** - https://www.balochistan.gov.pk/

---

## 📁 Generated Files

After running the scraper, you'll get:

- `src/data/scraped-projects.ts` - Project data as TypeScript
- `src/lib/services/project-data.service.ts` - Utility functions
- `src/lib/examples/project-usage-examples.ts` - Code examples

---

## 💻 Using in Your App

### Basic Usage
```typescript
import { scrapedProjects } from '@/data/scraped-projects';

export default function ProjectsPage() {
    const projects = scrapedProjects;
    // Use projects...
}
```

### With Filtering
```typescript
import { scrapedProjects } from '@/data/scraped-projects';
import ProjectDataService from '@/lib/services/project-data.service';

export default function ProjectsPage() {
    // Get only ongoing projects
    const projects = ProjectDataService.filterProjects(scrapedProjects, {
        status: 'ongoing'
    });
    
    // Get statistics
    const stats = ProjectDataService.getStatistics(projects);
}
```

---

## 🔧 Common Operations

### Get Only Ongoing Projects
```typescript
ProjectDataService.filterProjects(scrapedProjects, {
    status: 'ongoing'
})
```

### Search for Projects
```typescript
ProjectDataService.filterProjects(scrapedProjects, {
    searchTerm: 'Karachi'
})
```

### Get High-Budget Projects (>20 billion)
```typescript
ProjectDataService.filterProjects(scrapedProjects, {
    minBudget: 20000000000
})
```

### Get Statistics
```typescript
const stats = ProjectDataService.getStatistics(scrapedProjects);
// stats.totalProjects
// stats.totalAllocatedBudget
// stats.totalSpent
// stats.averageProgress
// stats.byStatus
```

### Sort Projects
```typescript
ProjectDataService.sortProjects(scrapedProjects, 'progress_percentage', 'desc')
```

### Group by Status
```typescript
const grouped = ProjectDataService.groupByStatus(scrapedProjects);
// grouped.ongoing, grouped.completed, grouped.planned, grouped.cancelled
```

---

## 📄 Sample Projects Included

1. **Karachi Circular Railway** - 65% complete, PKR 25B
2. **Lahore Metro Bus Extension** - 45% complete, PKR 18B
3. **Gwadar Port Development** - 82% complete, PKR 50B
4. **Quetta Water Supply Project** - 78% complete, PKR 15B
5. **Peshawar BRT Phase 2** - 15% planned, PKR 22B
6. **Islamabad Expressway Widening** - 100% completed, PKR 12B
7. **Multan Ring Road** - 58% complete, PKR 30B
8. **Faisalabad Industrial Zone** - 25% planned, PKR 40B
9. **Sukkur Barrage Rehabilitation** - 100% completed, PKR 8B

---

## 🛠️ Shell Script Commands

```bash
./scraper.sh install      # Install dependencies
./scraper.sh run         # Run scraper
./scraper.sh view        # View generated data
./scraper.sh stats       # Show statistics
./scraper.sh clean       # Delete generated files
./scraper.sh all         # Do everything (recommended)
./scraper.sh help        # Show help
```

---

## 📚 Documentation

- **SCRAPER_README.md** - Full documentation
- **INTEGRATION_GUIDE.md** - How to use in your app
- **SCRAPER_SETUP_SUMMARY.md** - Overview of everything
- **scripts/scrape-projects.ts** - Source code with comments
- **src/lib/examples/project-usage-examples.ts** - 12+ examples

---

## 🔍 Troubleshooting

### Q: "ts-node: command not found"
A: Install it with: `npm install --save-dev ts-node typescript`

### Q: "axios: not found"
A: Install with: `npm install axios cheerio`

### Q: "No projects generated"
A: The scraper has fallback data, so it should always generate some projects. Check for error messages in console.

### Q: How do I update the scraper?
A: Edit `scripts/scrape-projects.ts` and add more source methods following the existing pattern.

---

## 📈 Next Steps

1. ✅ Run `./scraper.sh all` to install and run
2. ✅ View generated data with `./scraper.sh view`
3. ✅ Check INTEGRATION_GUIDE.md for implementation
4. ✅ Update your projects page to use `scrapedProjects`
5. ✅ Customize filtering based on your needs

---

## 📞 Need Help?

1. Check the SCRAPER_README.md file
2. Review src/lib/examples/project-usage-examples.ts
3. See INTEGRATION_GUIDE.md for step-by-step instructions
4. Look at the inline comments in scripts/scrape-projects.ts

---

## ⚡ Performance Tips

- **Cache the data**: Import once at the top of your component
- **Filter early**: Filter projects before rendering to reduce re-renders
- **Use React Query**: For larger apps, use react-query for data fetching
- **Memoize results**: Use useMemo for expensive filtering operations

```typescript
const ongoingProjects = useMemo(() => 
    ProjectDataService.filterProjects(scrapedProjects, {
        status: 'ongoing'
    }),
    [scrapedProjects]
);
```

---

## 🎓 Learning Resources

All source files include detailed comments explaining:
- How the scraper works
- How to use the data service
- Example patterns and best practices
- API documentation

Start with:
1. `scripts/scrape-projects.ts` - Understand the scraper
2. `src/lib/services/project-data.service.ts` - Understand utilities
3. `src/lib/examples/project-usage-examples.ts` - See practical examples

---

**Ready to go!** Run `./scraper.sh all` to get started.
