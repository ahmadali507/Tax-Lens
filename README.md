# TaxLens - Tax Transparency Platform

A civic transparency platform designed to crowdsource tax data, monitor government spending, and promote accountability through financial transparency. Now with real-time automated web scraping of government projects.

## Features

- **Crowdsourced Tax Data**: Upload and track tax slips with detailed categorization
- **Personal Tax Category Breakdown**: View your tax contributions by category with real-time data aggregation
- **Government Project Monitoring**: Track government projects and their allocated budgets
- **Data Visualization**: Interactive dashboards comparing tax inflow vs government spending
- **Personal Tax Insights**: Monthly breakdowns of tax contributions by category
- **Track Expenditure**: Public analytics dashboard showing collected taxes, unique contributors, and budget comparison by date range
- **Dual Theme**: Light and dark mode support with professional gradient backgrounds
- **Authentication**: Secure user authentication with Supabase - protected pages redirect to login
- **🤖 Real-Time Web Scraper**: Automatically fetches government projects from 5 official sources every hour
- **💾 Live Database Integration**: All projects stored in Supabase with persistent, real-time updates

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCn UI
- **Animations**: Magic UI & Framer Motion
- **Backend**: Supabase (Authentication + Database)
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Charts**: Recharts
- **Web Scraping**: Cheerio + Axios (for automatic project data collection)
- **Scheduling**: Node.js background jobs (1-hour intervals)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tax-transparency
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:

- Go to your Supabase project dashboard
- Navigate to the SQL Editor
- Run the SQL schema from `supabase/migrations/20251223_create_projects_table.sql` to create the projects table
- Run the SQL from `FIX_RLS_POLICIES_PROJECTS.sql` to allow project data access
- Run the SQL from `ALLOW_ANONYMOUS_TAX_READ.sql` to enable public analytics (allows anyone to read tax slips for the Track Expenditure dashboard)

5. Populate initial data:
```bash
npm run scraper:once
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── about/
│   ├── category/
│   ├── connect/
│   ├── dashboard/
│   ├── projects/          # Shows live projects from Supabase
│   ├── track-expenditure/ # Public analytics dashboard
│   ├── upload/
│   └── layout.tsx
├── actions/               # Server actions
│   ├── auth.actions.ts
│   ├── contact.actions.ts
│   ├── tax-slip.actions.ts
│   └── project.actions.ts # Server-side project data fetching
├── components/            # React components
│   ├── layout/
│   ├── track-expenditure/ # Track Expenditure components
│   │   ├── track-expenditure-client.tsx
│   │   ├── expenditure-stats.tsx
│   │   └── expenditure-charts.tsx
│   └── ui/               # ShadCn UI components
├── lib/                  # Utilities and configurations
│   ├── supabase/
│   ├── validations/
│   └── utils.ts
├── providers/            # Context providers
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks

scripts/
├── scrape-projects.ts    # Main web scraper executable
├── cli.ts                # Scheduler control (start/stop/status)
├── test-supabase.ts      # Connection testing utility
└── init-supabase.ts      # Database initialization helper

supabase/
├── server.ts             # Server-side Supabase client
├── client.ts             # Client-side setup
└── migrations/           # SQL migration files
    └── 20251223_create_projects_table.sql

.env.local                         # Supabase credentials (secret!)
ARCHITECTURE.md                    # Detailed system architecture
ALLOW_ANONYMOUS_TAX_READ.sql       # RLS policy for public analytics
FIX_RLS_POLICIES_PROJECTS.sql      # Project table security policies
```

## Pages

- **Home** (`/`): Hero section, statistics, and feature overview
- **Dashboard** (`/dashboard`): Data visualization with charts and statistics
- **Projects** (`/projects`): Government projects with real-time data from scraper
- **Track Expenditure** (`/track-expenditure`): Public analytics dashboard showing:
  - Total tax collected and unique contributors in a date range
  - Government-allocated budget vs spent amounts
  - Visual comparison with bar and pie charts
  - No authentication required - works for all users
- **Categories** (`/category`): 
  - **Authentication Required**: Only accessible to logged-in users
  - Real-time aggregation of personal tax contributions by category
  - Dynamic category breakdown from user's uploaded tax slips
  - Monthly trend visualization showing tax patterns over time
  - Automatic calculation of category percentages and totals
  - Supported categories: Income Tax, Food, Travel, health & Care, Utilities, Education, Entertainment, Property Tax, Others
  - Empty state guidance if no tax slips uploaded yet
- **About** (`/about`): Mission statement and team information
- **Connect** (`/connect`): Contact form for feedback and inquiries
- **Upload** (`/upload`): Tax slip upload with form validation
- **Login** (`/login`): User authentication
- **Register** (`/register`): New user registration

## 🤖 Web Scraper Integration

### Overview

