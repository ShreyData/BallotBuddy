#!/bin/bash
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="asia-south1"
BACKEND_SERVICE="ballotbuddy-backend"
FRONTEND_SERVICE="ballotbuddy-frontend"

echo "🚀 Starting BallotBuddy AI Deployment to Google Cloud Run..."
echo "Project: $PROJECT_ID | Region: $REGION"

# 1. Enable Required APIs
echo "📦 Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    aiplatform.googleapis.com \
    firestore.googleapis.com

# 2. Configure IAM Permissions for the Cloud Run Service Account
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
COMPUTE_SA="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

echo "🔐 Granting IAM permissions to Cloud Run Service Account ($COMPUTE_SA)..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$COMPUTE_SA" \
    --role="roles/aiplatform.user" --quiet > /dev/null

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$COMPUTE_SA" \
    --role="roles/datastore.user" --quiet > /dev/null

# 3. Build and Deploy Backend
echo "⚙️ Deploying Backend to Cloud Run..."
gcloud run deploy $BACKEND_SERVICE \
    --source ./backend \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="FIRESTORE_PROJECT_ID=$PROJECT_ID,GCP_LOCATION=$REGION,REDIS_URL=memory" \
    --format="value(status.url)" --quiet > backend_url.txt

BACKEND_URL=$(cat backend_url.txt)
echo "✅ Backend deployed at: $BACKEND_URL"

# 4. Build and Deploy Frontend
echo "🖥️ Deploying Frontend to Cloud Run..."
gcloud run deploy $FRONTEND_SERVICE \
    --source ./frontend \
    --region $REGION \
    --allow-unauthenticated \
    --set-build-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1" \
    --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1" \
    --format="value(status.url)" --quiet > frontend_url.txt

FRONTEND_URL=$(cat frontend_url.txt)
echo "✅ Frontend deployed at: $FRONTEND_URL"

# 5. Update Backend with Frontend URL for CORS security
echo "🔒 Updating Backend CORS settings to allow Frontend URL..."
gcloud run services update $BACKEND_SERVICE \
    --region $REGION \
    --set-env-vars="BACKEND_CORS_ORIGINS=[\"$FRONTEND_URL\"]" --quiet > /dev/null

echo "--------------------------------------------------------"
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "--------------------------------------------------------"
echo "URL: $FRONTEND_URL"
echo "--------------------------------------------------------"
echo "Note: The first request may take a few seconds due to cold start."

# Cleanup
rm backend_url.txt frontend_url.txt
