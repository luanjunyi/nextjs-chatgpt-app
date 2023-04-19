#!/bin/bash
REPO_DIR="/home/ubuntu/nextjs-chatgpt-app"
COMMIT_ID=$1

cd $REPO_DIR
git fetch origin
git cherry-pick $COMMIT_ID

# Install any new npm packages
echo "=========== Building the NextJS app ==========="
npm ci
npm run build

echo "=========== Restarting whatgtp-web via pm2 ==========="

sudo pm2 restart whatgpt-web
