# Tax-Lens: Complete System Architecture

A civic transparency platform with four main features: tax collection tracking, government project monitoring, personal tax insights, and public expenditure analytics.

## 🏗️ High-Level Architecture

```
                    TAX-LENS PLATFORM
                    
        ┌──────────────────────────────────────┐
        │         FRONTEND (Next.js 16)        │
        │    React Server & Client Components  │
        └────┬──────────────────────────────┬──┘
             │                              │
    ┌────────▼────────────┐      ┌─────────▼──────────┐
    │  User-Facing Pages  │      │  Admin & Scraper   │
    │  ┌────────────────┐ │      │  ┌──────────────┐  │
    │  │ Tax Upload     │ │      │  │CLI Scheduler │  │
    │  │ Dashboard      │ │      │  │Background    │  │
    │  │ Projects       │ │      │  │Jobs          │  │
    │  │ Track Expend.  │ │      │  └──────────────┘  │
    │  └────────────────┘ │      │                    │
    └─────────┬───────────┘      └──────┬─────────────┘
              │                         │
              │   ┌─────────────────────┘
              │   │
    ┌─────────▼───▼──────────────────────┐
    │  BACKEND LAYER                     │
    │  ┌─────────────────────────────┐   │
    │  │ Server Actions (TypeScript)  │   │
    │  │ ├─ auth.actions.ts          │   │
    │  │ ├─ tax-slip.actions.ts      │   │
    │  │ ├─ project.actions.ts       │   │
    │  │ └─ contact.actions.ts       │   │
    │  └──────────────┬────────────────┘   │
    │                │                    │
    │  ┌─────────────▼────────────────┐   │
    │  │ Supabase Client Integration  │   │
    │  │ ├─ server.ts (SSR)           │   │
    │  │ └─ client.ts (CSR)           │   │
    │  └──────────────┬────────────────┘   │
    └─────────────────┼───────────────────┘
                      │
         ┌────────────▼────────────┐
         │   SUPABASE DATABASE     │
         │                         │
         │ ┌─────────────────────┐ │
         │ │ users table         │ │
         │ ├─ id, email, ...     │ │
         │ └─────────────────────┘ │
         │                         │
         │ ┌─────────────────────┐ │
         │ │ tax_slips table     │ │
         │ ├─ id, user_id        │ │
         │ ├─ amount, date       │ │
         │ ├─ category           │ │
         │ └─ file_url           │ │
         │                         │
         │ ┌─────────────────────┐ │
         │ │ projects table      │ │
         │ ├─ id, name           │ │
         │ ├─ budget, status     │ │
         │ ├─ progress, ministry │ │
         │ └─ source, scraped_at │ │
         │                         │
         │ ┌─────────────────────┐ │
         │ │ Authentication      │ │
         │ ├─ JWT tokens         │ │
         │ └─ RLS Policies       │ │
         │                         │
         └─────────────────────────┘
```

---

## 📊 Four Core Features

### 1️⃣ Tax Upload & Management (`/upload`)

**Purpose**: Allow authenticated users to upload and categorize tax slips

**Data Flow**:
```
User → Form (File + Amount + Date + Category)
   │
   ▼
Validation (Zod schema)
   │
   ▼
Authentication Check (Server Action)
   │
   ▼
File Upload to Supabase Storage
   │
   ├─ Generate unique filename: {user_id}/{timestamp}-{random}.{ext}
   ├─ Upload to tax-slips bucket
   └─ Get public URL
   │
   ▼
Insert Record to tax_slips Table
   │
   ├─ user_id, amount, date, category
   ├─ file_url (public URL)
   ├─ created_at timestamp
   └─ RLS: User can only insert own records
   │
   ▼
Success Response
   └─ User sees confirmation message
```

**Components**:
- `src/app/upload/page.tsx` - Page route
- `src/actions/tax-slip.actions.ts` - `uploadTaxSlip()` server action
- Form validation with Zod schema
- File storage in Supabase bucket

**Database Access**:
```sql
INSERT INTO tax_slips (user_id, amount, date, category, file_url)
VALUES (auth.uid(), ..., ..., ..., ...)
-- RLS: Only allow INSERT if user_id matches auth.uid()
```

---

### 2️⃣ Tax Dashboard (`/dashboard`)

