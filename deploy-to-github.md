# Quick Guide: Upload to GitHub

Follow these steps to upload your project to GitHub:

## Step 1: Initialize Git (if not already done)

```bash
cd C:\Users\23303\OneDrive\Desktop\Agent
git init
```

## Step 2: Add and Commit Files

```bash
git add .
git commit -m "Initial commit: UNICC AI Agent Safety Platform"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon → **"New repository"**
3. Fill in:
   - **Name**: `ai-agent-safety-platform` (or your choice)
   - **Description**: "UNICC AI Agent Safety and Compliance Detection Platform"
   - **Visibility**: Public or Private
   - **DO NOT** check "Initialize with README" (we already have one)
4. Click **"Create repository"**

## Step 4: Connect and Push

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Replace YOUR_USERNAME and REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 5: Verify

Visit your repository on GitHub to confirm all files are uploaded.

## Troubleshooting

### Authentication Issues

If you get authentication errors:

**Option 1: Use Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

**Option 2: Use GitHub CLI**
```bash
# Install GitHub CLI if not installed
# Then:
gh auth login
git push -u origin main
```

### Large Files

If you have large files, they might be in `node_modules`. Check `.gitignore` is working:
```bash
git status
# Should not show node_modules files
```

