# BallotBuddy AI - Infrastructure

This directory contains configuration files and scripts for deploying and running the BallotBuddy AI application.

## Contents

- `deploy.sh`: A shell script to deploy both backend and frontend to Google Cloud Run. It automatically enables required APIs and configures IAM permissions.
- `docker-compose.yml`: Configuration for local development using Docker. It sets up the backend (FastAPI), frontend (Next.js), and Redis.

## Deployment to Google Cloud Run

To deploy the application to Google Cloud, run the following command from the root directory:

```bash
bash infra/deploy.sh
```

The script will:
1. Enable Google Cloud APIs (Cloud Run, Cloud Build, Vertex AI, Firestore, Translation).
2. Configure IAM roles for the default compute service account.
3. Build and deploy the backend service.
4. Update the frontend with the backend's URL and deploy the frontend service.

## Local Development with Docker

To start the application locally using Docker Compose, run the following command from the root directory:

```bash
docker-compose -f infra/docker-compose.yml up --build
```