**Purpose**: Show authenticated users their personal tax collection breakdown

**Data Flow**:
```
User (Authenticated) → /dashboard
   │
   ▼
Server Component Loads
   │
   ├─ Get current user ID
   │
   ▼
Fetch Personal Tax Data (Server Action)
   │
   ├─ getTaxSlipsByDateRange(startDate, endDate)
   ├─ OR getDashboardData(userId)
   │
   ▼
Query Supabase
   │
   SELECT * FROM tax_slips
   WHERE user_id = auth.uid()  ← RLS enforces this
   AND date BETWEEN startDate AND endDate
   │
   ▼
Process Results
   │
   ├─ Sum total amount
   ├─ Count by category
   ├─ Group by month
   ├─ Calculate trends
   │
   ▼
Render Components
   │
   ├─ Statistics cards (total, count, avg)
   ├─ Category breakdown (pie/bar chart)
   ├─ Monthly timeline chart
   ├─ Recent uploads list
   │
   ▼
Display in Browser
   └─ User sees personal tax overview
```

**Components**:
- `src/app/dashboard/page.tsx` - Page route
- `src/components/dashboard/dashboard-charts.tsx` - Recharts visualizations
- `src/components/dashboard/dashboard-stats.tsx` - Statistics cards
- `src/components/dashboard/dashboard-recent-list.tsx` - Recent uploads

**Database Access**:
```sql
SELECT * FROM tax_slips
WHERE user_id = auth.uid()  -- RLS enforces user sees only own data
ORDER BY created_at DESC
```

---

### 3️⃣ Projects Dashboard (`/projects`)

**Purpose**: Display all scraped government projects in real-time

**Data Flow**:
```
Scheduled Task (Every 1 Hour) ──OR─→ Manual Trigger
   │                                  │
   ▼                                  ▼
npm run scraper:start          npm run scraper:once
   │                                  │
   └──────────┬──────────────────────┘
              │
              ▼
   Execute: PakistanProjectScraper
              │
     ┌────────┴────────┬──────────┬──────────┐
     │                 │          │          │
     ▼                 ▼          ▼          ▼
  PC.gov.pk        CPEC      Punjab      Graana
  + PSDP          Portal     PMDFC      Real Estate
     │                 │          │          │
     ├─ Fetch HTML ────┼──────────┼──────────┤
     ├─ Parse with     │          │          │
     │  Cheerio        │          │          │
     └─ Extract data ──┴──────────┴──────────┘
              │
              ▼
      Data Processing
     ├─ Extract attributes
     ├─ Parse budgets
     ├─ Deduplicate by name
     └─ Add timestamps
              │
              ▼
    Persist to Supabase
     ├─ UPSERT pattern:
     │  ├─ POST /rest/v1/projects (INSERT if new)
     │  └─ PATCH (UPDATE if exists by name)
     └─ All 17+ projects stored
              │
              ▼
   Frontend Display
              │
     ┌────────▼────────────────────┐
     │ GET /projects (Server)       │
     │ ├─ Query: SELECT * FROM      │
     │ │         projects           │
     │ ├─ Order: created_at DESC    │
     │ └─ No RLS restriction        │
     │   (public data)              │
     │                              │
     ▼                              │
  React Components ────────────────┘
     │
     ├─ Map projects array
     ├─ Create ProjectCard for each
     │
     ▼
  Display Grid
     ├─ Project name
     ├─ Description
     ├─ Status badge
     ├─ Progress bar
     ├─ Budget (allocated/spent)
     ├─ Source, location, ministry
     └─ External link
     │
     ▼
  Browser: /projects page
     └─ Live data, updated every hour
```

**Components**:
- `src/app/projects/page.tsx` - Server component with Supabase fetch
- Project card components display individual projects
- Responsive grid layout (3 columns on desktop)

**Scraper Integration**:
```
scripts/scrape-projects.ts → Fetches from 5 sources
                          ↓
                  Data cleaning & dedup
                          ↓
                  Supabase upsert
                          ↓
                  projects table
                          ↓
                  /projects page displays
```

**Database Access**:
```sql
-- Scraper: Upsert projects
INSERT INTO projects (name, description, status, ...)
VALUES (...)
ON CONFLICT (name) DO UPDATE SET (...)

-- Frontend: Public read
SELECT * FROM projects
ORDER BY created_at DESC
-- No RLS needed: projects are public
```

