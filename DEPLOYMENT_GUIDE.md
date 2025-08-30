# 🚀 StreamIn Deployment Guide - DigitalOcean

This guide will walk you through deploying your StreamIn app (React frontend + Node.js backend) to DigitalOcean.

## 📋 Prerequisites

Before starting, make sure you have:

- DigitalOcean account
- Domain name (optional but recommended)
- Local app working correctly
- Git repository (GitHub/GitLab)

## 🛠️ Option 1: DigitalOcean App Platform (Recommended)

### 🔄 Deployment Process Overview

The deployment happens in this order:

1. **Deploy first** → Get your app URLs
2. **Configure environment variables** with the actual URLs
3. **Redeploy** → App works correctly

This is because DigitalOcean generates random URLs that you can't predict beforehand.

### Step 1: Prepare Your Repository

1. **Push your code to GitHub/GitLab:**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Initial Push (without environment variables):**

   ```bash
   # First, push your code without production environment variables
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

   **Note:** We'll configure environment variables AFTER creating the app, when we know the actual URLs.

### Step 2: Set Up MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for production
5. Get your connection string

### Step 3: Deploy to DigitalOcean App Platform

1. **Login to DigitalOcean:**

   - Go to [DigitalOcean](https://cloud.digitalocean.com/)
   - Navigate to "Apps" section
   - Click "Create App"

2. **Connect Repository:**

   - Choose GitHub/GitLab
   - Select your repository
   - Choose the main branch

3. **Configure App Components:**

   **Backend Service:**

   ```yaml
   name: streamin-backend
   source_dir: /backend
   github:
     repo: your-username/your-repo-name
     branch: main
   run_command: npm start
   environment_slug: node-js
   instance_count: 1
   instance_size_slug: basic-xxs
   ```

   **Frontend Static Site:**

   ```yaml
   name: streamin-frontend
   source_dir: /
   github:
     repo: your-username/your-repo-name
     branch: main
   build_command: npm run build
   output_dir: /dist
   environment_slug: node-js
   ```

4. **Initial Deploy (without environment variables):**

   - Review settings
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)
   - **Note:** The app will initially fail because environment variables are missing - this is expected!

5. **Get Your App URLs:**
   After deployment, you'll get URLs like:

   - Frontend: `https://streamin-frontend-abc123.ondigitalocean.app`
   - Backend: `https://streamin-backend-abc123.ondigitalocean.app`

6. **Configure Environment Variables:**

   Go to your app settings → "Components" → Select each component → "Environment Variables"

   **For Backend Component:**

   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your-mongodb-connection-string`
   - `ALLOWED_ORIGINS` = `https://streamin-frontend-abc123.ondigitalocean.app` (use your actual frontend URL)

   **For Frontend Component:**

   - `VITE_ANALYTICS_URL` = `https://streamin-backend-abc123.ondigitalocean.app` (use your actual backend URL)
   - `VITE_TMDB_API_KEY` = `374ed57246cdd0d51e7f9c7eb9e682f0`
   - `VITE_TMDB_BASE_URL` = `https://api.themoviedb.org/3`

7. **Redeploy:**
   - After setting environment variables, trigger a new deployment
   - Your app should now work correctly!

### Step 4: Configure Domain (Optional)

1. In your app settings, go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically generated

---

## 🖥️ Option 2: DigitalOcean Droplet (VPS)

### Step 1: Create Droplet

1. **Create Ubuntu Droplet:**
   - Choose Ubuntu 22.04 LTS
   - Select $6/month plan (minimum recommended)
   - Add SSH key or use password
   - Create droplet

### Step 2: Initial Server Setup

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y

# Create app user
adduser --disabled-password --gecos "" streamin
usermod -aG sudo streamin
```

### Step 3: Deploy Application

```bash
# Switch to app user
su - streamin

# Clone repository (replace with your actual repo URL)
git clone https://github.com/your-username/your-repo-name.git StreamIn
cd StreamIn

# Setup Backend first
cd backend
npm install --production
cp .env.example .env

# Edit backend .env with your production values
nano .env
# Add these values:
# NODE_ENV=production
# PORT=8080
# MONGODB_URI=your-mongodb-connection-string
# ALLOWED_ORIGINS=http://YOUR_DROPLET_IP

# Go back to root and setup Frontend (optimized for VM)
cd ..

# Clear npm cache and optimize for VM
npm cache clean --force
npm config set maxsockets 1
npm config set fetch-retries 3

# Install dependencies with reduced parallelism
npm install --maxsockets=1 --no-optional

# Build with memory optimization
export NODE_OPTIONS="--max-old-space-size=512"
npm run build

# Verify dist folder was created
ls -la dist/

# Start backend with PM2
cd backend
pm2 start server.js --name "streamin-backend"
pm2 save
pm2 startup

# Go back to root directory
cd /home/streamin/StreamIn
```

### Step 4: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/streamin

# Add this configuration:
```

```nginx
server {
    listen 80 default_server;
    server_name _;

    # Frontend (React app) - THIS SERVES YOUR WEBSITE
    location / {
        root /home/streamin/StreamIn/dist;
        try_files $uri $uri/ /index.html;

        # Add headers for better performance
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Caching for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Access-Control-Allow-Origin "*";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8080;
    }
}
```

```bash
# Remove default Nginx site (IMPORTANT!)
sudo rm /etc/nginx/sites-enabled/default

# Enable our site
sudo ln -s /etc/nginx/sites-available/streamin /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check if everything is running
sudo systemctl status nginx
pm2 status

# Your website will be accessible at: http://YOUR_DROPLET_IP
# Example: http://134.122.123.456
```

