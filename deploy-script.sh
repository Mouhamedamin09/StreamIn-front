#!/bin/bash

# StreamIn Droplet Deployment Script
# Run this on your DigitalOcean droplet as root

echo "🚀 Starting StreamIn deployment..."

# Update system
echo "📦 Updating system..."
apt update && apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
apt install nginx -y

# Install Certbot
echo "📦 Installing Certbot..."
apt install certbot python3-certbot-nginx -y

# Create app user
echo "👤 Creating app user..."
adduser --disabled-password --gecos "" streamin
usermod -aG sudo streamin

echo "✅ Server setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Switch to streamin user: su - streamin"
echo "2. Clone your repo: git clone https://github.com/your-username/your-repo-name.git"
echo "3. Follow the deployment steps in the guide"
echo ""
echo "🌐 Your droplet IP: $(curl -s ifconfig.me)"
