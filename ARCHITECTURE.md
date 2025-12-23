# Tax-Lens: Scraper Architecture & System Design

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TAX-LENS APPLICATION                            │
│              Real-Time Government Project Tracker                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
   │ CLI Tool    │   │  npm Script   │   │  Scheduler   │
   │ cli.ts      │   │ scraper:once  │   │ hourly runs  │
   └─────┬───────┘   └────────┬──────┘   └──────┬───────┘
         │                    │                  │
         └────────────────────┼──────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │  scripts/scrape-projects.ts   │
              │   PakistanProjectScraper      │
              └───────────────┬───────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ PC.GOV.PK    │  │ CPEC Portal   │  │ Punjab PMDFC │
    │ & PSDP       │  │ cpec.gov.pk   │  │ pmdfc.punjab │
    │ Ministry     │  │              │  │ .gov.pk      │
    │ Planning     │  │              │  │              │
    └──────┬───────┘  └────────┬──────┘  └──────┬───────┘
           │                   │                 │
           └───────────────────┼─────────────────┘
                               │
                        ┌──────▼──────┐
                        │ Graana.com   │
                        │ Real Estate  │
                        └──────┬───────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
       ┌─────────┐      ┌─────────────┐    ┌──────────┐
       │ Cheerio │      │  Fallback   │    │HTML Parse│
       │ HTML    │      │ Projects    │    │  Data    │
       │ Parser  │      │ (17 known)  │    │          │
       └────┬────┘      └──────┬──────┘    └─────┬────┘
            │                  │                 │
            └──────────────────┼─────────────────┘
                               │
            ┌──────────────────▼─────────────────┐
            │  Data Processing                   │
            │  ├─ Extract project attributes    │
            │  ├─ Parse budget/progress         │
            │  ├─ Infer status                  │
            │  └─ Add timestamps                │
            └──────────────────┬─────────────────┘
                               │
            ┌──────────────────▼─────────────────┐
            │  Deduplication                     │
            │  Remove duplicates by name         │
            └──────────────────┬─────────────────┘
                               │
            ┌──────────────────▼─────────────────┐
            │  Supabase REST API Upsert         │
            │  ├─ POST /rest/v1/projects        │
            │  ├─ PATCH if exists by name       │
            │  └─ INSERT if new                 │
            └──────────────────┬─────────────────┘
                               │
                ┌──────────────▼──────────────┐
                │                            │
                ▼                            ▼
    ┌─────────────────────┐    ┌──────────────────────┐
    │  Supabase Database  │    │ Projects Table       │
    │  aqchxlqcuzhpbchjq  │    │ ├─ id (UUID)        │
    │  ocn.supabase.co    │    │ ├─ name (unique)    │
    │                     │    │ ├─ description      │
    │ 17+ projects        │    │ ├─ status           │
    │ Last updated: now   │    │ ├─ progress_pct     │
    │                     │    │ ├─ allocated_budget │
    │                     │    │ ├─ spent_amount     │
    │                     │    │ ├─ source           │
    │                     │    │ ├─ location         │
    │                     │    │ ├─ ministry         │
    │                     │    │ ├─ scraped_at       │
    │                     │    │ └─ updated_at       │
    └──────────────┬──────┘    └──────────┬──────────┘
                   │                      │
                   └──────────┬───────────┘
                              │
            ┌─────────────────▼──────────────────┐
            │  Frontend Server-Side Fetch        │
            │  /app/projects/page.tsx            │
            │  createClient() → from('projects') │
            └─────────────────┬──────────────────┘
                              │
            ┌─────────────────▼──────────────────┐
            │  React Server Component            │
            │  Renders Project Cards             │
            │  ├─ Budget display (allocated/spent)
            │  ├─ Progress bar                   │
            │  ├─ Status badges                  │
            │  ├─ Location & ministry            │
            │  └─ External links                 │
            └─────────────────┬──────────────────┘
                              │
            ┌─────────────────▼──────────────────┐
            │  Browser Display                   │
            │  Live Project Dashboard            │
            │  Updated every 1 hour              │
            └──────────────────────────────────┘