### Step 5: Setup Firewall

```bash
# Configure UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check open ports
sudo ufw status
```

### Step 6: Verify Everything Works

```bash
# Check all services are running
sudo systemctl status nginx
pm2 status

# Test your website
curl http://localhost
# Should return HTML content

# Test backend API
curl http://localhost/api/health
# Should return backend response

# Check logs if something's wrong
sudo tail -f /var/log/nginx/error.log
pm2 logs streamin-backend
```

## 🎉 **Access Your Complete Website**

Your **StreamIn website** will be accessible at:

```
http://YOUR_DROPLET_IP
```

### **What You'll See:**

✅ **Frontend:** Complete React website with movies, TV shows, search, etc.  
✅ **Backend:** Analytics working, all API calls functional  
✅ **Streaming:** All video streaming features working

### **Example URLs:**

- **Main Website:** `http://134.122.123.456`
- **Admin Dashboard:** `http://134.122.123.456/admin`
- **API Health Check:** `http://134.122.123.456/api/health`

---

## 🔧 Production Configuration

### Frontend Vite Config (vite.config.ts)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/tmdb": {
        target: "https://api.themoviedb.org/3",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb/, ""),
      },
    },
  },
});
```

### Backend Production Optimizations

**package.json scripts:**

```json
{
  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build needed for backend'"
  }
}
```

**Production server.js optimizations:**

```javascript
// Add at the top of server.js
if (process.env.NODE_ENV === "production") {
  // Trust proxy
  app.set("trust proxy", 1);

  // Serve static files (if hosting frontend from same server)
  app.use(express.static(path.join(__dirname, "../dist")));

  // Catch all handler for React Router
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}
```

---

## 🛡️ Security & Performance

### Environment Variables Security

Never commit these to your repo:

```env
# Backend .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-key
NODE_ENV=production

# Frontend .env.production
VITE_ANALYTICS_URL=https://your-api-domain.com
VITE_APP_VERSION=1.0.0
```

### Performance Optimizations

1. **Enable Gzip in Nginx:**

```nginx
# Add to nginx config
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;
```

2. **Add PM2 Ecosystem File (ecosystem.config.js):**

```javascript
module.exports = {
  apps: [
    {
      name: "streamin-backend",
      script: "server.js",
      cwd: "./backend",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
};
```

---

## 📊 Monitoring & Maintenance

### PM2 Management Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs streamin-backend

# Restart app
pm2 restart streamin-backend

# Monitor resources
pm2 monit

# Update app
git pull
npm install --production
pm2 restart streamin-backend
```

### Database Backup (MongoDB Atlas)

1. MongoDB Atlas provides automatic backups
2. For manual backup:

```bash
mongodump --uri="mongodb+srv://user:password@cluster.mongodb.net/streamin-analytics"
```

### SSL Certificate Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certificates auto-renew, but you can force renewal:
sudo certbot renew
```

---

## 🚨 Troubleshooting

### Common Issues

1. **App not starting:**

```bash
# Check PM2 logs
pm2 logs streamin-backend

# Check if port is in use
netstat -tlnp | grep :8080
```

2. **Database connection issues:**

```bash
# Test MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net/test" --username your-username
```

3. **Nginx errors:**

```bash
# Check Nginx status
sudo systemctl status nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

4. **Frontend not loading:**

- Check if `dist` folder exists and has files
- Verify Nginx configuration
- Check browser console for errors

### Performance Monitoring

```bash
# Server resources
htop
df -h
free -m

# App performance
pm2 monit
```

### VM-Specific Build Troubleshooting

If the build freezes on `react-icons` or other large dependencies:

```bash
# 1. Increase swap space (if low on RAM)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 2. Build with minimal memory usage
export NODE_OPTIONS="--max-old-space-size=512"
npm run build

# 3. Alternative: Build locally and upload (RECOMMENDED for VMs)
# Build on your local machine, then upload dist/ folder
# Use the provided upload scripts:

# Windows Batch:
# 1. Edit upload-to-droplet.bat and set your droplet IP
# 2. Double-click to run

# Windows PowerShell:
# .\upload-to-droplet.ps1 -DropletIP YOUR_DROPLET_IP

# Manual upload:
scp -r dist/ streamin@YOUR_DROPLET_IP:/home/streamin/StreamIn/

# 4. Check system resources during build
htop  # Monitor CPU/Memory usage
free -h  # Check available memory
```

---

## 💰 Cost Estimation

### DigitalOcean App Platform:

- **Basic Plan:** $5-12/month
- **Includes:** Automatic scaling, SSL, monitoring
- **Best for:** Quick deployment, minimal maintenance

### DigitalOcean Droplet:

- **Basic Droplet:** $6/month (1GB RAM, 1 CPU)
- **Recommended:** $12/month (2GB RAM, 1 CPU)
- **Additional:** Domain (~$12/year), MongoDB Atlas (free tier)

---

## 🎯 Next Steps After Deployment

1. **Set up monitoring:** Use DigitalOcean Monitoring or external services
2. **Configure backups:** Regular database and file backups
3. **CDN:** Consider adding CloudFlare for better performance
4. **Analytics:** Monitor user behavior with your analytics dashboard
5. **Updates:** Set up automated deployment pipeline

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review DigitalOcean documentation
3. Check application logs
4. Monitor server resources

**Happy Deploying! 🚀**

---

_This guide covers both App Platform (easier) and Droplet (more control) deployment methods. Choose based on your technical comfort level and requirements._
