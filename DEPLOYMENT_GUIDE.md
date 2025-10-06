# 🚀 Deployment Guide

This guide will walk you through deploying your live-resume website to GitHub Pages with a custom domain.

## Prerequisites Checklist

- [ ] GitHub account created
- [ ] Git installed on your computer
- [ ] Project builds successfully (npm run build)
- [ ] (Optional) Custom domain purchased

## Part 1: Upload to GitHub

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the *"+"* icon (top-right) → *"New repository"*
3. Fill in the details:
   - *Repository name*: live-resume (or your preferred name)
   - *Description*: "My personal portfolio website"
   - *Visibility*: Public ✅ (required for free GitHub Pages)
   - *Initialize*: Leave all checkboxes unchecked (we already have code)
4. Click *"Create repository"*

### Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Open your terminal and run:

bash
cd /Users/magarwal5/Desktop/Personal/live-resume

# Add GitHub as your remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code
git push -u origin master


> *Replace YOUR_USERNAME and YOUR_REPO_NAME* with your actual GitHub username and the repository name you chose.

### Step 3: Verify Upload

Refresh your GitHub repository page. You should see all your files uploaded!

## Part 2: Deploy to GitHub Pages

### Step 1: Run the Deployment Script

Make the script executable and run it:

bash
chmod +x deploy.sh
npm run deploy


Or directly:

bash
./deploy.sh


This script will:

1. Build your Angular app
2. Create a gh-pages branch
3. Push the built files to GitHub

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click *Settings* (top menu)
3. Scroll down and click *Pages* (left sidebar)
4. Under "Source":
   - Branch: Select gh-pages
   - Folder: / (root)
   - Click *Save*

### Step 3: Access Your Website

After 1-2 minutes, your site will be live at:


https://YOUR_USERNAME.github.io/YOUR_REPO_NAME


You'll see a green success message in the GitHub Pages settings with your URL.

## Part 3: Custom Domain (Optional)

### Step 1: Add CNAME File

Create a file to tell GitHub about your custom domain:

bash
echo "yourdomain.com" > src/CNAME


> Replace yourdomain.com with your actual domain (no http://, no www unless you want it)

### Step 2: Update Angular Configuration

Add the CNAME file to your build assets. Edit angular.json:

json
"assets": [
  "src/CNAME",
  "src/favicon.ico",
  "src/assets",
  "src/sitemap.xml",
  "src/robots.txt"
]


### Step 3: Configure DNS at Your Domain Registrar

Log into your domain registrar (GoDaddy, Namecheap, Google Domains, etc.) and add these DNS records:

#### Option A: Apex Domain (yourdomain.com)

Add *4 A Records*:
| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

#### Option B: Subdomain (www.yourdomain.com)

Add *1 CNAME Record*:
| Type | Host | Value |
|------|------|-------|
| CNAME | www | YOUR_USERNAME.github.io |

### Step 4: Add Domain to GitHub

1. Go to repository *Settings* → *Pages*
2. Under "Custom domain", enter: yourdomain.com
3. Click *Save*
4. Wait for DNS check (may take up to 48 hours, usually 5-30 minutes)
5. Once verified, check *"Enforce HTTPS"* ✅

### Step 5: Deploy Again

bash
npm run deploy


Your site should now be accessible at your custom domain!

## Part 4: Future Updates

Whenever you make changes to your website:

1. *Edit your code* locally
2. *Commit changes*:
   bash
   git add .
   git commit -m "Description of changes"
   git push origin master
   
3. *Deploy*:
   bash
   npm run deploy
   

That's it! Your changes will be live in 1-2 minutes.

## Troubleshooting

### Site Not Loading

1. *Wait*: GitHub Pages can take 5-10 minutes to deploy
2. *Check branch*: Ensure gh-pages is selected in Settings → Pages
3. *Check build*: Run npm run build to ensure no errors
4. *Clear cache*: Try incognito mode or clear browser cache

### Custom Domain Not Working

1. *Check DNS*: Use [DNS Checker](https://dnschecker.org) to verify your DNS records have propagated
2. *Wait*: DNS changes can take up to 48 hours (usually much faster)
3. *HTTPS error*: Wait for GitHub's SSL certificate to provision (can take 24 hours)
4. *CNAME file*: Ensure src/CNAME exists and is included in your build

### Build Errors

bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try building
npm run build


### Permission Denied on deploy.sh

bash
chmod +x deploy.sh


## Alternative Deployment Options

### Netlify (Easier, More Features)

1. Push code to GitHub (Part 1 above)
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Choose GitHub → Select your repository
5. Build settings:
   - Build command: npm run build
   - Publish directory: dist/live-resume
6. Click "Deploy site"
7. Custom domain: Site settings → Domain management

### Vercel (Fastest)

1. Push code to GitHub (Part 1 above)
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project"
4. Import your repository
5. It auto-detects Angular settings
6. Click "Deploy"
7. Custom domain: Project Settings → Domains

### Firebase Hosting

bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
# Choose: dist/live-resume as public directory

# Deploy
npm run build
firebase deploy


## Quick Reference

| Action                 | Command                                            |
| ---------------------- | -------------------------------------------------- |
| Start dev server       | npm start                                        |
| Build for production   | npm run build                                    |
| Deploy to GitHub Pages | npm run deploy                                   |
| Push code changes      | git add . && git commit -m "message" && git push |

## Support

If you encounter issues:

1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Verify your build works locally: npm run build
3. Check the browser console for errors
4. Review GitHub Actions tab in your repository for deployment errors

---

*Happy Deploying! 🎉*