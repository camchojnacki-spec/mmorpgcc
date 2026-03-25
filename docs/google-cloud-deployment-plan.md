# Google Cloud Deployment Plan — Fully Managed Stack

## Architecture

```
                         ┌──────────────────────┐
                         │    Firebase Hosting   │
                         │  (Client SPA + Admin) │
                         │  Global CDN, auto-SSL │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │    Firebase Auth      │
                         │  (Login, sessions,    │
                         │   JWT verification)   │
                         └──────────┬───────────┘
                                    │ JWT token
                         ┌──────────▼───────────┐
                         │     Cloud Run         │
                         │  (Game Server)        │
                         │  Colyseus + REST API  │
                         │  Auto-scales 0→N      │
                         │  WebSocket support    │
                         └───┬──────┬───────┬───┘
                             │      │       │
                    ┌────────▼┐ ┌───▼────┐ ┌▼────────────┐
                    │Cloud SQL│ │Memory- │ │Cloud Storage │
                    │Postgres │ │store   │ │+ CDN         │
                    │  16     │ │(Redis) │ │(Game Assets) │
                    └─────────┘ └────────┘ └─────────────┘
```

## Service Map

| Layer | Service | What It Does | You Manage |
|-------|---------|-------------|------------|
| **Auth** | Firebase Auth | Login, signup, JWT tokens, OAuth | Nothing — SaaS |
| **Client** | Firebase Hosting | Serves the Phaser game client | Nothing — deploy via CLI |
| **Admin** | Firebase Hosting | Serves the admin portal (separate site) | Nothing — same as client |
| **Game Server** | Cloud Run | Colyseus rooms, REST API, combat logic | Just the code — Google runs it |
| **Database** | Cloud SQL (PostgreSQL 16) | Character data, inventory, quests, guilds | Nothing — managed backups, patching |
| **Sessions** | Memorystore (Redis) | WebSocket session mapping, matchmaking | Nothing — managed |
| **Assets** | Cloud Storage + CDN | Spritesheets, audio, content JSON | Upload files, Google serves them |
| **CI/CD** | GitHub Actions | Build + deploy on push to main | Workflow file in repo |
| **Secrets** | Secret Manager | DB passwords, API keys | Set once via console |
| **Monitoring** | Cloud Logging + Error Reporting | Server logs, crash reports | Automatic |

**What you never touch:** VMs, Docker hosts, OS patches, SSL certificates, load balancers, nginx configs, disk management.

**What I maintain in code:** Dockerfile (for Cloud Run build), firebase.json (hosting config), GitHub Actions workflow, environment variable references.

## Estimated Monthly Cost (Friends Scale, ~5-20 players)

| Service | Spec | Est. Cost/mo |
|---------|------|-------------|
| Cloud Run | 1 vCPU, 2GB RAM, min 0 instances | ~$5-15 (scales to zero when idle) |
| Cloud SQL | db-f1-micro, 10GB SSD | ~$8 |
| Memorystore | Basic tier, 1GB | ~$35 |
| Cloud Storage | <5GB, standard | ~$0.50 |
| Firebase Hosting | Free tier (10GB transfer) | $0 |
| Firebase Auth | Free tier (50K MAU) | $0 |
| Artifact Registry | <2GB images | ~$0.50 |
| Secret Manager | <5 secrets | $0 |
| **Total** | | **~$49-59/mo** |

### Cost Notes
- Cloud Run scales to zero when nobody is playing — you don't pay for idle
- Memorystore is the biggest fixed cost. Alternative: use Cloud Run's in-process Redis (free, loses state on restart — fine for dev/friends phase, reconnect logic handles it)
- **Without Memorystore: ~$14-24/mo**
- Firebase free tiers are generous — you won't exceed them at this scale

## WebSocket Handling on Cloud Run

Cloud Run supports WebSockets with a configurable request timeout (up to 60 minutes). Our strategy:

1. **Session timeout set to 3600s** (60 min) on Cloud Run
2. **Transparent reconnection** built into the client NetworkManager — if the WebSocket drops, it reconnects and re-syncs state automatically
3. **Server-side session recovery** via Redis — player state persists across reconnections within a grace window (30s default, configurable)
4. **Heartbeat ping** every 15s keeps connections alive and detects drops early

For typical play sessions (dungeon runs are 15-45 min), the 60-min limit is never hit. For town AFKing, the reconnect is seamless.

## Project Structure for Deployment

```
mmorpgcc/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: build → deploy on push
├── docker/
│   └── Dockerfile.server           # Cloud Run build (multi-stage)
├── firebase.json                   # Hosting config (client + admin)
├── .firebaserc                     # Project alias
├── packages/
│   ├── client/        → Firebase Hosting (built with Vite)
│   ├── server/        → Cloud Run (built with Docker)
│   ├── admin/         → Firebase Hosting (built with Vite)
│   ├── shared/        → Compiled into both client and server
│   └── content-pipeline/  → Runs at build time, output → Cloud Storage
└── scripts/
    ├── setup-gcp.sh                # One-time GCP project setup
    ├── deploy-server.sh            # Manual server deploy
    ├── deploy-client.sh            # Manual client deploy
    └── upload-assets.sh            # Push assets to Cloud Storage
```

