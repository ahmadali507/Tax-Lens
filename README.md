# TaxLens - Tax Transparency Platform

A civic transparency platform designed to crowdsource tax data, monitor government spending, and promote accountability through financial transparency. Now with real-time automated web scraping of government projects.

## Features

- **Crowdsourced Tax Data**: Upload and track tax slips with detailed categorization
- **Government Project Monitoring**: Track government projects and their allocated budgets
- **Data Visualization**: Interactive dashboards comparing tax inflow vs government spending
- **Personal Tax Insights**: Monthly breakdowns of tax contributions by category
- **Dual Theme**: Light and dark mode support for optimal viewing
- **Authentication**: Secure user authentication with Supabase
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
- Run the SQL from `FIX_RLS_POLICIES.sql` to fix row-level security policies (allows scraper to insert/update data)

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
│   ├── upload/
│   └── layout.tsx
├── actions/               # Server actions
│   ├── auth.actions.ts
│   ├── contact.actions.ts
│   └── tax-slip.actions.ts
├── components/            # React components
│   ├── layout/
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

.env.local                 # Supabase credentials (secret!)
ARCHITECTURE.md            # Detailed system architecture
FIX_RLS_POLICIES.sql      # Row-level security policy fixes
```

## Pages

- **Home** (`/`): Hero section, statistics, and feature overview
- **Dashboard** (`/dashboard`): Data visualization with charts and statistics
- **Projects** (`/projects`): Government projects with real-time data from scraper
- **Categories** (`/category`): Personal tax categorization and analysis
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

## Available Commands

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
- Run the SQL from `FIX_RLS_POLICIES.sql` in Supabase SQL Editor

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
# Copy SQL from FIX_RLS_POLICIES.sql to Supabase SQL Editor
```

For more detailed troubleshooting, see ARCHITECTURE.md.

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

**Last Updated**: December 23, 2025  
**Version**: 2.0.0 with Web Scraper  
**Status**: Production Ready ✅
