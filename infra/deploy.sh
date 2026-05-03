#!/bin/bash
set -e

# BallotBuddy AI - Optimized Deployment Script
# --------------------------------------------

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="asia-south1"
BACKEND_SERVICE="ballotbuddy-backend"
FRONTEND_SERVICE="ballotbuddy-frontend"

# Root directory (one level up from infra/)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Starting BallotBuddy AI Deployment to Google Cloud Run..."
echo "Project: $PROJECT_ID | Region: $REGION"
echo "Root Dir: $ROOT_DIR"

# 1. Enable Required APIs
echo "📦 Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    aiplatform.googleapis.com \
    firestore.googleapis.com \
    translate.googleapis.com \
    artifactregistry.googleapis.com

# 2. Configure IAM Permissions for the Cloud Run Service Account
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
COMPUTE_SA="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

echo "🔐 Granting IAM permissions to Cloud Run Service Account ($COMPUTE_SA)..."
ROLES=(
    "roles/aiplatform.user"
    "roles/datastore.user"
    "roles/cloudtranslate.user"
    "roles/logging.logWriter"
)

for ROLE in "${ROLES[@]}"; do
    echo "  - Adding $ROLE..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$COMPUTE_SA" \
        --role="$ROLE" --quiet > /dev/null
done

# 3. Build and Deploy Backend
echo "⚙️ Deploying Backend to Cloud Run..."
# Extract Gemini key from root .env
GEMINI_KEY=$(grep "^GEMINI_API_KEY=" "$ROOT_DIR/.env" | cut -d '=' -f2 | tr -d '\r')
RANDOM_SECRET=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)

gcloud run deploy $BACKEND_SERVICE \
    --source "$ROOT_DIR/backend" \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="FIRESTORE_PROJECT_ID=$PROJECT_ID,GCP_LOCATION=$REGION,REDIS_URL=memory,SECRET_KEY=$RANDOM_SECRET,BACKEND_CORS_ORIGINS=[\"*\"],GEMINI_API_KEY=$GEMINI_KEY" \
    --format="value(status.url)" --quiet > backend_url.txt

BACKEND_URL=$(cat backend_url.txt)
echo "✅ Backend deployed at: $BACKEND_URL"

# 4. VERIFICATION STAGE
echo "🔍 Verifying backend health..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/health/")
if [ "$HEALTH_STATUS" != "200" ]; then
    echo "❌ Backend health check failed (Status: $HEALTH_STATUS). Aborting frontend deployment."
    exit 1
fi
echo "✅ Backend health check passed!"

# 5. Build and Deploy Frontend
echo "🖥️ Preparing Frontend environment..."
# Next.js picks up .env.production during 'next build'
# Use sed to reliably extract all NEXT_PUBLIC variables from root .env
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1" > "$ROOT_DIR/frontend/.env.production"
grep "^NEXT_PUBLIC_" "$ROOT_DIR/.env" | sed 's/\r//' >> "$ROOT_DIR/frontend/.env.production"

echo "🖥️ Deploying Frontend to Cloud Run..."
# We deploy from within the frontend directory to ensure the build context is correct
cd "$ROOT_DIR/frontend"
gcloud run deploy $FRONTEND_SERVICE \
    --source "." \
    --region $REGION \
    --allow-unauthenticated \
    --format="value(status.url)" --quiet > ../frontend_url.txt

cd "$ROOT_DIR"
FRONTEND_URL=$(cat frontend_url.txt)
echo "✅ Frontend deployed at: $FRONTEND_URL"

# Cleanup temporary env file
rm "$ROOT_DIR/frontend/.env.production"

echo "--------------------------------------------------------"
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "--------------------------------------------------------"
echo "Backend:  $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo "--------------------------------------------------------"
echo "Note: Ensure your domain or CORS settings allow requests from $FRONTEND_URL to $BACKEND_URL."

# Cleanup
rm backend_url.txt frontend_url.txt
