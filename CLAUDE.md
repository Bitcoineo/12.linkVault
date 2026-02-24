# Project Overview
LinkVault — personal bookmark manager. Save, tag, search, and organize URLs across collections.

# Tech Stack
- Next.js 14+ (App Router, Server Actions)
- TypeScript (strict mode)
- SQLite via Turso (libsql) + Drizzle ORM
- Tailwind CSS
- Deployed on Vercel

# Architecture
- `src/db/` → `schema.ts` is the SOURCE OF TRUTH for all tables
- `src/lib/` → business logic layer (`bookmarks.ts`, `tags.ts`, `collections.ts`, `metadata.ts`, `utils.ts`)
- `src/app/api/` → REST endpoints that call lib functions (never put DB queries in route handlers directly)
- `src/app/actions.ts` → Server Actions for form mutations (create/update/delete bookmarks, create tags)
- `src/components/` → React components (server + client)
- `cli.ts` → CLI entry point (run via `pnpm cli`), imports from `src/lib`

# UI Architecture
- **Server components**: `page.tsx`, `layout.tsx`, `sidebar.tsx`, `bookmark-card.tsx`, `bookmark-grid.tsx`
- **Client components** (`"use client"`): `search-bar.tsx`, `tag-filter.tsx`, `sidebar-link.tsx`, `bookmark-form.tsx`, `bookmark-form-dialog.tsx`, `delete-bookmark-button.tsx`
- **Filter state**: All filter state (search, tagId, collectionId) lives in URL search params. Server components read `searchParams` and call lib functions directly. Client components manipulate URL params via `useRouter().replace()`.
- **Form pattern**: `BookmarkFormDialog` wraps `BookmarkForm` in a native `<dialog>` element. The form calls Server Actions via `useTransition` for mutations.
- **Dark mode**: CSS custom properties in `globals.css` with `@media (prefers-color-scheme: dark)`. No toggle — follows system preference.
- **Keyboard shortcut**: Cmd+K (Ctrl+K on Windows/Linux) focuses search bar.

# Coding Standards
- All DB queries go through `src/lib/`, never in components or API routes directly
- Use Drizzle's SQL-like query API, not the relational query API
- Server Actions for form mutations, API routes for CLI/external access
- Error handling: always return typed responses `Result<T>`, never throw raw errors from API routes
- Names: camelCase for functions/variables, PascalCase for components, kebab-case for files

# Database Schema
- **bookmarks**: id (uuid), url (text, unique), title (text), description (text nullable), favicon_url (text nullable), created_at, updated_at
- **tags**: id (uuid), name (text, unique), color (text)
- **bookmark_tags**: bookmark_id, tag_id (composite primary key)
- **collections**: id (uuid), name (text), description (text nullable)
- **bookmark_collections**: bookmark_id, collection_id (composite primary key)

# Environment Variables
- `DATABASE_URL` — Turso database URL (e.g. `libsql://your-db.turso.io`). Falls back to `file:./local.db` for local dev.
- `DATABASE_AUTH_TOKEN` — Turso auth token. Not needed for local SQLite.
- `API_KEY` — Protects `/api/` routes. Requests must include `x-api-key` header. If unset, no protection (dev mode).
