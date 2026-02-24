# LinkVault

A personal bookmark manager. Save, tag, search, and organize URLs across collections.

Built with Next.js 14, TypeScript, Tailwind CSS, and SQLite (via Turso + Drizzle ORM). Includes a web UI, REST API, and CLI — all sharing the same data layer.

<!-- Screenshots: add screenshots here -->

## Features

- **Save bookmarks** with auto-fetched title and favicon
- **Tag system** with colored badges
- **Collections** to group bookmarks
- **Full-text search** across title, URL, and description
- **Dark mode** by default (follows system preference)
- **Keyboard shortcut** — Cmd+K to focus search
- **CLI tool** — add, list, and manage bookmarks from the terminal
- **REST API** — full CRUD for external integrations

## Tech Stack

- **Next.js 14** — App Router, Server Actions, Server Components
- **TypeScript** — strict mode
- **Tailwind CSS** — utility-first styling, no component libraries
- **SQLite** via [Turso](https://turso.tech) (libsql) — local file for dev, hosted for production
- **Drizzle ORM** — type-safe SQL queries and migrations

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
git clone <repo-url>
cd linkvault
pnpm install
```

### Database Setup

**Local development** (default — no configuration needed):

```bash
pnpm db:generate    # Generate migration files
pnpm db:migrate     # Run migrations (creates local.db)
pnpm db:seed        # Seed with sample data
```

**Turso (production)**:

1. Install the Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
2. Sign up: `turso auth signup`
3. Create a database: `turso db create linkvault`
4. Get the connection URL: `turso db show linkvault --url`
5. Create an auth token: `turso db tokens create linkvault`
6. Add to `.env`:

```bash
cp .env.example .env
# Edit .env with your Turso credentials
```

### Running

```bash
pnpm dev        # Start dev server at http://localhost:3000
pnpm build      # Production build
pnpm start      # Start production server
```

## CLI

The CLI shares the same data layer as the web app.

```bash
# Add a bookmark (auto-fetches title and favicon)
pnpm cli add https://example.com --tag "reference" --collection "work"

# List all bookmarks
pnpm cli list

# Search bookmarks
pnpm cli list --search "example"

# Filter by tag
pnpm cli list --tag "reference"

# List all tags with bookmark counts
pnpm cli tags
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | List bookmarks (query: `search`, `tagId`, `collectionId`, `limit`, `offset`) |
| POST | `/api/bookmarks` | Create bookmark |
| GET | `/api/bookmarks/[id]` | Get bookmark by ID |
| PUT | `/api/bookmarks/[id]` | Update bookmark |
| DELETE | `/api/bookmarks/[id]` | Delete bookmark |
| POST | `/api/bookmarks/metadata` | Fetch title + favicon for a URL |
| GET | `/api/tags` | List all tags |
| POST | `/api/tags` | Create tag |
| GET | `/api/collections` | List all collections |
| POST | `/api/collections` | Create collection |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | No | Turso database URL. Defaults to `file:./local.db` for local SQLite. |
| `DATABASE_AUTH_TOKEN` | No | Turso auth token. Not needed for local development. |

## Deployment (Vercel)

1. Push to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` — your Turso database URL
   - `DATABASE_AUTH_TOKEN` — your Turso auth token
4. Deploy

Drizzle migrations run automatically during the build step via `pnpm db:migrate`.

## Project Structure

```
src/
  app/
    page.tsx              # Dashboard (search, filter, grid)
    layout.tsx            # Root layout with sidebar
    loading.tsx           # Dashboard loading skeleton
    error.tsx             # Error boundary
    not-found.tsx         # 404 page
    actions.ts            # Server Actions (create/update/delete)
    bookmarks/[id]/       # Bookmark detail page
    api/                  # REST API routes
      bookmarks/          # GET, POST, metadata endpoint
      tags/               # GET, POST
      collections/        # GET, POST
  components/
    sidebar.tsx           # Collections navigation
    search-bar.tsx        # Debounced search with Cmd+K
    tag-filter.tsx        # Tag pill filters
    bookmark-card.tsx     # Bookmark card component
    bookmark-grid.tsx     # Responsive grid layout
    bookmark-form.tsx     # Add/edit form with metadata fetch
    bookmark-form-dialog.tsx  # Dialog wrapper
    delete-bookmark-button.tsx
  db/
    schema.ts             # Drizzle schema (source of truth)
    index.ts              # Database client
    seed.ts               # Seed script
  lib/
    bookmarks.ts          # Bookmark CRUD + queries
    tags.ts               # Tag CRUD
    collections.ts        # Collection CRUD
    metadata.ts           # URL metadata fetcher
    types.ts              # Shared types (Result<T>, entity types)
    utils.ts              # Helpers (contrast color, relative date)
cli.ts                    # CLI tool
drizzle.config.ts         # Drizzle Kit configuration
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm cli` | Run CLI tool |
