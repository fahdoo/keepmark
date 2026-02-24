

# Shiori Clone – Read-It-Later Bookmark App

A beautifully minimal bookmark/read-it-later web app with free and premium tiers, inspired by Shiori.sh.

## Landing Page
- Clean, warm-toned landing page matching Shiori's aesthetic (soft beige/cream palette, rounded UI)
- Hero section with tagline, "Get started" CTA, and an animated preview of the app inbox
- Feature grid showcasing capabilities (save links, semantic search, tidy up, color themes, etc.)
- Pricing section with Free vs Pro ($5/mo) comparison cards
- Footer with links

## Authentication
- Sign up / Log in with email & password via Supabase Auth
- Protected app routes behind authentication

## Core App (Free Tier)
- **Inbox / Archive views** – Toggle between unread and archived bookmarks
- **Add bookmark** – Paste a URL, the app saves it with auto-extracted title, favicon, and domain
- **Link enrichment** – Fetch page title and favicon automatically using metadata extraction (via edge function)
- **Search** – Basic text search across saved bookmark titles and URLs
- **Delete bookmarks** – Remove individual links

## Premium Features (Pro Tier – gated behind a flag for now)
- **AI Chat** – Chat with your saved bookmarks using Lovable AI (semantic Q&A)
- **Semantic Search** – Natural language search over bookmarks powered by AI
- **Tidy Up** – Auto-delete unread links older than 30 days
- **Color Themes** – 7 beautiful color themes users can switch between
- **HN Discussions** – Button to find Hacker News discussions for any saved link (via Algolia HN API)

## Design
- Warm, minimal aesthetic: cream/beige background, soft brown text, orange accent color
- Clean card-based UI for bookmarks showing favicon, title, domain, and save date
- Responsive design for desktop and mobile
- Smooth transitions and hover effects

## Backend (Supabase)
- **Database**: bookmarks table (url, title, favicon_url, domain, archived, created_at, user_id), user profiles
- **Edge Functions**: URL metadata extraction (fetch title/favicon from URLs), HN discussion lookup
- **RLS policies**: Users can only access their own bookmarks
- **Auth**: Email/password authentication

## What's deferred
- Payments/Stripe integration (can be added later)
- Browser extension (requires separate development)
- X Bookmark Sync, Notion Sync, YouTube Transcripts (third-party integrations)
- API access for external integrations

