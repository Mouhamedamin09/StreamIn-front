# 🚀 StreamIn Deployment Guide - DigitalOcean

This guide will walk you through deploying your StreamIn app (React frontend + Node.js backend) to DigitalOcean.

## 📋 Prerequisites

Before starting, make sure you have:

- DigitalOcean account
- Domain name (optional but recommended)
- Local app working correctly
- Git repository (GitHub/GitLab)

## 🛠️ Option 1: DigitalOcean App Platform (Recommended)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub/GitLab:**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create environment files:**

   **Frontend (.env.production):**

   ```env
   VITE_ANALYTICS_URL=https://your-app-name.ondigitalocean.app
   VITE_TMDB_API_KEY=374ed57246cdd0d51e7f9c7eb9e682f0
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

   **Backend (.env):**

   ```env
   NODE_ENV=production
   PORT=8080
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streamin-analytics
   ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-app-name.ondigitalocean.app
   ```

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

4. **Set Environment Variables:**

   **For Backend:**

   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your-mongodb-connection-string`
   - `ALLOWED_ORIGINS` = `https://your-frontend-url`

   **For Frontend:**

   - `VITE_ANALYTICS_URL` = `https://your-backend-url`

5. **Deploy:**
   - Review settings
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

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

# Clone repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Setup Backend
cd backend
npm install --production
cp .env.example .env
# Edit .env with your production values
nano .env

# Setup Frontend
cd ..
npm install
npm run build

# Start backend with PM2
cd backend
pm2 start server.js --name "streamin-backend"
pm2 save
pm2 startup
```

### Step 4: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/streamin

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (React app)
    location / {
        root /home/streamin/your-repo-name/dist;
        try_files $uri $uri/ /index.html;

        # Caching for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
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
# Enable site
sudo ln -s /etc/nginx/sites-available/streamin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 5: Setup Firewall

```bash
# Configure UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

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
