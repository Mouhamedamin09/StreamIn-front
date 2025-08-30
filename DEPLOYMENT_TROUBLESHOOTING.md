# 🚨 StreamIn Deployment Troubleshooting Guide

## ❌ Build Error: "Cannot find module 'backend/server.js'"

### ✅ **FIXED: Backend Dependency Removed**

The error occurred because your `package.json` had a start script trying to run a non-existent backend server.

**What was changed:**

```json
// BEFORE (❌ BROKEN)
"start": "node backend/server.js"

// AFTER (✅ FIXED)
"start": "serve -s dist"
```

## ❌ Build Error: "Node version not specified"

### ✅ **FIXED: Node.js Version Specified**

DigitalOcean App Platform requires a Node.js version to be specified in `package.json`.

**Added to package.json:**

```json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=8.0.0"
}
```

**Added .nvmrc file:**

```
18.18.0
```

## 🔧 **Current Configuration (FIXED)**

### **package.json Scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "serve -s dist",
    "serve": "serve -s dist"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### **Dependencies Added**

- ✅ `serve` package for static file serving
- ✅ Node.js version specification
- ✅ Production-ready start script

## 🚀 **Deploy Again**

Now that the configuration is fixed, redeploy to DigitalOcean App Platform:

1. **Push changes to GitHub**
2. **Go to DigitalOcean App Platform**
3. **Redeploy your app**
4. **Use these settings:**

#### **Build Command:**

```bash
npm ci --only=production && npm run build
```

#### **Run Command:**

```bash
npm start
```

#### **Environment Variables:**

| Name                 | Value                                              |
| -------------------- | -------------------------------------------------- |
| `VITE_ANALYTICS_URL` | `https://streamin-server-feyfo.ondigitalocean.app` |
| `VITE_TMDB_API_KEY`  | `374ed57246cdd0d51e7f9c7eb9e682f0`                 |
| `VITE_TMDB_BASE_URL` | `https://api.themoviedb.org/3`                     |
| `NODE_ENV`           | `production`                                       |

## 🧪 **Test Locally First**

Before deploying, test the build locally:

```bash
# Clean install
npm ci

# Build
npm run build

# Test start script
npm start
```

## 🎯 **Expected Result**

After fixing these issues, your deployment should:

- ✅ Build successfully
- ✅ Deploy without errors
- ✅ Serve static files correctly
- ✅ Connect to your backend API
- ✅ Display your StreamIn app

## 📞 **If Still Failing**

Check these common issues:

1. **GitHub repository** - Ensure code is pushed
2. **Branch name** - Verify main/master branch
3. **File paths** - Check `.do/app.yaml` exists
4. **Dependencies** - Ensure all packages are in `package.json`
5. **Build logs** - Review detailed error messages

---

**Your StreamIn app should now deploy successfully! 🎬✨**
