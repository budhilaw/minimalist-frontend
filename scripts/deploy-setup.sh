#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Portfolio VPS Setup Script${NC}"
echo "================================"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Configuration
DOMAIN=""
APP_DIR="/var/www/portfolio"
BACKUP_DIR="/var/backups/portfolio"
NGINX_SITE="portfolio"

# Get domain from user
read -p "Enter your domain name (e.g., example.com): " DOMAIN
if [[ -z "$DOMAIN" ]]; then
    echo -e "${RED}❌ Domain name is required${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}📦 Installing required packages...${NC}"
sudo apt install -y nginx nodejs npm git rsync curl ufw certbot python3-certbot-nginx

echo -e "${YELLOW}🔥 Setting up UFW firewall...${NC}"
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

echo -e "${YELLOW}📁 Creating directories...${NC}"
sudo mkdir -p $APP_DIR
sudo mkdir -p $BACKUP_DIR
sudo chown -R www-data:www-data $APP_DIR
sudo chown -R www-data:www-data $BACKUP_DIR

echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/$NGINX_SITE > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $APP_DIR;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    sudo systemctl reload nginx
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    exit 1
fi

echo -e "${YELLOW}🔒 Setting up SSL certificate...${NC}"
echo "Make sure your domain DNS is pointing to this server before continuing."
read -p "Press Enter to continue with SSL setup, or Ctrl+C to cancel..."

if sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN; then
    echo -e "${GREEN}✅ SSL certificate installed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  SSL setup failed. You can run this later with:${NC}"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

echo -e "${YELLOW}🔧 Setting up deployment user...${NC}"
if ! id "deploy" &>/dev/null; then
    sudo useradd -m -s /bin/bash deploy
    sudo usermod -aG sudo deploy
    sudo mkdir -p /home/deploy/.ssh
    sudo chown deploy:deploy /home/deploy/.ssh
    sudo chmod 700 /home/deploy/.ssh
    echo -e "${GREEN}✅ Deploy user created${NC}"
else
    echo -e "${YELLOW}⚠️  Deploy user already exists${NC}"
fi

echo -e "${YELLOW}📋 Creating a test index.html...${NC}"
sudo tee $APP_DIR/index.html > /dev/null <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - Coming Soon</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Portfolio Website</h1>
        <p>Your portfolio website is being deployed!</p>
        <p>This page will be replaced once the deployment is complete.</p>
    </div>
</body>
</html>
EOF

sudo chown www-data:www-data $APP_DIR/index.html

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo "================================"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Add your SSH public key to GitHub secrets as VPS_SSH_KEY"
echo "2. Add these secrets to your GitHub repository:"
echo "   - VPS_HOST: $(curl -s ifconfig.me)"
echo "   - VPS_USER: deploy"
echo "   - VPS_APP_DIR: $APP_DIR"
echo "   - VPS_BACKUP_DIR: $BACKUP_DIR"
echo "   - VPS_WEB_USER: www-data"
echo ""
echo -e "${YELLOW}🔑 SSH Key Setup:${NC}"
echo "Run this command to copy your SSH key to the deploy user:"
echo "ssh-copy-id deploy@$(curl -s ifconfig.me)"
echo ""
echo -e "${YELLOW}🌐 Website:${NC}"
echo "Your website should be accessible at: https://$DOMAIN"
echo ""
echo -e "${GREEN}✅ VPS is ready for deployment!${NC}" 