# AutoGraph

AI-powered content platform built on Strapi CMS.

## Overview

AutoGraph helps creators and businesses generate, manage, and distribute content at scale. Built with:

- **Strapi CMS** - Headless content management
- **AI Services** - Content generation via Claude/OpenAI APIs
- **PostgreSQL** - Production database (SQLite for local dev)
- **Redis** - Caching and sessions

## Quick Start

```bash
# Install dependencies
npm install

# Build Strapi
npm run build

# Start development server
npm run dev
```

Access the admin panel at: http://localhost:1337/admin

## Project Structure

```
AutoGraph/
├── backend/           # Strapi CMS
│   ├── config/        # Strapi configuration
│   ├── src/           # Custom code, plugins
│   ├── database/      # Migrations
│   └── tests/         # Health & API tests
└── docs/              # Specifications
```

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/_health` | Health check (204) |
| `/admin` | Admin panel |
| `/api/*` | Content API (REST) |
| `/graphql` | GraphQL endpoint |

## Tech Stack

| Layer | Technology |
|-------|------------|
| CMS | Strapi 5.x |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | Claude API, OpenAI API |
| Search | Meilisearch |
| Cache | Redis |
| Frontend | Next.js (planned) |

## License

Private - PearlThoughts
