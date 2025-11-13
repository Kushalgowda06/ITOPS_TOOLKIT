#!/bin/bash

# Configuration
AWS_REGION="ap-southeast-1"
AWS_ACCOUNT_ID="361568250748"
ECR_BASE_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# ECR Repository names
REPOS=("itops-backend" "itops-frontend" "itops-vault" "itops-postgres")

echo "=== Building and Pushing ITOPS Images to ECR ==="

# Login to ECR
echo "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BASE_URI

# Create repositories if they don't exist
for repo in "${REPOS[@]}"; do
    echo "Creating ECR repository: $repo"
    aws ecr create-repository --repository-name $repo --region $AWS_REGION 2>/dev/null || echo "Repository $repo already exists"
done

# Build and push images
echo "Building and pushing backend..."
docker build -t $ECR_BASE_URI/itops-backend:latest ./ITOpsToolokit_Backend
docker push $ECR_BASE_URI/itops-backend:latest

echo "Building and pushing frontend..."
docker build -t $ECR_BASE_URI/itops-frontend:latest ./ITOpsToolokit_Frontend
docker push $ECR_BASE_URI/itops-frontend:latest

echo "Building and pushing vault..."
docker build -t $ECR_BASE_URI/itops-vault:latest ./ITOpsToolokit_Backend/vault_setup
docker push $ECR_BASE_URI/itops-vault:latest

echo "Building and pushing postgres..."
docker build -t $ECR_BASE_URI/itops-postgres:latest ./ITOpsToolokit_Backend/db_setup
docker push $ECR_BASE_URI/itops-postgres:latest

echo "=== All images pushed successfully ==="