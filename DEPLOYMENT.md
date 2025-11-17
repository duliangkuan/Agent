# Deployment Guide

This guide covers deploying the UNICC AI Agent Safety and Compliance Detection Platform to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Git installed on your local machine
- Node.js >= 18 installed

## Part 1: Upload to GitHub

### Step 1: Initialize Git Repository

If you haven't already initialized a git repository:

```bash
cd C:\Users\23303\OneDrive\Desktop\Agent
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: UNICC AI Agent Safety Platform"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `ai-agent-safety-platform` (or your preferred name)
   - **Description**: "UNICC AI Agent Safety and Compliance Detection Platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename the default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### Step 6: Verify Upload

Visit your GitHub repository URL to verify all files are uploaded correctly.

## Part 2: Deploy to Vercel

### Important Notes

This project consists of:
- **Frontend**: React application (can be deployed to Vercel)
- **Backend**: Node.js + Express + SQLite (requires special handling)

**Vercel Limitations:**
- Vercel uses serverless functions which are stateless
- SQLite file-based database won't work in serverless environment
- Socket.io requires persistent connections (not ideal for serverless)

### Option A: Deploy Frontend Only to Vercel

This is the recommended approach for quick deployment:

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy Frontend

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- What's your project's name? `ai-agent-safety-frontend`
- In which directory is your code located? `./`
- Override settings? **No**

#### Step 4: Configure Environment Variables

After deployment, go to your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app` or `https://your-backend.render.com`)

#### Step 5: Redeploy

After adding environment variables, trigger a new deployment.

### Option B: Deploy Backend Separately

For the backend, consider these alternatives:

#### Option B1: Railway (Recommended for SQLite)

1. Go to [Railway](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will auto-detect Node.js
7. Set environment variables in Railway dashboard
8. Deploy

#### Option B2: Render

1. Go to [Render](https://render.com)
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `ai-agent-safety-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add environment variables
7. Deploy

#### Option B3: Convert to Vercel Serverless Functions

This requires significant code changes:
- Convert SQLite to a cloud database (PostgreSQL, MongoDB, etc.)
- Convert Socket.io to polling or use Vercel's serverless WebSocket support
- Refactor routes to serverless functions

### Option C: Full Stack Deployment with Vercel

If you want to deploy both frontend and backend on Vercel:

1. **Convert backend to serverless functions**:
   - Move API routes to `api/` directory
   - Use a cloud database (not SQLite)
   - Remove Socket.io or use alternative

2. **Deploy**:
   ```bash
   vercel
   ```

## Recommended Architecture

For production, we recommend:

```
Frontend (Vercel)
    ↓
Backend API (Railway/Render)
    ↓
Database (PostgreSQL on Railway/Render or Supabase)
```

## Environment Variables

### Frontend (.env or Vercel Environment Variables)

```env
REACT_APP_API_URL=https://your-backend-api.com
```

### Backend (.env or Platform Environment Variables)

```env
DB_TYPE=sqlite
DB_PATH=./data/agent_security.db
# OR for PostgreSQL:
# DATABASE_URL=postgresql://user:password@host:5432/dbname

PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend API deployed and accessible
- [ ] Environment variables configured
- [ ] CORS settings updated for production URLs
- [ ] Database initialized
- [ ] Health check endpoints working
- [ ] Test detection flow end-to-end

## Troubleshooting

### Frontend Issues

- **Build fails**: Check Node.js version (should be >= 18)
- **API calls fail**: Verify `REACT_APP_API_URL` is set correctly
- **CORS errors**: Update backend CORS settings to include Vercel URL

### Backend Issues

- **Database connection fails**: Ensure database is accessible from deployment platform
- **Port issues**: Use platform's PORT environment variable
- **SQLite issues**: Consider migrating to PostgreSQL for production

## Support

For deployment issues, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

