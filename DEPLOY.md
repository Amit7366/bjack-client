# Deploy client to VPS (banglajackpot.online)

VPS: `103.72.65.213`  
DNS A record: `banglajackpot.online` → `103.72.65.213` (Cloudflare **DNS only** / grey cloud until SSL is issued)

## 1. One-time VPS setup

SSH in:

```bash
ssh root@103.72.65.213
```

Install Docker, Nginx, Certbot, Git:

```bash
apt-get update
apt-get install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://get.docker.com | sh
mkdir -p /root/city-client /root/city-server /var/www/html
```

Open firewall ports **22**, **80**, and **443** (in the VPS panel and/or `ufw`).

## 2. Deploy SSH key for GitHub Actions

On your **local Mac** (not the VPS):

```bash
ssh-keygen -t ed25519 -C "city-deploy" -f ~/.ssh/city_deploy -N ""
ssh-copy-id -i ~/.ssh/city_deploy.pub root@103.72.65.213
ssh -i ~/.ssh/city_deploy root@103.72.65.213 "echo ok"
```

## 3. GitHub repo secrets (city-client)

In **https://github.com/Amit7366/city-client** → **Settings → Secrets and variables → Actions**

| Secret | Value |
|---|---|
| `VPS_HOST` | `103.72.65.213` |
| `VPS_USERNAME` | `root` |
| `VPS_KEY` | full contents of `~/.ssh/city_deploy` (the **private** key, including `BEGIN`/`END` lines) |

Use the **same** three secrets on `city-server`.

## 4. Create `.env` on the VPS (optional before first client deploy)

The workflow creates a default `.env` if missing. To include game secrets from the start:

```bash
ssh -i ~/.ssh/city_deploy root@103.72.65.213
nano /root/city-client/.env
```

```env
API_URL=https://api.banglajackpot.online
NEXT_PUBLIC_SOCKET_URL=https://api.banglajackpot.online
NEXT_PUBLIC_SITE_URL=https://banglajackpot.online
GAME_LAUNCH_URL=https://apivexo.com/api/game/v1/gamelaunch
GAME_API_SECRET=
GAME_API_PREFIX=
```

## 5. Push to `main`

From `client/`:

```bash
git add -A
git commit -m "Configure Docker CI/CD for banglajackpot.online"
git push origin main
```

Pushing `main` starts **Actions → Deploy client**. You can also run it from **Actions → Deploy client → Run workflow**.

## 6. Verify

```bash
curl -I https://banglajackpot.online
```

Login/API will fail until the server is deployed on `api.banglajackpot.online`.
