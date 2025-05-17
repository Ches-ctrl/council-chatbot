#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    source .env
fi

# Check for required environment variables
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "Error: GOOGLE_CLOUD_PROJECT environment variable is not set"
    exit 1
fi

# Set variables
PROJECT_ID=$GOOGLE_CLOUD_PROJECT
REGION=${GOOGLE_CLOUD_REGION:-"us-central1"}

# Build and push inbound handler
echo "Building inbound call handler..."
docker build -t gcr.io/$PROJECT_ID/inbound-call-handler -f Dockerfile.inbound .
docker push gcr.io/$PROJECT_ID/inbound-call-handler

# Build and push outbound handler
echo "Building outbound call handler..."
docker build -t gcr.io/$PROJECT_ID/outbound-call-handler -f Dockerfile.outbound .
docker push gcr.io/$PROJECT_ID/outbound-call-handler

# Deploy inbound handler
echo "Deploying inbound call handler..."
gcloud run deploy inbound-call-handler \
    --image gcr.io/$PROJECT_ID/inbound-call-handler \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY,ELEVENLABS_AGENT_ID=$ELEVENLABS_AGENT_ID"

# Deploy outbound handler
echo "Deploying outbound call handler..."
gcloud run deploy outbound-call-handler \
    --image gcr.io/$PROJECT_ID/outbound-call-handler \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY,ELEVENLABS_AGENT_ID=$ELEVENLABS_AGENT_ID,TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN,TWILIO_PHONE_NUMBER=$TWILIO_PHONE_NUMBER"

echo "Deployment complete!"
echo "Inbound handler URL: $(gcloud run services describe inbound-call-handler --platform managed --region $REGION --format 'value(status.url)')"
echo "Outbound handler URL: $(gcloud run services describe outbound-call-handler --platform managed --region $REGION --format 'value(status.url)')"