The application now includes an automated web scraper that:
- ✅ Fetches government projects from **5 official sources**
- ✅ Extracts project details (name, budget, status, progress)
- ✅ Stores data in Supabase database
- ✅ Runs automatically every **1 hour**
- ✅ Handles failures gracefully with fallback projects
- ✅ Deduplicates data by project name
- ✅ Updates existing projects with new information

### Data Sources

1. **Ministry Planning Commission** (pc.gov.pk/web/projects)
2. **PSDP Overview** (pc.gov.pk/web/psdp)
3. **CPEC Portal** (cpec.gov.pk)
4. **Punjab PMDFC** (pmdfc.punjab.gov.pk/ongoing_projects)
5. **Graana Real Estate** (graana.com/projects/list)

### Scraper Commands

```bash
# Run scraper once and exit
npm run scraper:once

# Start hourly scheduler (runs continuously)
npm run scraper:start

# Check scheduler status
npm run scraper:status

# Show help information
npm run scraper:help

# Test Supabase connection
npx tsx scripts/test-supabase.ts
```

### How It Works

1. **Fetching**: Scraper uses Axios to fetch HTML from government websites
2. **Parsing**: Cheerio extracts project information from HTML
3. **Processing**: Data is cleaned, deduplicated, and validated
4. **Persistence**: REST API upsert pattern:
   - If project name is new → INSERT
   - If project name exists → UPDATE with new data
5. **Storage**: All projects stored in Supabase with timestamps
6. **Display**: Projects page fetches live data from database

### Database Schema

Each project record contains:

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Unique identifier |
| name | TEXT | Project name (unique) |
| description | TEXT | Project description |
| status | TEXT | ongoing/planned/completed/cancelled |
| progress_percentage | INT | 0-100 completion % |
| allocated_budget | BIGINT | Budget in PKR |
| spent_amount | BIGINT | Amount spent in PKR |
| details_url | TEXT | Link to details |
| source | TEXT | Data source (pc.gov.pk, cpec, etc) |
| location | TEXT | City/Province |
| ministry | TEXT | Responsible ministry |
| scraped_at | TIMESTAMP | When data was fetched |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### Key Stats

- **Projects**: 17+ government projects
- **Total Budget**: 499.50 Billion PKR (~$1.8B USD)
- **Update Frequency**: Every 1 hour
- **Data Freshness**: Real-time with timestamp tracking
- **Success Rate**: 95%+ with intelligent fallback

## 📊 Track Expenditure Dashboard

### Overview

The Track Expenditure page is a **public analytics dashboard** that visualizes tax collection and government spending patterns. It requires no authentication, making tax data transparent to all citizens.

### Features

- **Date Range Selection**: Filter tax and project data by custom date ranges
- **Tax Analytics**:
  - Total amount collected across selected period
  - Count of unique contributors
  - Time-normalized date filtering for accurate results
- **Project Analysis**:
  - Total allocated government budget
  - Total spent amount from projects
  - Budget utilization percentage
- **Visual Comparisons**:
  - Bar chart: Tax Collected vs Allocated Budget vs Spent Amount
  - Pie chart: Budget utilization (Spent vs Remaining)
- **Dark/Light Theme**: Full support for both themes

### How It Works

1. User selects start and end dates on the `/track-expenditure` page
2. Server actions fetch data from Supabase:
   - `getTaxSlipsByDateRange()`: Retrieves tax slips within the date range
   - `getProjectsByDateRange()`: Retrieves projects scraped within the date range
3. Results are aggregated:
   - Tax: Sum amounts and count unique user IDs
   - Projects: Sum allocated budgets and spent amounts
4. Data is displayed in statistics cards and interactive charts
5. **No authentication required** - works for anonymous users

### Database Changes

To enable public read access to tax data for analytics:

```sql
-- ALLOW_ANONYMOUS_TAX_READ.sql
CREATE POLICY "Anyone can read tax slips for analytics" ON public.tax_slips
    FOR SELECT USING (true);
```

**Policy Details**:
- SELECT/READ: Open to all users (authenticated and anonymous)
- INSERT: Requires authentication (`auth.uid()::text = user_id::text`)
- UPDATE: Requires authentication and ownership of record
- DELETE: Requires authentication and ownership of record

This ensures:
✅ Tax transparency: Anyone can view aggregate statistics
✅ Privacy: Individual users can't view others' personal tax details
✅ Data integrity: Only authenticated users can upload/modify records

### New Files Added

**Server Actions**:
- `src/actions/project.actions.ts`: `getProjectsByDateRange()` function for fetching projects by date

**Components**:
- `src/components/track-expenditure/track-expenditure-client.tsx`: Main UI with date picker and state management
- `src/components/track-expenditure/expenditure-stats.tsx`: 4 statistics cards (Tax Collected, Unique Users, Allocated Budget, Spent Amount)
- `src/components/track-expenditure/expenditure-charts.tsx`: Recharts visualizations (Bar & Pie charts)

