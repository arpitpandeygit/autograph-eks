# AutoGraph Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         EDGE LAYER                               │
│  ┌─────────────┐    ┌─────────────┐                             │
│  │  CloudFlare │───▶│ Load Balancer│                            │
│  │  CDN + WAF  │    │  (Traefik)   │                            │
│  └─────────────┘    └──────┬──────┘                             │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Strapi    │◀──▶│ AI Service  │◀──▶│ Meilisearch │         │
│  │   (1337)    │    │   (3001)    │    │   (7700)    │         │
│  └──────┬──────┘    └──────┬──────┘    └─────────────┘         │
└─────────┼──────────────────┼────────────────────────────────────┘
          │                  │
┌─────────┼──────────────────┼────────────────────────────────────┐
│         │     DATA LAYER   │                                     │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌─────────────┐         │
│  │ PostgreSQL  │    │    Redis    │    │  S3/MinIO   │         │
│  │  (Content)  │    │   (Cache)   │    │  (Media)    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Strapi CMS (Port 1337)

**Responsibilities:**
- Content management UI
- REST and GraphQL APIs
- User authentication
- Plugin host for AI integration

**Configuration:**
- Node.js 20+
- TypeScript
- SQLite (dev) / PostgreSQL (prod)

### AI Service (Port 3001)

**Responsibilities:**
- Content generation endpoints
- Claude/OpenAI API orchestration
- Provider failover
- Token usage tracking

**Endpoints:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/metrics` | GET | Prometheus metrics |
| `/api/generate` | POST | Generate content |

### Meilisearch (Port 7700)

**Responsibilities:**
- Content indexing
- Search API
- Faceted filtering

### Redis (Port 6379)

**Responsibilities:**
- API response caching
- Session storage
- Rate limiting counters
- Background job queue

### PostgreSQL (Port 5432)

**Responsibilities:**
- Strapi content storage
- User data
- Media metadata

## Data Flow

### Content Creation

```
1. User → Strapi Admin: "Create blog about Kubernetes"
2. Strapi → AI Service: POST /api/generate
3. AI Service → Claude API: Generate content
4. Claude API → AI Service: Generated text
5. AI Service → Strapi: Content response
6. Strapi → PostgreSQL: Save content
7. Strapi → Meilisearch: Index for search
8. Strapi → Redis: Invalidate cache
9. Strapi → User: Article created
```

### Content Retrieval

```
1. Client → Load Balancer: GET /api/articles/123
2. Load Balancer → Strapi: Route request
3. Strapi → Redis: Check cache
4. Redis → Strapi: Cache hit (fast path)
5. Strapi → Client: Article data
```

## Deployment Architecture

### Local Development

```
Docker Compose:
- strapi (Node.js)
- postgres (PostgreSQL 15)
- redis (Redis 7)
- meilisearch (Meilisearch)
```

### Production (Kubernetes)

```
Namespace: autograph
├── strapi/
│   ├── Deployment (2+ replicas)
│   ├── Service (ClusterIP)
│   ├── Ingress (HTTPS)
│   ├── HPA (auto-scaling)
│   └── Secrets
├── ai-service/
│   ├── Deployment (2+ replicas)
│   ├── Service (ClusterIP)
│   └── Secrets (API keys)
├── database/
│   ├── PostgreSQL StatefulSet
│   └── Redis Deployment
└── search/
    └── Meilisearch StatefulSet
```

## Security Architecture

### Network Policies

- Default: Deny all
- Allow: Strapi ↔ PostgreSQL
- Allow: Strapi ↔ AI Service
- Allow: Strapi ↔ Redis
- Allow: Strapi ↔ Meilisearch
- Allow: Prometheus scraping

### Secrets Management

- Kubernetes Secrets (dev)
- Sealed Secrets (GitOps)
- External Secrets Operator (prod)

### Authentication

- Strapi Admin: JWT
- API Access: API tokens
- AI Service: Internal service token
