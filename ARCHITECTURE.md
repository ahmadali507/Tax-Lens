# Project Scraper Architecture & Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   TAX-LENS APPLICATION                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    ┌────────────┐      ┌────────────┐      ┌────────────┐
    │ scraper.sh │      │   npm run  │      │  ts-node   │
    │   (Bash)   │      │   scripts  │      │ (Direct)   │
    └─────┬──────┘      └─────┬──────┘      └─────┬──────┘
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │  scripts/scrape-projects │
                 │  .ts (Main Scraper)      │
                 └──────────┬───────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────────┐   ┌──────────────┐   ┌─────────────┐
    │ PSDP Sources│   │Ministry Data │   │ Provincial  │
    │ https://psd │   │ https://plan │   │ Government  │
    │ p.gov.pk/   │   │ div.gov.pk/  │   │ WebSites    │
    └──────┬──────┘   └────────┬─────┘   └──────┬──────┘
           │                   │                 │
           └───────────────────┼─────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Data Aggregation   │
                    │  & Deduplication    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────────────────┐
                    │ Type-Safe TypeScript Generation │
                    │ (Auto-generates .ts file)       │
                    └──────────┬──────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        ┌────────────────┐          ┌──────────────────┐
        │ scraped-       │          │ Service Layer    │
        │ projects.ts    │          │ (Utilities)      │
        │ (Project Data) │          │                  │
        └────────┬───────┘          └────────┬─────────┘
                 │                           │
                 └───────────────┬───────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Your Projects Page     │
                    │  /app/projects/page.tsx │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Frontend Display      │
                    │  (Project Cards)       │
                    └────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
                    SCRAPER EXECUTION FLOW
         
┌────────────────────────────────────────────────┐
│ 1. Initialize PakistaniProjectsScraper         │
└────────┬───────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ 2. Call scrapeAll() method                      │
└────────┬───────────────────────────────────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌──────────────────┐          ┌──────────────────┐
│ 2a. PSDP Sources │          │ 2b. Ministry     │
│ • Karachi CW     │          │ • Quetta Water   │
│ • Lahore Metro   │          │ • Peshawar BRT   │
│ • Gwadar Port    │          │ • Islamabad Exp  │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         └────────────┬────────────────┘
                      │
                      ▼
            ┌──────────────────────┐
            │ 2c. Provincial        │
            │ • Multan Ring Road    │
            │ • Faisalabad Zone     │
            │ • Sukkur Barrage      │
            └─────────┬─────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌──────────────────┐    ┌────────────────────┐
│ 3. Aggregate All │    │ 4. Remove          │
│    Projects      │    │    Duplicates      │
│                  │    │                    │
│ Total: 9         │    │ By: project name   │
│ projects         │    │                    │
└────────┬─────────┘    └──────────┬─────────┘
         │                         │
         └────────────┬────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │ 5. Generate Statistics │
         │ • Total Budget         │
         │ • Total Spent          │
         │ • By Status            │
         │ • Average Progress     │
         └────────────┬───────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │ 6. Export to TypeScript │
         │ scraped-projects.ts     │
         └────────────┬────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │ 7. Ready for Use in    │
         │    Your Application    │
         └────────────────────────┘
```

---

## 🔗 Component Integration

```
┌──────────────────────────────────────────────────────────────┐
│                  NEXT.JS APPLICATION LAYER                   │
└──────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ /projects│   │ /about   │   │ /dashboard
        │ page.tsx │   │ page.tsx │   │ page.tsx
        └─────┬────┘   └──────────┘   └──────────┘
              │
              ▼
        ┌──────────────────────────────────┐
        │ Import scrapedProjects           │
        │ from '@/data/scraped-projects'   │
        └─────────┬────────────────────────┘
                  │
                  ▼
        ┌──────────────────────────────────┐
        │ Import ProjectDataService        │
        │ from '@/lib/services/project-    │
        │ data.service'                    │
        └─────────┬────────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
       ▼                     ▼
    ┌───────────┐        ┌──────────┐
    │ Filter    │        │ Statistics
    │ Projects  │        │ & Analysis
    └─────┬─────┘        └────┬─────┘
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │ Render Components:        │
        │ • ProjectCards            │
        │ • ProjectFilters          │
        │ • ProjectStats            │
        │ • ProjectCharts           │
        └───────────────────────────┘
