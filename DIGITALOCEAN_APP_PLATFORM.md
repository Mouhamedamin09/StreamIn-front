# 🚀 DigitalOcean App Platform Deployment Guide

## 📋 Prerequisites

- ✅ DigitalOcean account
- ✅ GitHub repository with your StreamIn code
- ✅ Backend server running at `https://streamin-server-feyfo.ondigitalocean.app`

## 🏗️ Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done)
2. **Ensure these files exist:**
   - `package.json` ✅
   - `vite.config.ts` ✅
   - `src/` folder ✅
   - `.do/app.yaml` ✅

### Step 2: DigitalOcean App Platform Setup

1. **Go to DigitalOcean Console**
   - Navigate to [DigitalOcean Console](https://cloud.digitalocean.com/)
   - Click "Apps" in the left sidebar

2. **Create New App**
   - Click "Create App"
   - Choose "GitHub" as source
   - Connect your GitHub account if needed
   - Select your StreamIn repository
   - Choose the main branch

3. **Configure App Settings**

#### **Build Command:**
```bash
npm install && npm run build
```

#### **Run Command:**
```bash
npm start
```

#### **Environment Variables:**
| Name | Value |
|------|-------|
| `VITE_ANALYTICS_URL` | `https://streamin-server-feyfo.ondigitalocean.app` |
| `VITE_TMDB_API_KEY` | `374ed57246cdd0d51e7f9c7eb9e682f0` |
| `VITE_TMDB_BASE_URL` | `https://api.themoviedb.org/3` |

4. **Choose Plan**
   - **Instance Size**: `Basic` → `Basic XS` ($5/month)
   - **Instance Count**: 1
   - **Region**: Choose closest to your users

5. **Deploy**
   - Click "Create Resources"
   - Wait for build and deployment (5-10 minutes)

## 🔧 Configuration Files

### `.do/app.yaml` (Auto-deployment)
```yaml
name: streamin-frontend
services:
- name: web
  source_dir: /
  github:
    repo: your-username/your-repo-name
    branch: main
  build_command: npm install && npm run build
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: VITE_ANALYTICS_URL
    value: https://streamin-server-feyfo.ondigitalocean.app
  - key: VITE_TMDB_API_KEY
    value: 374ed57246cdd0d51e7f9c7eb9e682f0
  - key: VITE_TMDB_BASE_URL
    value: https://api.themoviedb.org/3
```

### `package.json` Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "serve -s dist",
    "serve": "serve -s dist"
  }
}
```

## 🌐 Access Your App

After successful deployment, your app will be available at:
**`https://your-app-name.ondigitalocean.app`**

## 🚨 Troubleshooting

### Build Errors
- **"Cannot find module 'backend/server.js'"** ✅ Fixed - removed backend dependency
- **Missing dependencies** - Ensure `serve` package is installed
- **TypeScript errors** - Fix all TS errors before deploying

### Runtime Errors
- **Environment variables not loading** - Check DO App Platform env vars
- **API calls failing** - Verify backend server is running
- **Static files not serving** - Ensure `serve` package is in dependencies

### Common Issues
1. **Build timeout** - Optimize build process, remove unnecessary files
2. **Memory issues** - Upgrade to larger instance size
3. **Environment variables** - Double-check spelling and values

## 🔄 Update Process

### Automatic Updates (Recommended)
1. Push changes to GitHub
2. DigitalOcean automatically rebuilds and redeploys
3. No manual intervention needed

### Manual Updates
1. Go to DO App Platform
2. Click "Deploy" on your app
3. Choose "Deploy latest commit"

## 📊 Monitoring

- **Build logs** - Available in DO App Platform
- **Runtime logs** - Check app logs in DO console
- **Performance** - Monitor in DO App Platform dashboard
- **Errors** - View in real-time logs

## 💰 Cost Optimization

- **Basic XS**: $5/month (1 vCPU, 512MB RAM)
- **Basic S**: $12/month (1 vCPU, 1GB RAM) - if you need more resources
- **Auto-scaling**: Available for higher tiers

## 🎯 Success Checklist

- [ ] App builds successfully
- [ ] App deploys without errors
- [ ] Frontend loads correctly
- [ ] API calls work (analytics, TMDB)
- [ ] All features functional
- [ ] Mobile responsive
- [ ] Analytics tracking working

## 📞 Support

If you encounter issues:
1. Check DO App Platform logs
2. Verify environment variables
3. Test locally with `npm run build && npm start`
4. Check GitHub repository setup

---

**Your StreamIn app will be live on DigitalOcean App Platform! 🎬✨**