---

### 4️⃣ Track Expenditure (`/track-expenditure`)

**Purpose**: Public analytics dashboard comparing tax inflow vs government spending

**Key Features**:
- ✅ **No authentication required** - Anyone can view analytics
- ✅ **Date range filtering** - Custom start/end dates
- ✅ **Tax statistics** - Total collected, unique contributors
- ✅ **Project statistics** - Allocated budget, spent amount
- ✅ **Visual comparison** - Bar & pie charts
- ✅ **Dark/Light theme** - Full theme support

**Data Flow**:
```
Anonymous User → /track-expenditure
     │
     ▼
Select Date Range
     ├─ Start date: YYYY-MM-DD
     └─ End date: YYYY-MM-DD
     │
     ▼
Click "Analyze"
     │
     ├─────────────────────────┬──────────────────────┐
     │                         │                      │
     ▼                         ▼                      ▼
  Load Component          Server Actions          Process
  Client Component        ┌──────────────┐        Results
  ├─ Date pickers      │ getTaxSlips │        ├─ Sum amounts
  ├─ Stats cards      │ ByDateRange │        ├─ Count users
  ├─ Charts           └──────┬───────┘        ├─ Sum budgets
  └─ Loading states         │                 └─ Calculate %
                   ┌────────▼──────────┐
                   │ getProjects      │
                   │ ByDateRange      │
                   └────────┬──────────┘
                            │
              ┌─────────────▼─────────────┐
              │                           │
              ▼                           ▼
         Query Supabase           Query Supabase
         ┌─────────────────┐      ┌──────────────┐
         │ SELECT * FROM   │      │ SELECT * FROM│
         │ tax_slips       │      │ projects     │
         │ WHERE date      │      │ WHERE        │
         │ BETWEEN ? AND ? │      │ scraped_at   │
         │                 │      │ BETWEEN      │
         │ NO RLS needed:  │      │ ? AND ?      │
         │ Anyone can read │      │              │
         │ (aggregated)    │      │ PUBLIC data  │
         └────────┬────────┘      └──────┬───────┘
                  │                      │
                  └─────────┬────────────┘
                            │
                            ▼
                    Aggregate Data
                    ├─ totalTaxCollected: SUM(amount)
                    ├─ uniqueUsers: COUNT(DISTINCT user_id)
                    ├─ totalAllocatedBudget: SUM(allocated_budget)
                    └─ totalSpentBudget: SUM(spent_amount)
                            │
                            ▼
                    Create ExpenditureData object
                    ├─ taxCount
                    ├─ projectCount
                    ├─ trends (increase/decrease)
                    └─ calculated percentages
                            │
                            ▼
                    Render Components
                    ├─ ExpenditureStats (4 cards)
                    │  ├─ Total Tax Collected
                    │  ├─ Unique Contributors
                    │  ├─ Allocated Budget
                    │  └─ Spent Amount (%)
                    │
                    └─ ExpenditureCharts
                       ├─ Bar Chart (comparison)
                       └─ Pie Chart (utilization)
                            │
                            ▼
                    Display in Browser
                    └─ Public analytics visible
```

**Components**:
- `src/app/track-expenditure/page.tsx` - Server page route
- `src/components/track-expenditure/track-expenditure-client.tsx` - Main UI with date picker
- `src/components/track-expenditure/expenditure-stats.tsx` - 4 stat cards
- `src/components/track-expenditure/expenditure-charts.tsx` - Recharts (bar & pie)

**Server Actions**:
- `getTaxSlipsByDateRange(startDate, endDate)` - Fetch tax data with date normalization
- `getProjectsByDateRange(startDate, endDate)` - Fetch project data

**Database Access**:
```sql
-- Tax slips: Anonymous read allowed via RLS policy
SELECT * FROM tax_slips
WHERE date >= normalizedStartDate
  AND date <= normalizedEndDate
-- RLS: CREATE POLICY "Anyone can read tax slips for analytics"
--      FOR SELECT USING (true)

-- Projects: Public read (no RLS restriction)
SELECT * FROM projects
WHERE scraped_at >= startDate
  AND scraped_at <= endDate
```

