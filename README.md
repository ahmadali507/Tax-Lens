# TaxLens - Tax Transparency Platform

A civic transparency platform designed to crowdsource tax data, monitor government spending, and promote accountability through financial transparency.

## Features

- **Crowdsourced Tax Data**: Upload and track tax slips with detailed categorization
- **Government Project Monitoring**: Track government projects and their allocated budgets
- **Data Visualization**: Interactive dashboards comparing tax inflow vs government spending
- **Personal Tax Insights**: Monthly breakdowns of tax contributions by category
- **Dual Theme**: Light and dark mode support for optimal viewing
- **Authentication**: Secure user authentication with Supabase

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
- Run the SQL schema from `supabase/schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   ├── projects/
│   ├── upload/
│   └── layout.tsx
├── actions/               # Server actions
│   ├── auth.actions.ts
│   ├── contact.actions.ts
│   └── project.actions.ts
├── components/            # React components
│   ├── layout/
│   └── ui/               # ShadCn UI components
├── lib/                  # Utilities and configurations
│   ├── supabase/
│   ├── validations/
│   └── utils.ts
├── providers/            # Context providers
├── types/                # TypeScript type definitions
```

## Pages

- **Home** (`/`): Hero section, statistics, and feature overview
- **Dashboard** (`/dashboard`): Data visualization with charts and statistics
- **Projects** (`/projects`): Government projects with progress tracking
- **Categories** (`/category`): Personal tax categorization and analysis
- **About** (`/about`): Mission statement and team information
- **Connect** (`/connect`): Contact form for feedback and inquiries
- **Upload** (`/upload`): Tax slip upload with form validation
- **Login** (`/login`): User authentication
- **Register** (`/register`): New user registration

## Design Identity

- **Primary Color**: Blue - establishes trust and professionalism
- **Typography**: Modern sans-serif (Inter) for maximum readability
- **Theme**: Dual-theme system (light/dark) for versatility

## Team

- **Ahmad Ali Shahid** - Lead Developer
- **Abdul Hadi Asad** - UI/UX Designer
- **Muhammad Hassan Ali** - Project Lead

## License

This project is part of a web engineering course assignment.

## Contributing

This is an academic project. For any questions or suggestions, please use the Connect page.
