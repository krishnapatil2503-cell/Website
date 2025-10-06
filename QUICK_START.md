# ⚡ Quick Start Guide

## Upload to GitHub (First Time)

### 1. Create Repository on GitHub

- Go to github.com → Click "+" → "New repository"
- Name it (e.g., live-resume)
- Make it *Public*
- Don't initialize with README
- Click "Create repository"

### 2. Push Your Code

bash
cd /Users/magarwal5/Desktop/Personal/live-resume

# Connect to GitHub (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code
git push -u origin master


### 3. Deploy to GitHub Pages

bash
# Make script executable (first time only)
chmod +x deploy.sh

# Deploy!
npm run deploy


### 4. Enable GitHub Pages

1. Go to your repo on GitHub
2. Settings → Pages
3. Source: Select gh-pages branch
4. Save

*Done!* Your site will be live at:
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME

---

## Add Custom Domain

### 1. Create CNAME File

bash
echo "yourdomain.com" > src/CNAME


### 2. Add to Build (Edit angular.json)

json
"assets": [
  "src/CNAME",    ← Add this line
  "src/favicon.ico",
  ...
]


### 3. Configure DNS at Your Domain Registrar

Add these A records:


Type: A    Host: @    Value: 185.199.108.153
Type: A    Host: @    Value: 185.199.109.153
Type: A    Host: @    Value: 185.199.110.153
Type: A    Host: @    Value: 185.199.111.153


### 4. Add Domain in GitHub

1. Repo Settings → Pages
2. Custom domain: yourdomain.com
3. Save
4. Wait for DNS check ✓
5. Enable "Enforce HTTPS"

### 5. Deploy

bash
npm run deploy


*Done!* Wait 5-30 minutes for DNS propagation.

---

## Making Updates

bash
# 1. Make your changes in the code

# 2. Commit and push to GitHub
git add .
git commit -m "Updated my experience"
git push

# 3. Deploy
npm run deploy


---

## Common Commands

bash
# Start local development
npm start

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy

# Check git remote
git remote -v


---

## Troubleshooting

*Site not loading?*

- Wait 5-10 minutes after first deployment
- Check Settings → Pages shows green checkmark
- Try incognito mode

*Deploy script error?*

bash
chmod +x deploy.sh


*Build errors?*

bash
npm install
npm run build


*Need to change GitHub repo?*

bash
git remote remove origin
git remote add origin https://github.com/NEW_USERNAME/NEW_REPO.git
git push -u origin master


---

## That's It! 🚀

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)