**Key Implementation Details**:
- Date normalization: `startDate.split('T')[0]` removes time component
- YYYY-MM-DD format required for DATE field comparison
- Aggregation: SUM for amounts, COUNT DISTINCT for users
- No auth checks: Works for anyone, logged in or not
- Supports both light and dark themes

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
│       ├── 20251208145318_create_users_table.sql
│       ├── 20251208184107_create_tax_slips_table.sql
│       └── 20251223_create_projects_table.sql
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
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # 📊 Tax dashboard (authenticated)
│   │   │
│   │   ├── projects/
│   │   │   └── page.tsx                  # 🌐 Government projects (public)
│   │   │
│   │   ├── track-expenditure/
│   │   │   └── page.tsx                  # 📈 Analytics dashboard (public)
│   │   │
│   │   ├── upload/
│   │   │   └── page.tsx                  # 📁 Tax slip upload (authenticated)
│   │   │
│   │   ├── about/
│   │   ├── category/
│   │   ├── connect/
│   │   │
│   │   ├── api/
│   │   │   ├── projects/
│   │   │   │   └── route.ts              # (legacy - currently unused)
│   │   │   └── track-expenditure/
│   │   │       └── route.ts              # (legacy - currently unused)
│   │   │
│   │   ├── error.tsx
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                      # 🏠 Home page
│   │
│   ├── actions/
│   │   ├── auth.actions.ts               # Authentication logic
│   │   ├── contact.actions.ts            # Contact form
│   │   ├── tax-slip.actions.ts           # Tax upload & queries
│   │   └── project.actions.ts            # Project date range query
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── dashboard-charts.tsx      # Recharts visualizations
│   │   │   ├── dashboard-client.tsx
│   │   │   ├── dashboard-recent-list.tsx
│   │   │   └── dashboard-stats.tsx
│   │   │
│   │   ├── track-expenditure/
│   │   │   ├── track-expenditure-client.tsx  # Main UI with date picker
│   │   │   ├── expenditure-stats.tsx    # 4 stat cards
│   │   │   └── expenditure-charts.tsx   # Bar & pie charts
│   │   │
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── navbar-client.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   ├── upload/
│   │   ├── skeletons/
│   │   └── ui/                          # ShadCn UI components
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── animations.ts
│   │   ├── utils.ts
│   │   ├── validations/
│   │   │   └── (schema definitions)
│   │   └── services/
│   │
│   ├── providers/
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces
│   │
│   └── data/
│       └── scraped-projects.ts          # Fallback project data
│
├── public/
│   └── (static assets)
│
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
│
├── ALLOW_ANONYMOUS_TAX_READ.sql         # 🔑 RLS policy for public analytics
├── FIX_RLS_POLICIES_PROJECTS.sql        # 🔑 RLS policy for projects table
├── DIAGNOSE_TAX_SLIPS.sql               # 🔧 Diagnostic queries (reference)
│
├── README.md                            # 📖 Getting started guide
├── ARCHITECTURE.md                      # 🏗️ This file
├── SETUP_SUPABASE_TABLE.sh              # 📋 Database setup script
├── SCRAPER_COMMANDS.sh                  # 🤖 Scraper commands
└── Scraper_Overview.txt                 # 📝 Scraper documentation
```

---

## 🔐 Authentication & Security

```
AUTHENTICATION FLOW:

1. User Registration/Login
   ├─ Email verification
   ├─ JWT token generation
   └─ Stored in httpOnly cookie

2. Protected Pages
   ├─ /dashboard (requires auth)
   ├─ /upload (requires auth)
   └─ /category (requires auth)

3. Public Pages
   ├─ / (home)
   ├─ /projects (government projects)
   ├─ /track-expenditure (analytics)
   ├─ /about (information)
   └─ /connect (contact form)

4. Row-Level Security (RLS)
   ├─ tax_slips table:
   │  ├─ SELECT: Anyone (aggregated data via Track Expenditure)
   │  ├─ INSERT: Only own records (auth.uid() = user_id)
   │  ├─ UPDATE: Only own records
   │  └─ DELETE: Only own records
   │
   ├─ projects table:
   │  ├─ SELECT: Public (no RLS)
   │  ├─ INSERT: Scraper only (app key)
   │  ├─ UPDATE: Scraper only
   │  └─ DELETE: Scraper only
   │
   └─ users table:
      ├─ SELECT: Own record only
      ├─ INSERT: System (registration)
      ├─ UPDATE: Own record only
      └─ DELETE: System only