## Setup Steps (One-Time)

### 1. GCP Project + Firebase

```bash
# Create project
gcloud projects create YOUR_PROJECT_ID --name="MMORPG"
gcloud config set project YOUR_PROJECT_ID

# Enable billing (required for Cloud SQL, Memorystore, Cloud Run)
# → Do this in the GCP Console: https://console.cloud.google.com/billing

# Enable APIs
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com

# Initialize Firebase (links to GCP project)
npm install -g firebase-tools
firebase login
firebase init hosting  # → select your GCP project
```

### 2. Cloud SQL (PostgreSQL)

```bash
# Create instance
gcloud sql instances create mmorpg-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=10GB \
  --storage-auto-increase

# Create database and user
gcloud sql databases create threshold --instance=mmorpg-db
gcloud sql users create threshold \
  --instance=mmorpg-db \
  --password=GENERATE_A_REAL_PASSWORD

# Store password in Secret Manager
echo -n "YOUR_PASSWORD" | gcloud secrets create db-password \
  --data-file=- --replication-policy=automatic
```

### 3. Memorystore (Redis) — Optional for Friends Phase

```bash
gcloud redis instances create mmorpg-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=basic
```

### 4. Cloud Storage (Assets)

```bash
gsutil mb -l us-central1 gs://YOUR_PROJECT_ID-assets/
gsutil iam ch allUsers:objectViewer gs://YOUR_PROJECT_ID-assets/

# Enable CDN (optional, helps with global latency)
# Done through Cloud CDN console or gcloud commands
```

### 5. Artifact Registry (Docker Images)

```bash
gcloud artifacts repositories create game-server \
  --repository-format=docker \
  --location=us-central1
```

### 6. Cloud Run (Game Server)

```bash
# First deploy (after Docker image is pushed)
gcloud run deploy game-server \
  --image=us-central1-docker.pkg.dev/YOUR_PROJECT/game-server/server:latest \
  --platform=managed \
  --region=us-central1 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --timeout=3600 \
  --session-affinity \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="DB_PASSWORD=db-password:latest"
```

## CI/CD Pipeline (GitHub Actions)

Triggers on push to `main`. Builds and deploys everything automatically.

```yaml
# .github/workflows/deploy.yml
name: Deploy to Google Cloud

on:
  push:
    branches: [main]

env:
  PROJECT_ID: YOUR_PROJECT_ID
  REGION: us-central1
  REPO: game-server

jobs:
  deploy-server:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SA }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Build and push Docker image
        run: |
          gcloud builds submit \
            --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/server:$GITHUB_SHA

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy game-server \
            --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/server:$GITHUB_SHA \
            --region=$REGION \
            --timeout=3600 \
            --session-affinity

  deploy-client:
    runs-on: ubuntu-latest
    steps:
      - uses: checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build:content
      - run: npm run build --workspace=packages/client

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SA }}
          channelId: live

  upload-assets:
    runs-on: ubuntu-latest
    steps:
      - uses: checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SA }}
      - name: Sync assets to Cloud Storage
        run: gsutil -m rsync -r assets/ gs://$PROJECT_ID-assets/
```

## Environment Variables (Cloud Run)

| Variable | Source | Value |
|----------|--------|-------|
| `NODE_ENV` | Set directly | `production` |
| `PORT` | Cloud Run auto-sets | `8080` |
| `DB_HOST` | Cloud SQL connection | `/cloudsql/PROJECT:REGION:mmorpg-db` |
| `DB_NAME` | Set directly | `threshold` |
| `DB_USER` | Set directly | `threshold` |
| `DB_PASSWORD` | Secret Manager | `db-password:latest` |
| `REDIS_URL` | Memorystore IP | `redis://10.x.x.x:6379` |
| `ASSET_BASE_URL` | Cloud Storage | `https://storage.googleapis.com/PROJECT-assets` |
| `FIREBASE_PROJECT_ID` | Set directly | Your project ID |

## Local Development (Unchanged)

Docker Compose still works for local dev:

```bash
docker compose -f docker/docker-compose.yml up -d  # PostgreSQL + Redis
npm run dev:server   # Colyseus on :2567
npm run dev:client   # Phaser on :3000
npm run dev:admin    # Admin on :3001
```

The only difference between local and production is environment variables. Same code runs everywhere.

## Migration Path to GKE Autopilot (If Needed Later)

If you outgrow Cloud Run (need >60-min sessions without reconnect, or >100 concurrent players per instance), the migration is:

1. Create GKE Autopilot cluster (~5 min)
2. Deploy the same Docker image as a Kubernetes Deployment
3. Add Agones GameServer CRD for room-level scaling
4. Point DNS to the GKE ingress

Same container, same code, same environment variables. Just a different orchestrator.
