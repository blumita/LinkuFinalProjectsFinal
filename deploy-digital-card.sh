#!/bin/bash

# Script to deploy digital-business-card with proper memory management
# This prevents "JavaScript heap out of memory" errors

set -e

echo "🚀 Starting deployment of digital-business-card..."

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Navigate to project directory
cd /var/www/dash.linku.im/digital-business-card

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🧹 Cleaning old build..."
rm -rf .nuxt .output dist

echo "🔨 Building application with increased memory..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart digital-business-card || pm2 start npm --name "digital-business-card" -- start

echo "✅ Deployment completed successfully!"

# Show PM2 status
pm2 list