```

---

## 📊 Database Schema

```
TABLES:

1. users
   ├─ id (UUID, PK)
   ├─ email (TEXT, UNIQUE)
   ├─ created_at (TIMESTAMP)
   └─ [Supabase auth extends this]

2. tax_slips
   ├─ id (UUID, PK)
   ├─ user_id (UUID, FK→users)
   ├─ amount (NUMERIC)
   ├─ date (DATE)
   ├─ category (TEXT)
   ├─ file_url (TEXT)
   ├─ created_at (TIMESTAMP)
   └─ Indexes: (user_id), (date)
   RLS Policy: Anyone can SELECT (aggregated)
              Only owner can INSERT/UPDATE/DELETE

3. projects
   ├─ id (UUID, PK)
   ├─ name (TEXT, UNIQUE)
   ├─ description (TEXT)
   ├─ status (TEXT)
   ├─ progress_percentage (INT)
   ├─ allocated_budget (BIGINT)
   ├─ spent_amount (BIGINT)
   ├─ details_url (TEXT)
   ├─ source (TEXT)
   ├─ location (TEXT)
   ├─ ministry (TEXT)
   ├─ scraped_at (TIMESTAMP)
   ├─ created_at (TIMESTAMP)
   ├─ updated_at (TIMESTAMP)
   └─ Indexes: (name), (status), (source), (scraped_at)
   RLS Policy: Public read
              Scraper write only
```

---

## 🚀 Deployment & Production

```
LOCAL DEVELOPMENT:
1. npm run dev                 → Start dev server (port 3000)
2. npm run scraper:once        → Run scraper once
3. npm run scraper:start       → Start hourly scheduler
4. Visit: http://localhost:3000

PRODUCTION DEPLOYMENT:
1. npm run build               → Create optimized build
2. npm start                   → Start production server
3. npm run scraper:start       → Start scraper in background
4. Deploy to hosting (Vercel, Railway, etc)
5. Set environment variables in deployment platform
6. Scraper runs automatically every hour
7. Data persists in Supabase (no local storage needed)

MONITORING:
├─ npm run scraper:status     → Check scheduler health
├─ View Supabase dashboard    → Monitor database
├─ Check logs                 → Debug issues
└─ Verify timestamps          → Ensure recent updates
```

---

## ✨ Key Features Summary

### Tax Upload (`/upload`)
✅ File upload with validation
✅ Amount & date input
✅ Category selection
✅ Secure storage (user_id-based)
✅ Authentication required

### Tax Dashboard (`/dashboard`)
✅ Personal tax overview
✅ Category breakdown charts
✅ Monthly trends
✅ Recent uploads list
✅ Statistics & insights
✅ Authentication required

### Projects Dashboard (`/projects`)
✅ Real-time government projects (17+)
✅ Auto-updated every 1 hour
✅ Budget & progress tracking
✅ Responsive grid layout
✅ Public access (no auth needed)
✅ Source attribution
✅ Location & ministry info

### Track Expenditure (`/track-expenditure`)
✅ Public analytics dashboard
✅ Date range filtering
✅ Tax collection statistics
✅ Government spending analysis
✅ Visual comparison (bar + pie charts)
✅ Aggregated data (no personal info)
✅ Light/dark theme support
✅ No authentication required

---

## 🔗 Related Documentation

- **README.md** - Getting started guide and quick reference
- **ALLOW_ANONYMOUS_TAX_READ.sql** - RLS policy for public tax analytics
- **FIX_RLS_POLICIES_PROJECTS.sql** - Project table permissions
- **DIAGNOSE_TAX_SLIPS.sql** - Troubleshooting queries
- **SCRAPER_COMMANDS.sh** - Scraper usage examples
- **.env.local** - Supabase credentials (keep secret!)
- **package.json** - Dependencies and npm scripts
- **next.config.ts** - Next.js configuration

---

**Last Updated**: December 24, 2025  
**Architecture Version**: 2.1.0  
**Status**: Complete & Production-Ready ✅
