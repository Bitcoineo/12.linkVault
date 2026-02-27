# LinkVault

Personal bookmark manager with a web UI, REST API, and CLI that all share the same database. Save URLs with auto-fetched metadata, organize with tags and collections, and search across everything.

**Stack:** `Next.js 14 · TypeScript · Drizzle ORM · Turso (SQLite) · Tailwind CSS`

---

## Why I built this

Browser bookmarks are a graveyard. I wanted something with real search, tags, and collections, plus the ability to add bookmarks from the terminal without opening a browser. Building the CLI alongside the web app meant learning how to design a data layer that works across multiple interfaces.

## Features

- **Auto-metadata** Title and favicon fetched automatically on save
- **Tag system** Colored badges, filterable
- **Collections** Group bookmarks into named sets
- **Full-text search** Across title, URL, and description with Cmd+K shortcut
- **REST API** Full CRUD for external integrations
- **CLI** Add, list, search, andter bookmarks from the terminal
- **Dark mode** Follows system preference by default

## Setup

    git clone https://github.com/Bitcoineo/linkVault.git
    cd linkVault
    pnpm install

Create your .env file:

    cp .env.example .env

Run database migrations:

    pnpm db:generate
    pnpm db:migrate
    pnpm db:seed

Start the dev server:

    pnpm dev

Open http://localhost:3000

## CLI

The CLI shares the same data layer as the web app.

    pnpm cli add https://example.com --tag "reference" --collection "work"
    pnpm cli list
    pnpm cli list --search "example"
    pnpm cli list --tag "reference"
    pnpm cli tags

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookmarks | List bookmarks with search, tag, collection filters |
| POST | /api/bookmarks | Create bookmark |
| GET | /api/bookmarks/[id] | Get bookmark by ID |
| PUT | /api/bookmarks/[id] | Update bookmark |
| DELETE | /api/bookmarks/[id] | Delete bookmark |
| POST | /api/bookmarks/metadata | Fetch title and favicon for a URL |
| GET | /api/tags | List all tags |
| POST | /api/tags | Create tag |
| GET | /api/collections | List all collections |
| POST | /api/collections | Create collection |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | No | Turso database URL. Defaults to file:./local.db |
| DATABASE_AUTH_TOKEN | No | Turso auth token. Not needed for local dev |

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on Vercel
3. Add DATABASE_URL and DATABASE_AUTH_TOKEN environment variables
4. Deploy

Migrations run automatically during the build step.

## GitHub Topics

`nextjs` `typescript` `drizzle-orm` `turso` `sqlite` `tailwind` `bookmarks` `rest-api` `cli` `full-stack`
