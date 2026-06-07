# CareerOS AI — Deployment Guide

## Architecture Overview

```
┌────────────────────────────────────────────────────┐
│                   Vercel (Recommended)              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Frontend: Next.js (Static + SSR)            │  │
│  │  URL: https://careeros-frontend.vercel.app    │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │ HTTPS                            │
└─────────────────┼──────────────────────────────────┘
                  │
┌─────────────────┼──────────────────────────────────┐
│  ┌──────────────▼───────────────────────────────┐  │
│  │  Backend: Node.js + Express + MongoDB        │  │
│  │  URL: https://careeros-backend.onrender.com   │  │
│  │  Hosted on: Render (or Docker)               │  │
│  └──────────────────────────────────────────────┘  │
│              ▲                                     │
│  ┌───────────┴───────────┐                         │
│  │   MongoDB Atlas       │                         │
│  │   (Database)          │                         │
│  └───────────────────────┘                         │
└────────────────────────────────────────────────────┘
```

## Deployment Options

| Option | Frontend | Backend | Complexity |
|--------|----------|---------|------------|
| **Recommended** | Vercel (free) | Render (free) | Low |
| Alternative | Render (free) | Render (free) | Low |
| Advanced | Docker Compose | Docker Compose | Medium |

---

## Option 1: Render (Backend) + Vercel (Frontend) — **Recommended**

### Prerequisites

1. **GitHub account** — to host your repository
2. **Vercel account** — sign up at https://vercel.com (free tier)
3. **Render account** — sign up at https://render.com (free tier)
4. **MongoDB Atlas** — sign up at https://www.mongodb.com/cloud/atlas (free tier)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then:
git remote add origin https://github.com/<your-username>/careeros-ai.git
git push -u origin main
```

### Step 2: Set up MongoDB Atlas

1. Create a free cluster on MongoDB Atlas
2. Click "Connect" → "Connect your application"
3. Copy the connection string (looks like `mongodb+srv://...`)
4. Replace `<username>` and `<password>` with your database user credentials

### Step 3: Deploy Backend to Render

1. Go to https://dashboard.render.com
2. Click **"+ New"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in the form:
   - **Name**: `careeros-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm ci --only=production`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. Add Environment Variables (see table below)
6. Click **"Create Web Service"**

#### Backend Environment Variables

| Key | Value | Required |
|-----|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `5000` | Yes |
| `MONGO_URI` | Your MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | A strong random string (generate with `openssl rand -hex 32`) | Yes |
| `CORS_ORIGIN` | Your frontend URL from Vercel (e.g., `https://careeros-frontend.vercel.app`) | Yes |
| `FRONTEND_URL` | Same as CORS_ORIGIN | Yes |
| `EMAIL_FROM` | `noreply@careeros-ai.com` | No |
| `EMAIL_HOST` | SMTP host (e.g., `smtp.gmail.com`) | No |
| `EMAIL_PORT` | SMTP port (e.g., `587`) | No |
| `EMAIL_USER` | SMTP username | No |
| `EMAIL_PASS` | SMTP password/app password | No |
| `EMAIL_SECURE` | `true` or `false` | No |

### Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Fill in the form:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js` (auto-detected)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g., `https://careeros-backend.onrender.com`)
6. Click **"Deploy"**

### Step 5: Update CORS on Backend

After deploying frontend to Vercel, get your frontend URL (e.g., `https://careeros-frontend.vercel.app`).

Update the backend environment variables on Render:
- `CORS_ORIGIN` = your Vercel frontend URL
- `FRONTEND_URL` = your Vercel frontend URL

### Step 6: Verify Deployment

- Visit your Vercel frontend URL
- Create an account and log in
- Test core features: Resume analyzer, Interview coach, Skill gap analysis, Roadmap generator

---

## Option 2: Deploy Both to Render

If you prefer to keep everything on one platform:

1. Create **two Web Services** on Render:
   - One for `backend/` (Node, port 5000)
   - One for `frontend/` (Node, port 3000)

