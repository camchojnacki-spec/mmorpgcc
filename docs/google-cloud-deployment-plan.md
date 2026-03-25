# Google Cloud Deployment Plan

## Architecture Overview

```
                    ┌─────────────────────────────────┐
                    │      Cloud Load Balancer         │
                    │   (HTTPS + WebSocket upgrade)    │
                    └──────┬──────────────┬────────────┘
                           │              │
                    ┌──────▼──────┐ ┌─────▼──────────┐
                    │  Cloud CDN  │ │  Cloud Run /    │
                    │  (Client)   │ │  GKE (Server)   │
                    │  Static SPA │ │  Colyseus +     │
                    │             │ │  Express API    │
                    └─────────────┘ └──────┬──────────┘
                                           │
                           ┌───────────────┼───────────────┐
                           │               │               │
                    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
                    │  Cloud SQL  │ │ Memorystore │ │   Cloud     │
                    │ PostgreSQL  │ │   (Redis)   │ │  Storage    │
                    │  16+        │ │  Sessions   │ │  (Assets)   │
                    └─────────────┘ └─────────────┘ └─────────────┘
```

## Services & Estimated Monthly Cost (Small Scale, ~10-20 players)

| Service | Purpose | Spec | Est. Cost/mo |
|---------|---------|------|-------------|
| Cloud Run | Game server (Colyseus + API) | 2 vCPU, 4GB RAM, min 1 instance | ~$30-50 |
| Cloud SQL | PostgreSQL database | db-f1-micro (shared core, 614MB) | ~$10 |
| Memorystore | Redis for sessions/matchmaking | Basic tier, 1GB | ~$35 |
| Cloud Storage | Sprite sheets, audio, YAML content | Standard, <10GB | ~$1 |
| Cloud CDN + LB | Static client hosting + WS routing | Minimal traffic | ~$20 |
| Artifact Registry | Docker images | <5GB | ~$1 |
| **Total** | | | **~$97-117/mo** |

### Cost Reduction Options
- **Option A: Single VM instead** — e2-standard-2 ($49/mo) runs everything. Simpler but no auto-scaling. Best for friends-only phase.
- **Option B: Cloud Run only** — Skip Memorystore, use in-memory Redis on the same container. Cheapest but loses session persistence on restart.

## Recommended Approach: Phased

### Phase 1: Single VM (Now → Friends Testing)
Simplest, cheapest, gets you running fast.

```
1x Compute Engine VM (e2-standard-2: 2 vCPU, 8GB RAM)
  ├── Docker Compose (same as local dev)
  │   ├── game-server container (Colyseus + Express)
  │   ├── postgres container
  │   └── redis container
  ├── Nginx reverse proxy (HTTPS + WSS)
  └── Cloud Storage bucket (assets served via CDN)
```

**Cost: ~$49/mo + domain + storage**

### Phase 2: Managed Services (When scaling past ~20 concurrent)
Migrate DB and Redis to managed services, server to Cloud Run.

### Phase 3: Multi-Instance (If scaling past ~100 concurrent)
Multiple Cloud Run instances with Colyseus presence service on Redis.

---

## Phase 1 Setup Steps

### 1. Project Setup
```bash
# Create GCP project
gcloud projects create mmorpg-threshold --name="MMORPG"
gcloud config set project mmorpg-threshold

# Enable required APIs
gcloud services enable compute.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable storage.googleapis.com
```

### 2. Create VM
```bash
gcloud compute instances create game-server \
  --zone=us-central1-a \
  --machine-type=e2-standard-2 \
  --image-family=ubuntu-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB \
  --tags=game-server

# Firewall rules
gcloud compute firewall-rules create allow-game \
  --allow tcp:80,tcp:443,tcp:2567 \
  --target-tags=game-server
```

### 3. Asset Storage
```bash
# Create bucket for sprites, audio, content JSON
gsutil mb -l us-central1 gs://mmorpg-assets/

# Enable CDN on the bucket
gcloud compute backend-buckets create assets-backend \
  --gcs-bucket-name=mmorpg-assets \
  --enable-cdn
```

### 4. Docker Setup on VM
```bash
# SSH into VM
gcloud compute ssh game-server --zone=us-central1-a

# Install Docker + Docker Compose
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER

# Clone repo
git clone https://github.com/camchojnacki-spec/mmorpgcc.git
cd mmorpgcc

# Build and run
docker compose -f docker/docker-compose.yml up -d
```

### 5. Nginx + SSL (on the VM)
```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Configure nginx for WebSocket proxy + static client
# (We will generate the nginx.conf as part of the deployment scripts)
```

### 6. CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
# On push to main:
#   1. Build client (vite build)
#   2. Upload client to Cloud Storage
#   3. Build server Docker image
#   4. Push to Artifact Registry
#   5. SSH into VM, pull new image, restart
```

---

## Files We Need to Create

| File | Purpose | Sprint |
|------|---------|--------|
| `docker/Dockerfile.server` | Production server container | Next |
| `docker/Dockerfile.client` | Client build → nginx static | Next |
| `docker/nginx.conf` | Reverse proxy + WebSocket | Next |
| `docker/docker-compose.prod.yml` | Production compose file | Next |
| `.github/workflows/deploy.yml` | CI/CD pipeline | Next |
| `scripts/deploy.sh` | Manual deployment script | Next |

---

## Domain & SSL

You'll need:
- A domain name (or subdomain)
- Let's Encrypt SSL certificate (free, auto-renewed via certbot)
- DNS A record pointing to the VM's external IP

---

## Decision Needed from You

**Which Phase 1 approach do you want?**

| Option | Monthly Cost | Complexity | Best For |
|--------|-------------|------------|----------|
| **A: Single VM** | ~$49 | Low | Friends-only, fast setup |
| **B: Cloud Run + Cloud SQL** | ~$80 | Medium | Auto-scaling from day 1 |
| **C: Local dev only for now** | $0 | None | Keep building, deploy later |

My recommendation: **Option A (Single VM)** — gets you and friends playing fastest, easy to migrate to Cloud Run later when needed.
