#!/usr/bin/env bash
# One-time setup on the VPS (run as root).
set -euo pipefail

DOMAIN="raja1.online"
DEPLOY_DIR="/root/raja-client"

export DEBIAN_FRONTEND=noninteractive

apt-get update -qq
apt-get install -y -qq git nginx certbot python3-certbot-nginx

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

mkdir -p /var/www/html
mkdir -p "${DEPLOY_DIR}"

if [ ! -f "${DEPLOY_DIR}/.env" ]; then
  echo "Create ${DEPLOY_DIR}/.env before the first deploy (see DEPLOY.md)."
fi

echo "VPS setup done."
echo "Next: add GitHub secrets VPS_HOST, VPS_USERNAME, VPS_KEY and push to main."
