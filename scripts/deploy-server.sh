#!/usr/bin/env bash
# Manual game server deploy to Cloud Run.
# Usage: ./scripts/deploy-server.sh PROJECT_ID [TAG]

set -euo pipefail

PROJECT_ID="${1:?Usage: deploy-server.sh PROJECT_ID [TAG]}"
TAG="${2:-latest}"
REGION="us-central1"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/game-server/server:${TAG}"

echo "=== Building server image ==="
gcloud builds submit \
  --project="${PROJECT_ID}" \
  --tag="${IMAGE}" \
  --timeout=600

echo "=== Deploying to Cloud Run ==="
gcloud run deploy game-server \
  --project="${PROJECT_ID}" \
  --image="${IMAGE}" \
  --platform=managed \
  --region="${REGION}" \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --timeout=3600 \
  --session-affinity \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DB_NAME=threshold,DB_USER=threshold,ASSET_BASE_URL=https://storage.googleapis.com/${PROJECT_ID}-assets" \
  --set-secrets="DB_PASSWORD=db-password:latest"

echo ""
echo "=== Deploy complete ==="
gcloud run services describe game-server \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --format="value(status.url)"
