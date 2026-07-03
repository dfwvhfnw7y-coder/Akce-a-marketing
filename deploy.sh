#!/bin/bash
# deploy.sh — automatický deploy
# Použití: bash deploy.sh "popis změny"

MSG=${1:-"aktualizace"}
BUILD_TIME=$(date "+%Y-%m-%d %H:%M")
FILE="/workspaces/Akce-a-marketing/akce-sw/src/CampaignApp6.jsx"

echo "🚀 Deployuji: $MSG"
echo "⏰ Build čas: $BUILD_TIME"

# Aktualizovat build čas v souboru
sed -i "s/const APP_BUILD = \"[^\"]*\";/const APP_BUILD = \"$BUILD_TIME\";/" $FILE

# Git push
cd /workspaces/Akce-a-marketing
git add akce-sw/src/CampaignApp6.jsx
git commit -m "$MSG · $BUILD_TIME"
git push

# Vercel deploy
cd /workspaces/Akce-a-marketing/akce-sw
npx vercel --prod

echo "✅ Hotovo!"
echo "🌐 https://akce-sw.vercel.app"
