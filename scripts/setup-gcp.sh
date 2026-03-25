#!/usr/bin/env bash
# One-time GCP project setup for the fully-managed MMORPG stack.
# Run this once after creating your GCP project.
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - Billing enabled on the project
#   - Firebase CLI installed (npm install -g firebase-tools)
#
# Usage: ./scripts/setup-gcp.sh YOUR_PROJECT_ID

set -euo pipefail

PROJECT_ID="${1:?Usage: setup-gcp.sh PROJECT_ID}"
REGION="us-central1"
DB_INSTANCE="mmorpg-db"
DB_NAME="threshold"
DB_USER="threshold"
REDIS_INSTANCE="mmorpg-redis"
ASSET_BUCKET="${PROJECT_ID}-assets"

echo "=== Setting up GCP project: ${PROJECT_ID} ==="

gcloud config set project "${PROJECT_ID}"

echo "--- Enabling APIs ---"
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com

echo "--- Creating Artifact Registry ---"
gcloud artifacts repositories create game-server \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Game server Docker images" \
  2>/dev/null || echo "  (already exists)"

echo "--- Creating Cloud SQL instance ---"
gcloud sql instances create "${DB_INSTANCE}" \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region="${REGION}" \
  --storage-size=10GB \
  --storage-auto-increase \
  2>/dev/null || echo "  (already exists)"

echo "--- Creating database and user ---"
gcloud sql databases create "${DB_NAME}" \
  --instance="${DB_INSTANCE}" \
  2>/dev/null || echo "  (already exists)"

DB_PASSWORD=$(openssl rand -base64 24)
gcloud sql users create "${DB_USER}" \
  --instance="${DB_INSTANCE}" \
  --password="${DB_PASSWORD}" \
  2>/dev/null || echo "  (user already exists — password unchanged)"

echo "--- Storing DB password in Secret Manager ---"
echo -n "${DB_PASSWORD}" | gcloud secrets create db-password \
  --data-file=- \
  --replication-policy=automatic \
  2>/dev/null || echo "  (secret already exists)"

echo "--- Creating Cloud Storage bucket ---"
gsutil mb -l "${REGION}" "gs://${ASSET_BUCKET}/" \
  2>/dev/null || echo "  (already exists)"
gsutil iam ch allUsers:objectViewer "gs://${ASSET_BUCKET}/"

echo "--- Creating Memorystore Redis (optional — skip with Ctrl+C) ---"
gcloud redis instances create "${REDIS_INSTANCE}" \
  --size=1 \
  --region="${REGION}" \
  --redis-version=redis_7_0 \
  --tier=basic \
  2>/dev/null || echo "  (already exists)"

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Update .firebaserc with project ID: ${PROJECT_ID}"
echo "  2. Run: firebase login && firebase init hosting"
echo "  3. Set up GitHub Actions secrets (WIF_PROVIDER, WIF_SA, FIREBASE_SA)"
echo "  4. Push to main to trigger first deploy"
echo ""
echo "DB Password (save this): ${DB_PASSWORD}"
echo "Asset bucket: gs://${ASSET_BUCKET}/"
