# AutoGraph

AI-Powered Content Platform built on Strapi CMS.

## Overview

AutoGraph helps creators and businesses generate, manage, and distribute content at scale by combining Strapi CMS with AI capabilities (Claude/OpenAI).

## Quick Start

### Prerequisites

- Node.js 20+ (recommend using fnm: `fnm use 22`)
- npm or yarn

### Local Development

```bash
# Install dependencies
cd backend
npm install

# Build Strapi
npm run build

# Start development server
npm run develop
```

Strapi will be available at:
- **Admin Panel:** http://localhost:1337/admin
- **API:** http://localhost:1337/api

### First Run

1. Start the server with `npm run develop`
2. Create your first admin user at http://localhost:1337/admin
3. Configure content types in the Content-Type Builder

## Project Structure

```
AutoGraph/
├── backend/              # Strapi CMS application
│   ├── config/          # Strapi configuration
│   ├── src/
│   │   ├── api/         # Custom API routes
│   │   └── plugins/     # Custom plugins
│   └── database/        # SQLite database (dev)
├── tests/               # Integration tests
└── .github/
    └── specs/           # Product specifications
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| CMS | Strapi 5 |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | Claude API / OpenAI API |
| Search | Meilisearch (planned) |
| Cache | Redis (planned) |
| Frontend | Next.js (planned) |

## Specifications

See `.github/specs/` for detailed product specifications:

- [Product Vision](/.github/specs/001-product-vision.md)
- [Capabilities](/.github/specs/002-capabilities.md)
- [Architecture](/.github/specs/003-architecture.md)

## Development

### Running Tests

```bash
# Requires Strapi to be running
npm test
```

### Environment Variables

Copy `.env.example` to `.env` in the backend directory:

```bash
cp backend/.env.example backend/.env
```

## License

Proprietary - PearlThoughts Internship Program
