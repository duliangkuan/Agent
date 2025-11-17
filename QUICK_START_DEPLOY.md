# Quick Start: Deploy to GitHub & Vercel

## 🚀 Part 1: Upload to GitHub (5 minutes)

### Windows PowerShell Commands

```powershell
# Navigate to project
cd C:\Users\23303\OneDrive\Desktop\Agent

# Initialize git (if not done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: UNICC AI Agent Safety Platform"

# Create repository on GitHub first, then:
# Replace YOUR_USERNAME and REPO_NAME
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Need help?** See [deploy-to-github.md](./deploy-to-github.md) for detailed steps.

---

## 🌐 Part 2: Deploy Frontend to Vercel (10 minutes)

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub

2. **Click "Add New..." → "Project"**

3. **Import your GitHub repository**
   - Select the repository you just created
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. **Environment Variables**:
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com`
   - (You'll update this after deploying backend)

6. **Click "Deploy"**

7. **Wait for deployment** (2-3 minutes)

8. **Get your frontend URL** (e.g., `https://your-project.vercel.app`)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? ai-agent-safety-frontend
# - Directory? ./
```

---

## 🔧 Part 3: Deploy Backend (Choose One)

### Option 1: Railway (Recommended - Easiest for SQLite)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js
6. **Configure**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
7. **Add Environment Variables**:
   - `DB_TYPE=sqlite`
   - `DB_PATH=./data/agent_security.db`
   - `PORT=8000` (Railway sets this automatically)
   - `FRONTEND_URL=https://your-frontend.vercel.app`
8. **Deploy** - Railway will build and deploy automatically
9. **Get your backend URL** (e.g., `https://your-project.railway.app`)

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. **Configure**:
   - **Name**: `ai-agent-safety-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Add Environment Variables** (same as Railway)
7. **Deploy**

---

## 🔗 Part 4: Connect Frontend to Backend

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Update `REACT_APP_API_URL`**:
   - Value: Your backend URL from Railway/Render
   - Example: `https://your-backend.railway.app`

3. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"

---

## ✅ Verification Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway/Render
- [ ] Frontend can access backend API
- [ ] Environment variables configured
- [ ] Database initialized (run `npm run db:init` on backend)

---

## 🆘 Need Help?

- **GitHub Issues**: See [deploy-to-github.md](./deploy-to-github.md)
- **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app

---

## 📝 Quick Commands Reference

```bash
# Git
git add .
git commit -m "Your message"
git push origin main

# Vercel CLI
vercel login
vercel deploy

# Railway CLI (optional)
railway login
railway up
```

