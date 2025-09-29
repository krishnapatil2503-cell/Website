#!/bin/bash

# GitHub Pages Deployment Script
# This script builds and deploys your Angular app to GitHub Pages

echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Navigate to dist folder
cd dist/live-resume

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
fi

# Add all files
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git push -f origin HEAD:gh-pages

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
