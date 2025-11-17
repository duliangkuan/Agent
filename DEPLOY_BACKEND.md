# Backend Deployment Guide

## Option 1: Deploy to Render (Recommended - Supports SQLite)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up/login with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `duliangkuan/Agent`
3. Configure:
   - **Name**: `agent-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables
In Render dashboard, add:
- `NODE_ENV` = `production`
- `DB_TYPE` = `sqlite`
- `DB_PATH` = `./data/agent_security.db`
- `FRONTEND_URL` = `https://frontend-96fljnqrt-duliangkuans-projects.vercel.app`

### Step 4: Add Disk Storage (for SQLite)
1. In Render dashboard, go to your service
2. Click "Disks" tab
3. Add disk:
   - **Name**: `agent-db`
   - **Mount Path**: `/opt/render/project/src/data`
   - **Size**: 1 GB

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Get your backend URL (e.g., `https://agent-backend.onrender.com`)

### Step 6: Initialize Database
After deployment, use Render Shell:
1. Go to your service → "Shell" tab
2. Run:
   ```bash
   npm run db:init
   ```

### Step 7: Update Frontend Environment Variable
1. Go to Vercel Dashboard: https://vercel.com/duliangkuans-projects/frontend/settings
2. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
3. Redeploy frontend: `cd frontend && vercel --prod`

## Option 2: Deploy to Railway

### Step 1: Login to Railway
```bash
cd backend
railway login
```

### Step 2: Initialize Project
```bash
railway init
# Select: Deploy from GitHub repo -> duliangkuan/Agent
```

### Step 3: Set Environment Variables
```bash
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app
```

### Step 4: Deploy
```bash
railway up
```

### Step 5: Get Domain
```bash
railway domain
```

### Step 6: Initialize Database
```bash
railway run npm run db:init
```

## Verification

Test your backend:
```bash
curl https://your-backend-url/api/health
# Should return: {"status":"ok","message":"API is running"}
```

