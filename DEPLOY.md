# Deploy client to VPS (raja1.online)

DNS A record: `raja1.online` → `187.53.128.57`

API is not deployed yet. Socket/API calls will use `https://api.raja1.online` until the server is live.

## 1. One-time VPS setup

SSH in:

```bash
ssh root@187.53.128.57
```

Install Docker, Nginx, Certbot, Git:

```bash
apt-get update
apt-get install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://get.docker.com | sh
```

Open firewall ports **22**, **80**, and **443** (in the VPS panel and/or `ufw`).

## 2. Deploy SSH key for GitHub Actions

On your **local Mac** (not the VPS):

```bash
ssh-keygen -t ed25519 -C "raja-client-deploy" -f ~/.ssh/raja_deploy -N ""
```

Copy the **public** key to the VPS:

```bash
ssh-copy-id -i ~/.ssh/raja_deploy.pub root@187.53.128.57
```

Test it:

```bash
ssh -i ~/.ssh/raja_deploy root@187.53.128.57 "echo ok"
```

## 3. GitHub repo secrets

Repo: `https://github.com/Amit7366/raja-client`  
**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|---|---|
| `VPS_HOST` | `187.53.128.57` |
| `VPS_USERNAME` | `root` |
| `VPS_KEY` | full contents of `~/.ssh/raja_deploy` (the **private** key, including `BEGIN`/`END` lines) |

## 4. Push these deploy files

From `client/`:

```bash
git add docker-compose.yml Dockerfile .github/workflows/deploy.yaml deploy DEPLOY.md
git commit -m "Add Docker CI/CD for raja1.online"
git push origin main
```

Pushing `main` starts the deploy. You can also run it from **Actions → Deploy client → Run workflow**.

## 5. After the first deploy (optional game secrets)

SSH in and edit `/root/raja-client/.env`:

```bash
ssh root@187.53.128.57
nano /root/raja-client/.env
```

Add `GAME_API_SECRET` and `GAME_API_PREFIX`, then:

```bash
cd /root/raja-client
docker compose up -d --build
```

## 6. Verify

```bash
curl -I https://raja1.online
```

Open https://raja1.online in a browser.

Login/API will fail until the server is deployed on `api.raja1.online`.