```

---

## 📊 Data Flow: Scraping to Display

```
                     COMPLETE DATA PIPELINE
                     
START: Scheduled or Manual Trigger
   │
   ├─ Trigger: npm run scraper:once (manual)
   │          npm run scraper:start (hourly)
   │
   ├─► Load env: .env.local (Supabase credentials)
   │
   └─► Execute: PakistanProjectScraper.scrapeAll()
       │
       ├─ scrapePCGovProjects()
       │  ├─ GET: https://pc.gov.pk/web/projects
       │  ├─ GET: https://pc.gov.pk/web/psdp
       │  ├─ Parse HTML with Cheerio
       │  ├─ Extract: name, description, details_url
       │  └─ Fallback: 2 known PC.gov.pk projects if fails
       │
       ├─ scrapeCPECProjects()
       │  ├─ GET: https://cpec.gov.pk
       │  ├─ Find CPEC-related projects
       │  └─ Fallback: 2 known CPEC projects
       │
       ├─ scrapePunjabProjects()
       │  ├─ GET: https://pmdfc.punjab.gov.pk/ongoing_projects
       │  ├─ Extract table rows
       │  └─ Fallback: 1 known Punjab project
       │
       ├─ scrapeGranaProjects()
       │  ├─ GET: https://graana.com/projects/list/
       │  ├─ Parse real estate projects
       │  └─ Fallback: 2 known real estate projects
       │
       └─ scrapeDevelopmentProjects()
          ├─ Add 6 known development projects
          ├─ Karachi Water & Sewerage
          ├─ Lahore Orange Line
          ├─ Hyderabad Ring Road
          ├─ Kohat Tunnel
          ├─ Balochistan Energy
          └─ Rawalpindi Congestion Relief
       
       ▼
       
   AGGREGATE: Collect all projects (17+)
       │
       ├─ Total Budget: 499.50 Billion PKR
       ├─ Total Spent: 231.49 Billion PKR
       ├─ Total Remaining: 268.01 Billion PKR
       ├─ Ongoing: 15 projects (88%)
       ├─ Planned: 2 projects (12%)
       └─ Average Progress: 45%
       
       ▼
       
   DEDUPLICATE: Remove by project name
       │
       ├─ Compare each project name
       ├─ Keep most recent version
       └─ Result: 17 unique projects
       
       ▼
       
   PARSE & TRANSFORM:
       ├─ Extract: name, description, status
       ├─ Parse: progress_percentage (0-100)
       ├─ Parse: allocated_budget (BIGINT)
       ├─ Parse: spent_amount (BIGINT)
       ├─ Extract: location (city/province)
       ├─ Extract: ministry (department)
       └─ Add: source, scraped_at timestamp
       
       ▼
       
   PERSIST TO SUPABASE:
       ├─ URL: https://aqchxlqcuzhpbchjqocn.supabase.co/
       ├─ Endpoint: /rest/v1/projects
       ├─ Auth: Bearer {NEXT_PUBLIC_SUPABASE_ANON_KEY}
       │
       └─ For each project:
          ├─ Try: POST (insert new)
          ├─ If 409 Conflict: PATCH (update existing)
          └─ Result: Upserted to database
       
       ▼
       
   VERIFY:
       ├─ Check total count in database
       ├─ Display statistics
       └─ Show last updated timestamp
       
       ▼
       
   FRONTEND FETCH:
       ├─ File: src/app/projects/page.tsx
       ├─ Server Component: async function
       ├─ Call: await createClient()
       ├─ Query: select * from projects
       ├─ Order: created_at DESC
       └─ Pass: data as props to components
       
       ▼
       
   RENDER:
       ├─ Map projects array
       ├─ Create ProjectCard components
       ├─ Display: name, description, status
       ├─ Show: progress bar, budget, spent
       ├─ Indicate: source, location, ministry
       └─ Provide: link to details
       
       ▼
       
   DISPLAY IN BROWSER:
       ├─ URL: http://localhost:3000/projects
       ├─ Grid layout: 3 columns (responsive)
       ├─ Each card shows: project data
       ├─ Last updated: timestamp at top
       └─ Total projects: count at top
