#!/usr/bin/env bash
# One-time setup on the VPS (run as root). AlmaLinux / RHEL.
set -euo pipefail

dnf -y install epel-release
dnf -y install git nginx certbot python3-certbot-nginx curl sudo firewalld

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker
systemctl enable --now nginx

mkdir -p /var/www/html /root/city-client /root/city-server
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
printf 'include /etc/nginx/sites-enabled/*;\n' > /etc/nginx/conf.d/zz-sites-enabled.conf

if command -v getenforce >/dev/null 2>&1 && [ "$(getenforce)" != "Disabled" ]; then
  setsebool -P httpd_can_network_connect 1
fi

systemctl enable --now firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

nginx -t
systemctl reload nginx

echo "VPS setup done."
echo "Next: create /root/city-client/.env and /root/city-server/.env, then add GitHub secrets and push."
