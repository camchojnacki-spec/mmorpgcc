#!/usr/bin/env bash
# Build and deploy the client + admin to Firebase Hosting.
# Usage: ./scripts/deploy-client.sh

set -euo pipefail

echo "=== Building content pipeline ==="
npm run build:content

echo "=== Building client ==="
npm run build --workspace=packages/client

echo "=== Building admin portal ==="
npm run build --workspace=packages/admin

echo "=== Deploying to Firebase Hosting ==="
firebase deploy --only hosting

echo ""
echo "=== Client deploy complete ==="