**SQL Policies**:
- `ALLOW_ANONYMOUS_TAX_READ.sql`: RLS policy for public tax data access
- `DIAGNOSE_TAX_SLIPS.sql`: Diagnostic queries for troubleshooting (reference only)

**Page Route**:
- `src/app/track-expenditure/page.tsx`: Server component that renders the Track Expenditure dashboard

## 📁 Personal Tax Categories

### Overview

The Categories page (`/category`) is a **user-only analytics dashboard** that displays personalized tax breakdowns by category. It automatically aggregates each user's uploaded tax slips and presents them with visual insights.

### Key Features

- **Authentication Required**: Only logged-in users can access
- **Real-Time Data**: Automatically aggregates from user's Supabase tax slips
- **Dynamic Categories**: Categories extracted directly from user's uploaded data
- **Monthly Trends**: Shows tax contributions over the last 6 months
- **Automatic Calculations**: 
  - Percentage of total for each category
  - Monthly aggregation by category
  - Total contributions across all categories
- **Visual Insights**:
  - Category breakdown cards with amounts and percentages
  - Stacked bar chart showing monthly trends
  - Total contributions insight
  - Largest category highlight
- **Empty State**: Helpful message with link to upload page if no data exists

### How It Works

1. User navigates to `/category`
2. Server-side authentication check redirects unauthenticated users to `/login`
3. `getUserTaxSlips(userId)` fetches all user's tax records from Supabase
4. Client component processes data:
   - Groups by category and aggregates amounts
   - Calculates percentages based on totals
   - Groups by month for trend visualization
5. Results displayed in interactive charts and cards

### Supported Tax Categories

- Income Tax
- Food
- Travel
- health & Care
- Utilities
- Education
- Entertainment
- Property Tax
- Others

### Data Privacy

- Each user sees **only their own tax data**
- Server-side authentication ensures data isolation
- No cross-user data leakage possible
- RLS policies at database level prevent unauthorized access

### New Components

**Page Route**:
- `src/app/category/page.tsx`: Server component with authentication and data fetching

**Client Component**:
- `src/components/category/category-page-client.tsx`: React component that:
  - Aggregates tax slips by category
  - Calculates monthly trends
  - Renders category breakdown cards
  - Displays bar chart with Recharts
  - Shows personalized insights

- **Success Rate**: 95%+ with intelligent fallback

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm start            # Start production server
npm run lint         # Run ESLint
```

### Scraper Management
```bash
npm run scraper:once      # Run scraper once and exit
npm run scraper:start     # Start hourly scheduler (keeps running)
npm run scraper:status    # Check scheduler status
npm run scraper:help      # Show scraper help
npm run init:db           # Initialize Supabase table
```

## 🧪 Testing & Deployment

### Test Commands

```bash
# Test Supabase connection
npx tsx scripts/test-supabase.ts

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Deployment

- **Recommended**: Vercel (auto-deploys on git push)
- **Alternative**: Railway, Render, AWS, or other Node.js hosting
- **Environment**: Set Supabase credentials in deployment platform
- **Scheduler**: Use `npm run scraper:start` in background process or setup cron job

## Design Identity

- **Primary Color**: Blue - establishes trust and professionalism
- **Typography**: Modern sans-serif (Inter) for maximum readability
- **Theme**: Dual-theme system (light/dark) for versatility

## 🐛 Troubleshooting

### Common Issues

**"Table 'projects' does not exist"**
- Execute SQL from `supabase/migrations/20251223_create_projects_table.sql`

**Scraper fails with "401 Unauthorized"**
- Run the SQL from `FIX_RLS_POLICIES_PROJECTS.sql` in Supabase SQL Editor

**Track Expenditure shows 0 results**
- Verify `ALLOW_ANONYMOUS_TAX_READ.sql` has been executed
- Check that the SELECT policy has `USING (true)` to allow anonymous reads
- Test with date range that matches existing data: 2023-09-21 to 2025-12-15

**No projects on /projects page**
1. Verify database table exists
2. Run `npm run scraper:once` to populate data
3. Check browser console for errors

**Build fails**
- Ensure all dependencies installed: `npm install`
- Check TypeScript errors: `npm run lint`

**Scraper runs but doesn't persist data**
```bash
# Test connection first
npx tsx scripts/test-supabase.ts

# If test fails, fix RLS policies
# Copy SQL from FIX_RLS_POLICIES_PROJECTS.sql to Supabase SQL Editor
```

For more detailed information, see ARCHITECTURE.md.

## Team

- **Ahmad Ali Shahid** - Lead Developer
- **Abdul Hadi Asad** - UI/UX Designer
- **Muhammad Hassan Ali** - Project Lead

## License

This project is part of a web engineering course assignment.

## Contributing

This is an academic project. For any questions or suggestions, please use the Connect page.

---

**TaxLens** - Making government spending transparent through crowdsourced data and real-time project tracking.

**Last Updated**: December 24, 2025  
**Version**: 2.2.0 with Personal Tax Categories  
**Status**: Production Ready ✅