```

---

## 📦 File Structure with Relationships

```
Tax-Lens/
│
├── scripts/
│   └── scrape-projects.ts ◄─────────────┐
│       • Fetches data                    │ Uses
│       • Aggregates sources              │
│       • Generates files                 │
│                                         │
├── src/
│   │
│   ├── data/
│   │   └── scraped-projects.ts ◄────────┤
│   │       • Project data                │ Generated by
│   │       • TypeScript export           │ scraper
│   │       • 9 sample projects           │
│   │
│   ├── lib/
│   │   ├── services/
│   │   │   └── project-data.service.ts
│   │   │       • Filter by status, budget, progress
│   │   │       • Sort projects
│   │   │       • Calculate statistics
│   │   │       • Group by status
│   │   │       • Efficiency analysis
│   │   │
│   │   └── examples/
│   │       └── project-usage-examples.ts
│   │           • 12+ usage patterns
│   │           • Dashboard helpers
│   │           • Report generation
│   │
│   └── app/
│       └── projects/
│           └── page.tsx
│               │ Imports from:
│               ├─► scraped-projects.ts
│               ├─► project-data.service.ts
│               └─► example functions
│
├── scraper.sh
│   • Easy command-line interface
│   • Automates setup and execution
│
├── QUICK_REFERENCE.md ◄──── Start here for quick setup
├── SCRAPER_README.md ◄────── Full documentation
├── INTEGRATION_GUIDE.md ◄─── How to use in your app
└── SCRAPER_SETUP_SUMMARY.md ◄── Complete overview
```

---

## 🔄 Data Processing Pipeline

```
┌─────────────────────────────────────────────────────────┐
│ RAW DATA (From government sources)                       │
│ • Project names                                          │
│ • Descriptions                                           │
│ • Budget information                                     │
│ • Progress percentages                                   │
│ • Status information                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ PARSING STAGE   │
            │ • Extract data  │
            │ • Normalize     │
            │ • Validate      │
            └────────┬────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ AGGREGATION STAGE      │
        │ • Combine sources      │
        │ • Merge duplicates     │
        │ • Sort & organize      │
        └────────┬───────────────┘
                 │
                 ▼
      ┌──────────────────────────┐
      │ TRANSFORMATION STAGE     │
      │ • Convert to TypeScript  │
      │ • Apply type safety      │
      │ • Format for export      │
      └────────┬─────────────────┘
               │
               ▼
        ┌──────────────────┐
        │ STORAGE STAGE    │
        │ • Write to .ts   │
        │ • Save to disk   │
        │ • Ready for use  │
        └────────┬─────────┘
                 │
                 ▼
    ┌─────────────────────────────┐
    │ READY FOR CONSUMPTION       │
    │ • Import in components      │
    │ • Filter & analyze          │
    │ • Display in UI             │
    └─────────────────────────────┘
```

---

## 🎯 Service Layer Methods Map

```
ProjectDataService
│
├── filterProjects()
│   ├── By status (ongoing, completed, planned, cancelled)
│   ├── By budget range (min/max)
│   ├── By progress range
│   └── By search term (name or description)
│
├── sortProjects()
│   ├── By name
│   ├── By allocated_budget
│   ├── By spent_amount
│   ├── By progress_percentage
│   └── ASC/DESC order
│
├── getStatistics()
│   ├── totalProjects
│   ├── totalAllocatedBudget
│   ├── totalSpent
│   ├── totalRemaining
│   ├── averageProgress
│   └── byStatus { ongoing, completed, planned, cancelled }
│
├── groupByStatus()
│   ├── .ongoing
│   ├── .completed
│   ├── .planned
│   └── .cancelled
│
├── getSpendingEfficiency()
│   └── (spent / allocated) * 100
│
├── getMostExpensiveProjects()
│   └── Top N by budget
│
└── getHighestProgressProjects()
    └── Top N by completion %
```

---

## 🚀 Execution Paths

### Path 1: Shell Script (Easiest)
```
User → ./scraper.sh all → Check dependencies → Install packages → Run scraper → Display stats
```

### Path 2: Direct TypeScript
```
User → npx ts-node scripts/scrape-projects.ts → Execute → Generate data → Success
```

### Path 3: npm Script (If configured)
```
User → npm run scrape:projects → Execute → Generate data → Success
```

---

## 💾 Data Persistence

```
In-Memory (During Execution)
         │
         ▼
Project Objects in RAM
• Aggregated from all sources
• Deduplicated
• Validated
         │
         ▼
TypeScript File Generation
• src/data/scraped-projects.ts
         │
         ▼
Disk Storage
• Permanent project data
• Type-safe format
• Ready for imports
         │
         ▼
Runtime (Next.js Application)
• Import scraped data
• Use in components
• Filter and display
```

---

## 🔐 Data Quality Assurance

```
┌────────────────────────────────────────┐
│ INPUT DATA VALIDATION                  │
│ ✓ Required fields present              │
│ ✓ Budget is number > 0                 │
│ ✓ Progress 0-100                       │
│ ✓ Valid status enum                    │
│ ✓ Description not empty                │
└────────────────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ DUPLICATE REMOVAL     │
         │ • Compare names       │
         │ • Keep unique items   │
         │ • Maintain count      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌────────────────────────┐
         │ STATISTICS VALIDATION  │
         │ • Sum calculations     │
         │ • Average calculations │
         │ • Count verification   │
         └────────────────────────┘
```

---

**This architecture ensures:**
- ✅ Type-safe data handling
- ✅ Easy integration with Next.js
- ✅ Flexible filtering and analysis
- ✅ Scalable data source addition
- ✅ Maintainable code structure
- ✅ Comprehensive documentation