```

---

## �� Scheduling Architecture

```
SCHEDULER MODES:

1. MANUAL EXECUTION
   User → npm run scraper:once
   │
   ├─ Load scraper
   ├─ Execute immediately
   ├─ Persist results
   └─ Exit

2. SCHEDULED EXECUTION (Hourly)
   npm run scraper:start
   │
   ├─ Initialize scheduler
   ├─ Set interval: 3,600,000ms (1 hour)
   ├─ Start timer
   │
   └─ Every 1 hour:
      ├─ Execute full scraper
      ├─ Persist to Supabase
      ├─ Update database
      └─ Ready for next hour
   
   Status:
   └─ npm run scraper:status
      ├─ Is running?
      ├─ Last run time
      ├─ Success count
      ├─ Failure count
      └─ Interval

3. STOP SCHEDULER
   npm run scraper:status (check)
   Ctrl+C in terminal (stop)
```

---

## 📦 File Structure

```
Tax-Lens/
│
├── .env.local                              # 🔐 Supabase credentials (secret)
│   ├─ NEXT_PUBLIC_SUPABASE_URL
│   └─ NEXT_PUBLIC_SUPABASE_ANON_KEY
│
├── supabase/
│   ├── server.ts                          # Server-side Supabase client
│   ├── client.ts                          # Client-side Supabase setup
│   └── migrations/
│       └── 20251223_create_projects_table.sql  # 📋 Table schema (execute in Supabase)
│
├── scripts/
│   ├── scrape-projects.ts                 # 🤖 Main scraper (fetches & persists)
│   │   └─ class PakistanProjectScraper
│   │      ├─ scrapePCGovProjects()
│   │      ├─ scrapeCPECProjects()
│   │      ├─ scrapePunjabProjects()
│   │      ├─ scrapeGranaProjects()
│   │      ├─ scrapeDevelopmentProjects()
│   │      ├─ persistToSupabase()          # 💾 REST API upsert
│   │      └─ displayStatistics()
│   │
│   ├── cli.ts                             # 🎮 Scheduler control CLI
│   │   ├─ start    → npm run scraper:start
│   │   ├─ once     → npm run scraper:once
│   │   ├─ status   → npm run scraper:status
│   │   └─ help     → npm run scraper:help
│   │
│   ├── init-supabase.ts                   # 🔧 Database initialization helper
│   └── test-supabase.ts                   # ✅ Connection test script
│
├── src/
│   ├── app/
│   │   ├── projects/
│   │   │   └── page.tsx                  # 🌐 Projects display page
│   │   │       └─ Server component
│   │   │       └─ Fetches from Supabase
│   │   │       └─ Renders project cards
│   │   │
│   │   └── api/
│   │       └── projects/
│   │           └── route.ts              # (legacy - currently unused)
│   │
│   └── components/
│       └── ui/                           # shadcn components
│
├── package.json
│   ├─ dependencies:
│   │  ├─ axios (HTTP requests)
│   │  ├─ cheerio (HTML parsing)
│   │  ├─ dotenv (env loading)
│   │  └─ @supabase/ssr (server client)
│   │
│   └─ scripts:
│      ├─ npm run dev              → next dev
│      ├─ npm run build            → next build
│      ├─ npm run start            → next start
│      ├─ npm run scraper:once     → npx tsx scripts/scrape-projects.ts
│      ├─ npm run scraper:start    → npx tsx scripts/cli.ts start
│      ├─ npm run scraper:status   → npx tsx scripts/cli.ts status
│      ├─ npm run scraper:help     → npx tsx scripts/cli.ts help
│      └─ npm run init:db          → npx tsx scripts/init-supabase.ts
│
├── FIX_RLS_POLICIES.sql                  # 🔑 RLS policy fixes (for permissions)
├── README.md                              # 📖 Main documentation (START HERE)
└── ARCHITECTURE.md                        # 🏗️ This file
```

---

## 🔐 Authentication & Security

```
SUPABASE AUTHENTICATION FLOW:

