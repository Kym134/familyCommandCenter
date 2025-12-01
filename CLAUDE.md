# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Family Command Center is an offline-first Progressive Web App (PWA) for family organization. It provides shared calendars, tasks, and shopping lists for household management.

## Commands

```bash
npm run dev       # Start Vite dev server (includes PWA in dev mode)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint for src/**/*.{ts,tsx}
npm run preview   # Preview production build
npm run generate:icons  # Generate PWA icons from source logo
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** for styling
- **Supabase** for backend (auth, database, realtime)
- **vite-plugin-pwa** with Workbox for offline support

## Architecture

### PWA & Offline Strategy
The app uses Workbox with three caching strategies configured in `vite.config.ts`:
- **NetworkFirst** for Supabase API calls (24hr cache fallback)
- **CacheFirst** for images (30 day cache)
- **StaleWhileRevalidate** for daily data endpoints

The `usePWA` hook (`src/hooks/usePWA.ts`) manages install prompts, offline detection, and service worker updates.

### Supabase Integration
- Client initialized in `src/lib/supabase.ts`
- Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
- Database types defined in `src/types/database.types.ts`

### Data Models
- **Family** - household unit containing members
- **User** - family member with role (adult/child), colors, avatar
- **ShoppingItem** - shopping list items with status tracking
- **Category** - item categorization with store sections

### Deployment
- Configured for GitHub Pages deployment (base path adjusts via `GITHUB_ACTIONS` env var)
- PWA manifest in `public/manifest.json`
