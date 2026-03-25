#!/usr/bin/env bash
# Upload game assets (sprites, audio, content JSON) to Cloud Storage.
# Usage: ./scripts/upload-assets.sh PROJECT_ID

set -euo pipefail

PROJECT_ID="${1:?Usage: upload-assets.sh PROJECT_ID}"
BUCKET="gs://${PROJECT_ID}-assets"

echo "=== Building content JSON from YAML ==="
npm run build:content

echo "=== Syncing assets to ${BUCKET} ==="

# Content JSON (built from YAML pipeline)
gsutil -m rsync -r dist/content/ "${BUCKET}/content/"

# Sprite sheets (when they exist)
if [ -d "assets/sprites" ]; then
  gsutil -m rsync -r assets/sprites/ "${BUCKET}/sprites/"
fi

# Audio (when it exists)
if [ -d "assets/audio" ]; then
  gsutil -m rsync -r assets/audio/ "${BUCKET}/audio/"
fi

# Tilesets (when they exist)
if [ -d "assets/tilesets" ]; then
  gsutil -m rsync -r assets/tilesets/ "${BUCKET}/tilesets/"
fi

echo ""
echo "=== Asset upload complete ==="
echo "Base URL: https://storage.googleapis.com/${PROJECT_ID}-assets/"
