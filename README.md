# PartnerHome Incident Photo Hub

A modern Enterprise SaaS dashboard for PartnerHome (Supplier login) to manage incident photos, featuring an Executive Dashboard with KPI scorecards and high-risk SKU tables, and an Incident Detail Hub with AI insights, program filters, and visual evidence galleries.

## Features

- **Executive Dashboard**: KPI scorecards showing Critical SKUs, Photos Analyzed, GIE Opportunity, and Suppliers Affected
- **High-Risk SKU Table**: Interactive table listing high-incident SKUs with program indicators, incident rates, and AI insights
- **Incident Detail Hub**: Comprehensive view of individual SKU incidents with:
  - AI Root Cause analysis with defect type tags
  - Program filtering (Customer Reported, Asia Inspection, Deluxing, X-Ray QC, etc.)
  - Visual evidence gallery with severity badges and program overlays
  - Top K image selector (Top 10, Top 20, All)
  - Share with Factory functionality
  - PDF export capability

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ofe/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Dashboard view
│   ├── detail/[sku]/      # Detail view (dynamic route)
│   └── globals.css        # Global styles
├── components/
│   ├── NavigationBar.tsx  # Sticky navigation
│   ├── dashboard/         # Dashboard components
│   ├── detail/            # Detail view components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── mockData.ts       # Mock dataset
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── package.json
```

## Design System

- **Primary Color**: Purple/Indigo (`purple-600`, `indigo-50`, `indigo-100`)
- **Background**: Slate-50 (page), White (cards)
- **Borders**: Slate-200
- **Severity Colors**: Red (Critical), Orange (High), Gray (Medium)

## Mock Data

The application uses comprehensive mock data with multiple SKUs, evidence items, and multi-program sources to demonstrate the full functionality of the platform.