2. Follow the same steps as in Option 1, but set:
   - `CORS_ORIGIN` = your frontend Render URL
   - `NEXT_PUBLIC_API_URL` = your backend Render URL

3. Use the `render.yaml` file in the root of your repository for **infrastructure as code**:
   - Connect your repo to Render
   - Render will automatically detect `render.yaml` and provision both services

---

## Option 3: Docker Deployment (Advanced)

### Prerequisites
- Docker and Docker Compose installed on your server

### Local Docker Development

```bash
# Build and run both services
docker compose up --build

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### Production Docker Deployment

Create a `docker-compose.prod.yml` or set environment variables:

```bash
# Set environment variables
export CORS_ORIGIN=https://yourdomain.com
export FRONTEND_URL=https://yourdomain.com

# Build and run
docker compose up --build -d

# View logs
docker compose logs -f
```

### Deploy to Cloud (AWS ECS, GCP Cloud Run, DigitalOcean)

1. Push Docker images to a container registry:
   ```bash
   docker tag careeros-backend:latest <your-registry>/careeros-backend:latest
   docker push <your-registry>/careeros-backend:latest

   docker tag careeros-frontend:latest <your-registry>/careeros-frontend:latest
   docker push <your-registry>/careeros-frontend:latest
   ```

2. Deploy using your cloud provider's container service

---

## Production Checklist

### Security

- [ ] `JWT_SECRET` is a strong 64-char hex string (not the default)
- [ ] `MONGO_URI` does NOT contain the default password
- [ ] CORS is restricted to your actual frontend domain
- [ ] Rate limiting is enabled (already configured in backend)
- [ ] Helmet security headers are enabled (already configured)
- [ ] `.env` files are NOT committed to git (already in `.gitignore`)

### Environment Variables

- [ ] All required `sync: false` variables in `render.yaml` are set on Render dashboard
- [ ] `NEXT_PUBLIC_API_URL` matches your backend deployment URL
- [ ] `CORS_ORIGIN` matches your frontend deployment URL
- [ ] `FRONTEND_URL` matches your frontend deployment URL

### Database

- [ ] MongoDB Atlas cluster is on a free/paid tier (not a local instance)
- [ ] Database user has strong password
- [ ] Network access allows connections from Render (IP: 0.0.0.0/0 temporarily, or specific Render IPs)
- [ ] Connection string uses `retryWrites=true&w=majority` (already configured)

### Performance

- [ ] Frontend builds with `next build` (static optimization where possible)
- [ ] Backend uses production dependencies only (`npm ci --only=production`)
- [ ] Rate limiter is tuned for production needs (100 req/15 min by default)

---

## Troubleshooting

### Backend Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| `MONGO_URI is not defined` | Missing env var | Add MONGO_URI in Render dashboard |
| `Origin not allowed by CORS` | Wrong CORS_ORIGIN | Update CORS_ORIGIN to match frontend URL |
| Health check failing | Server not starting in time | Increase health check timeout, or check logs |

### Frontend Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Blank page / 500 error | Missing NEXT_PUBLIC_API_URL | Add env var in Vercel project settings |
| API calls fail | CORS misconfiguration | Verify CORS_ORIGIN on backend matches frontend |
| Build fails | Missing dependencies | Run `npm ci` locally to verify lockfile is valid |

### Logs

- **Render**: Go to your service dashboard → "Logs" tab
- **Vercel**: Go to your project → "Deployments" → click deployment → "Functions" logs
- **Docker**: `docker compose logs -f [service-name]`

---

## File Reference

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Docker image for backend Node.js API |
| `frontend/Dockerfile` | Multi-stage Docker image for Next.js frontend |
| `docker-compose.yml` | Orchestrates both services locally |
| `render.yaml` | Infrastructure-as-code for Render deployment |
| `frontend/vercel.json` | Vercel deployment configuration |
| `backend/.env.example` | Template for backend environment variables |
| `.dockerignore` | Excludes unnecessary files from Docker builds |