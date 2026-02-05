# AutoGraph Target Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USERS                                          │
│   Content Creators    │    Developers    │    Business Users            │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                         EDGE LAYER                                       │
│   ┌─────────────────┐    ┌─────────────────┐                            │
│   │  CloudFlare CDN │────│  Load Balancer  │                            │
│   │  + DDoS Protect │    │                 │                            │
│   └─────────────────┘    └─────────────────┘                            │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                      APPLICATION LAYER                                   │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │
│   │   Strapi CMS    │────│   AI Service    │────│   Meilisearch   │    │
│   │   (Port 1337)   │    │   (Port 3001)   │    │   (Port 7700)   │    │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘    │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                         DATA LAYER                                       │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │
│   │   PostgreSQL    │    │     Redis       │    │   S3/MinIO      │    │
│   │   (Content)     │    │   (Cache)       │    │   (Media)       │    │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Strapi CMS (Port 1337)

| Component | Description |
|-----------|-------------|
| Admin Panel | Visual content management UI |
| REST API | `/api/*` endpoints |
| GraphQL API | `/graphql` endpoint (optional) |
| AI Plugins | Custom plugins for AI integration |

### AI Service (Port 3001)

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /metrics` | Prometheus metrics |
| `POST /api/generate` | Content generation |

### Data Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Creator  │────▶│   Strapi   │────▶│ AI Service │
│            │     │            │     │            │
└────────────┘     └─────┬──────┘     └─────┬──────┘
                         │                   │
                         ▼                   ▼
                  ┌────────────┐      ┌────────────┐
                  │ PostgreSQL │      │ Claude API │
                  └────────────┘      └────────────┘
```

## Local Development Setup

### Services

| Service | Port | Database |
|---------|------|----------|
| Strapi | 1337 | SQLite (dev) |
| AI Service | 3001 | N/A |
| Meilisearch | 7700 | File-based |

### Environment Variables

```bash
# Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=generated-keys
API_TOKEN_SALT=generated-salt
ADMIN_JWT_SECRET=generated-secret
JWT_SECRET=generated-secret

# AI Service
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
PRIMARY_PROVIDER=claude
FALLBACK_PROVIDER=openai
```

## Production Architecture (Kubernetes)

### Namespace Layout

```
autograph/
├── strapi/
│   ├── deployment.yaml      # 2+ replicas
│   ├── service.yaml         # ClusterIP
│   ├── ingress.yaml         # HTTPS endpoint
│   ├── configmap.yaml       # Configuration
│   ├── secret.yaml          # Credentials
│   └── hpa.yaml             # Auto-scaling
│
├── ai-service/
│   ├── deployment.yaml      # 2+ replicas
│   ├── service.yaml         # Internal
│   └── secret.yaml          # API keys
│
├── database/
│   ├── postgresql/          # StatefulSet
│   └── redis/               # Deployment
│
└── search/
    └── meilisearch/         # StatefulSet
```

### Scaling Limits

| Component | Min | Max | Scale On |
|-----------|-----|-----|----------|
| **Strapi** | 2 | 10 | CPU, Memory |
| **AI Service** | 2 | 5 | Queue depth |
| **Meilisearch** | 1 | 1 | Vertical only |
| **PostgreSQL** | 1 | 1 | Vertical only |
| **Redis** | 1 | 1 | Vertical only |

## Security Architecture

### Layers

1. **Edge:** CloudFlare WAF, DDoS protection, rate limiting
2. **Ingress:** TLS termination, auth headers
3. **Network:** Kubernetes network policies (default deny)
4. **Application:** JWT authentication, RBAC
5. **Secrets:** Sealed Secrets for GitOps

### Network Policies

- Default: Deny all ingress/egress
- Allow: Strapi ↔ PostgreSQL
- Allow: Strapi ↔ AI Service
- Allow: Strapi ↔ Redis
- Allow: Prometheus scraping

## Cost Architecture

### Local Development

| Item | Cost |
|------|------|
| Infrastructure | $0 (local) |
| Claude API (dev) | ~$5-20/month |
| Total | ~$5-20/month |

### Production (Hetzner)

| Item | Monthly Cost |
|------|--------------|
| 3x Server (CX31) | €30 |
| 3x Agent (CX41) | €60 |
| Load Balancer | €6 |
| Storage (100GB) | €5 |
| **Total Infrastructure** | **€101/month** |
| Claude API | ~$200 |
| OpenAI API (fallback) | ~$50 |
| **Total** | **~$360/month** |

## References

- Source: `/Users/SenG/Projects/PearlThoughts-Org/HR/Internship/Internship-Obsidian-Vault/DevOps/01-Product/04-Target-Architecture.md`
