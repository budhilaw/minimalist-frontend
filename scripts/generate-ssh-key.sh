#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔑 SSH Key Generator for GitHub CI/CD${NC}"
echo "==========================================="

# Get email from user
read -p "Enter your email for SSH key: " EMAIL
if [[ -z "$EMAIL" ]]; then
    echo -e "${RED}❌ Email is required${NC}"
    exit 1
fi

# SSH key file name
SSH_KEY_NAME="portfolio_deploy"
SSH_KEY_PATH="$HOME/.ssh/$SSH_KEY_NAME"

echo -e "${YELLOW}🔐 Generating SSH key pair...${NC}"
ssh-keygen -t rsa -b 4096 -C "$EMAIL" -f "$SSH_KEY_PATH" -N ""

echo -e "${GREEN}✅ SSH key pair generated!${NC}"
echo ""
echo -e "${BLUE}📋 Files created:${NC}"
echo "Private key: $SSH_KEY_PATH"
echo "Public key: $SSH_KEY_PATH.pub"
echo ""

echo -e "${YELLOW}📌 GitHub Secrets Setup:${NC}"
echo "Go to your GitHub repository → Settings → Secrets and variables → Actions"
echo ""
echo -e "${BLUE}Add this as VPS_SSH_KEY secret:${NC}"
echo "----------------------------------------"
cat "$SSH_KEY_PATH"
echo "----------------------------------------"
echo ""

echo -e "${YELLOW}🖥️  VPS Setup:${NC}"
echo "Copy this public key to your VPS deploy user:"
echo ""
echo -e "${BLUE}Public key content:${NC}"
echo "----------------------------------------"
cat "$SSH_KEY_PATH.pub"
echo "----------------------------------------"
echo ""

echo -e "${YELLOW}🚀 Commands to run on your VPS:${NC}"
echo ""
echo "# 1. Create deploy user (if not exists)"
echo "sudo useradd -m -s /bin/bash deploy"
echo "sudo usermod -aG sudo deploy"
echo ""
echo "# 2. Set up SSH for deploy user"
echo "sudo mkdir -p /home/deploy/.ssh"
echo "sudo chmod 700 /home/deploy/.ssh"
echo "sudo chown deploy:deploy /home/deploy/.ssh"
echo ""
echo "# 3. Add public key (replace YOUR_PUBLIC_KEY with the key above)"
echo "echo 'YOUR_PUBLIC_KEY' | sudo tee /home/deploy/.ssh/authorized_keys"
echo "sudo chmod 600 /home/deploy/.ssh/authorized_keys"
echo "sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys"
echo ""

echo -e "${YELLOW}🧪 Test SSH connection:${NC}"
echo "ssh -i $SSH_KEY_PATH deploy@YOUR_VPS_IP"
echo ""

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}💡 Quick Setup Alternative:${NC}"
echo "You can also use ssh-copy-id for easier setup:"
echo "ssh-copy-id -i $SSH_KEY_PATH.pub deploy@YOUR_VPS_IP" 