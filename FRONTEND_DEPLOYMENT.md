# 🚀 StreamIn Frontend Deployment Guide

## 📋 Prerequisites

- ✅ Node.js and npm installed
- ✅ SSH access to your DigitalOcean droplet
- ✅ SSH key configured for `streamin@159.89.137.41`
- ✅ Backend server running at `https://streamin-server-feyfo.ondigitalocean.app`

## 🏗️ Build & Deploy Process

### Option 1: Automated Deployment (Recommended)

#### Windows Batch File

```bash
# Double-click or run in Command Prompt
deploy-frontend.bat
```

#### Windows PowerShell

```powershell
# Run in PowerShell
.\deploy-frontend.ps1
```

### Option 2: Manual Deployment

#### Step 1: Build Production Version

```bash
npm run build
```

#### Step 2: Upload to Droplet

```bash
scp -r dist/* streamin@159.89.137.41:/home/streamin/StreamIn/
```

## 🌐 Access Your App

After successful deployment, your StreamIn app will be available at:
**http://159.89.137.41**

## 🔧 Configuration Details

### API Endpoints

- **Analytics**: `https://streamin-server-feyfo.ondigitalocean.app/api/analytics`
- **Admin Dashboard**: `https://streamin-server-feyfo.ondigitalocean.app/api/admin`
- **Health Check**: `https://streamin-server-feyfo.ondigitalocean.app/health`

### Environment Variables

The app is configured to use the DigitalOcean API server by default. If you need to override:

```bash
# Create .env.local file
VITE_ANALYTICS_URL=https://your-custom-api.com
```

## 📁 Deployment Structure

```
/home/streamin/StreamIn/
├── index.html              # Main HTML file
├── assets/                 # CSS, JS, and other assets hey what u want
├── sreamIn.png            # Dark mode logo
├── streamIn-dark.png      # Light mode logo
├── play.png               # Play button icon
├── favicon.ico            # Favicon

```

## 🚨 Troubleshooting

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Verify Node.js version compatibility

### Upload Errors

- Check SSH key configuration
- Verify droplet IP address: `159.89.137.41`
- Ensure SSH access: `ssh streamin@159.89.137.41`

### Runtime Errors

- Check browser console for API errors
- Verify backend server is running
- Test API endpoints directly

## 🔄 Update Process

To update your deployed app:

1. Make code changes
2. Run `npm run build`
3. Upload new `dist/` folder to droplet
4. Clear browser cache if needed

## 📊 Monitoring

- **Analytics**: Available at `/admin` (if configured)
- **Server Health**: `https://streamin-server-feyfo.ondigitalocean.app/health`
- **Error Logs**: Check browser console and network tab

## 🎯 Next Steps

1. **Test the deployment** by visiting `http://159.89.137.41`
2. **Verify all features** work correctly
3. **Check analytics** are being tracked
4. **Monitor performance** and user experience

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify backend server status
3. Review browser console errors
4. Test API endpoints directly

---

**Happy Streaming! 🎬✨**
