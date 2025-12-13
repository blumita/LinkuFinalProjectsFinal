#!/bin/bash

# Script to deploy admin-dashboard with proper memory management
# This prevents "JavaScript heap out of memory" errors

set -e

echo "🚀 Starting deployment of admin-dashboard..."

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=6144"

# Navigate to project directory
cd /var/www/dash.linku.im/admin-dashboard

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🧹 Cleaning old build..."
rm -rf dist

echo "🔨 Building application with increased memory..."
npm run build:full

echo "✅ Build completed successfully!"

# Copy files to production if needed
# cp -r dist/* /var/www/html/admin/

echo "📊 Build statistics:"
du -sh dist/