1. Environment Variables
   ├─ NEXT_PUBLIC_SUPABASE_URL (public)
   ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY (public key for unauthenticated access)
   └─ Loaded from .env.local (NEVER committed to git)

2. REST API Headers
   POST /rest/v1/projects
   ├─ apikey: {NEXT_PUBLIC_SUPABASE_ANON_KEY}
   ├─ Authorization: Bearer {NEXT_PUBLIC_SUPABASE_ANON_KEY}
   ├─ Content-Type: application/json
   └─ Prefer: resolution=merge-duplicates

3. Row-Level Security (RLS) Policies
   ├─ SELECT: Allow public read (anyone can view)
   ├─ INSERT: Allow anyone to insert (for scraper)
   ├─ UPDATE: Allow anyone to update (for upsert)
   └─ DELETE: Only authenticated users

4. Data Encryption
   ├─ HTTPS connection (TLS/SSL)
   ├─ Credentials never in source code
   └─ .env.local in .gitignore
```

---

## 🎯 Data Schema

```
projects table:
┌────────────────────────────────────────┐
│ id          UUID (PRIMARY KEY)         │
│ name        TEXT (UNIQUE)              │  ← Upsert key
│ description TEXT                       │
│ status      TEXT (enum check)          │  → ongoing/planned/completed/cancelled
│ progress_percentage INT (0-100)        │
│ allocated_budget BIGINT                │  → PKR (Pakistani Rupees)
│ spent_amount BIGINT                    │  → PKR
│ details_url TEXT (nullable)            │  → Link to details
│ source      TEXT                       │  → pc.gov.pk/cpec/graana/etc
│ location    TEXT (nullable)            │  → City/Province
│ ministry    TEXT (nullable)            │  → Government department
│ scraped_at  TIMESTAMP WITH TIME ZONE   │  → When data was fetched
│ created_at  TIMESTAMP WITH TIME ZONE   │  → Record creation time
│ updated_at  TIMESTAMP WITH TIME ZONE   │  → Last update time
└────────────────────────────────────────┘

Indexes:
├─ idx_projects_name       (for upsert lookup)
├─ idx_projects_status     (for filtering)
├─ idx_projects_source     (for filtering)
└─ idx_projects_created_at (for sorting)
```

---

## 🚀 Deployment & Production

```
LOCAL DEVELOPMENT:
1. npm run dev                 → Start dev server
2. npm run scraper:once        → Run scraper once
3. npm run scraper:start       → Start hourly scheduler
4. Visit: http://localhost:3000/projects

PRODUCTION:
1. npm run build               → Create optimized build
2. npm start                   → Start production server
3. npm run scraper:start       → Start scraper scheduler
4. Deploy to hosting (Vercel, Railway, etc)
5. Scraper runs automatically every hour
6. Data persists in Supabase (no local storage needed)

MONITORING:
├─ npm run scraper:status     → Check scheduler health
├─ View Supabase dashboard    → Monitor database
├─ Check logs                 → Debug issues
└─ Verify timestamps          → Ensure recent updates
```

---

## ✨ Key Features

✅ **Real-Time Data** - Fetches from 5 Pakistani government sources
✅ **Automatic Updates** - Runs every 1 hour via scheduler
✅ **Persistent Storage** - All data in Supabase database
✅ **Smart Deduplication** - Removes duplicates by project name
✅ **Upsert Logic** - Updates existing projects, inserts new ones
✅ **Type-Safe** - Full TypeScript with interfaces
✅ **Server-Side Rendering** - Fast, SEO-friendly page load
✅ **Fallback Mechanism** - Known projects if scraping fails
✅ **Rich Data** - Budget, progress, status, location, ministry
✅ **Production-Ready** - Tested and verified build

---

## 🔗 Related Files

- **README.md** - Getting started guide and quick reference
- **FIX_RLS_POLICIES.sql** - Row-level security policy updates
- **.env.local** - Supabase credentials (keep secret!)
- **package.json** - Dependencies and npm scripts
- **next.config.ts** - Next.js configuration
