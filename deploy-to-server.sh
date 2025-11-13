#!/bin/bash

# Configuration
AWS_REGION="ap-southeast-1"
AWS_ACCOUNT_ID="361568250748"
ECR_BASE_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "=== Deploying ITOPS to Server ==="

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_BASE_URI

# Stop and remove existing containers
echo "Stopping existing containers..."
docker stop itops-frontend itops-backend itops-postgres itops-vault 2>/dev/null || true
docker rm itops-frontend itops-backend itops-postgres itops-vault 2>/dev/null || true

# Pull latest images
echo "Pulling latest images..."
docker pull $ECR_BASE_URI/itops-vault:latest
docker pull $ECR_BASE_URI/itops-postgres:latest
docker pull $ECR_BASE_URI/itops-backend:latest
docker pull $ECR_BASE_URI/itops-frontend:latest

# Create network
docker network create itops-network 2>/dev/null || true

# Start Vault
echo "Starting Vault..."
docker run -d \
  --name itops-vault \
  --network itops-network \
  -p 8200:8200 \
  -e VAULT_DEV_ROOT_TOKEN_ID=root \
  -e VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200 \
  --cap-add IPC_LOCK \
  $ECR_BASE_URI/itops-vault:latest

# Start PostgreSQL
echo "Starting PostgreSQL..."
docker run -d \
  --name itops-postgres \
  --network itops-network \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=Postgres_2025 \
  -e POSTGRES_DB=cfs_problem_tickets \
  -v postgres_data:/var/lib/postgresql/data \
  $ECR_BASE_URI/itops-postgres:latest

# Wait for services
echo "Waiting for services to start..."
sleep 30

# Start Backend
echo "Starting Backend..."
docker run -d \
  --name itops-backend \
  --network itops-network \
  -p 8000:8000 \
  -e PGHOST=itops-postgres \
  -e PGUSER=postgres \
  -e PGPASSWORD=Postgres_2025 \
  -e PGDATABASE=cfs_problem_tickets \
  -e VAULT_URL=http://itops-vault:8200 \
  -e VAULT_TOKEN=root \
  $ECR_BASE_URI/itops-backend:latest

# Wait for backend
sleep 15

# Start Frontend
echo "Starting Frontend..."
docker run -d \
  --name itops-frontend \
  --network itops-network \
  -p 80:80 \
  $ECR_BASE_URI/itops-frontend:latest

echo "=== Deployment Complete ==="
echo "Services Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "Access URLs:"
echo "Frontend: http://$(curl -s ifconfig.me)"
echo "Backend API: http://$(curl -s ifconfig.me):8000"
echo "Vault: http://$(curl -s ifconfig.me):8200"