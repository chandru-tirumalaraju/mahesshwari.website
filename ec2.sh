#!/bin/bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install nginx
sudo apt install nginx -y

# Clone your repository
git clone YOUR_REPO_URL
cd YOUR_REPO_NAME

# Install dependencies and build
npm install
npm run build

# Configure nginx
sudo nano /etc/nginx/sites-available/default

# Add this configuration:
# server {
#     listen 80;
#     server_name _;
#     root /var/www/html;
#     index index.html;
#     location / {
#         try_files $uri $uri/ /index.html;
#     }
# }

# Copy build files
sudo cp -r build/* /var/www/html/

# Restart nginx
sudo systemctl restart nginx
