#!/bin/bash

# GitHub Pages Deployment Script
# This script builds and deploys your Angular app to GitHub Pages

echo "🚀 Starting deployment to GitHub Pages..."

# Get the repository URL from git remote
REPO_URL=$(git config --get remote.origin.url)

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: No git remote 'origin' found."
    echo "Please run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

# Navigate to dist folder
cd dist/live-resume

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git remote add origin $REPO_URL
fi

# Add all files
git add -A

# Commit changes
git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# Push to gh-pages branch
echo "📤 Pushing to gh-pages branch..."
git push -f origin HEAD:gh-pages

if [ $? -eq 0 ]; then
    echo "✅ Deployment complete!"
    echo "🌐 Your site will be available at GitHub Pages in a few minutes."
    echo "📋 Next steps:"
    echo "   1. Go to your GitHub repository settings"
    echo "   2. Navigate to Pages section"
    echo "   3. Verify that gh-pages branch is selected"
    echo "   4. Add your custom domain if desired"
else
    echo "❌ Deployment failed! Please check the error messages above."
    exit 1
fi

# Return to project root
cd ../..