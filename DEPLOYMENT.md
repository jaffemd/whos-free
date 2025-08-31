# Deployment Guide - Render

This guide walks you through deploying the Who's Free app to Render's free tier, including the frontend (static site), backend (web service), and PostgreSQL database.

## Prerequisites

- Render account (free tier)
- GitHub repository with your code
- Git configured locally

## Architecture Overview

The deployment consists of three Render services:
- **Static Site** (Frontend) - React app served via CDN
- **Web Service** (Backend) - Node.js/Express API server  
- **PostgreSQL Database** - Managed database instance

## Step 1: Prepare for Deployment

### 1.1 Update Backend Environment Configuration

Create production environment file in the backend directory:

```bash
cd backend
cp .env.example .env.production
```

Update `backend/.env.production`:
```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=10000
NODE_ENV=production
```

### 1.2 Update Backend Package.json Scripts

Ensure your `backend/package.json` has the correct scripts:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "postbuild": "npx prisma generate"
  }
}
```

### 1.3 Create Build Script

Create `backend/render-build.sh`:
```bash
#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm install

# Build shared types
cd ../shared
npm install
npm run build

# Return to backend and build
cd ../backend
npm run build

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

Make it executable:
```bash
chmod +x backend/render-build.sh
```

### 1.4 Update Frontend Build Configuration

Update `frontend/vite.config.ts` for production:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
```

### 1.5 Commit and Push Changes

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy PostgreSQL Database

1. **Go to Render Dashboard** → Click "New +" → Select "PostgreSQL"

2. **Configure Database:**
   - **Name**: `whos-free-db`
   - **Database**: `whos_free`
   - **User**: `whos_free_user` (or leave default)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 15 (recommended)
   - **Datadog API Key**: Leave blank
   - **Plan**: Free

3. **Click "Create Database"**

4. **Save Connection Details:**
   - Copy the **Internal Database URL** (starts with `postgresql://`)
   - You'll need this for the backend service

## Step 3: Deploy Backend Web Service

1. **Go to Render Dashboard** → Click "New +" → Select "Web Service"

2. **Connect Repository:**
   - Choose "Connect a repository" 
   - Select your GitHub repository
   - Click "Connect"

3. **Configure Web Service:**
   - **Name**: `whos-free-backend`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Set Environment Variables:**
   Click "Advanced" → Add these environment variables:
   - `DATABASE_URL`: Paste the Internal Database URL from Step 2
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)

5. **Click "Create Web Service"**

The build will start automatically. Wait for it to complete (may take 5-10 minutes).

## Step 4: Deploy Frontend Static Site

1. **Go to Render Dashboard** → Click "New +" → Select "Static Site"

2. **Connect Repository:**
   - Select your repository
   - Click "Connect"

3. **Configure Static Site:**
   - **Name**: `whos-free-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Set Environment Variables:**
   Click "Advanced" → Add:
   - `VITE_API_URL`: Your backend service URL (e.g., `https://whos-free-backend.onrender.com`)

5. **Click "Create Static Site"**

## Step 5: Update Frontend API Calls

After deployment, update your frontend to use the production API URL.

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-service.onrender.com
```

Update API calls to use the environment variable:
```typescript
const API_URL = import.meta.env.VITE_API_URL || '';

// In your fetch calls:
const response = await fetch(`${API_URL}/api/groups`, {
  // ... rest of fetch config
});
```

Commit and push these changes to trigger a new deployment.

## Step 6: Configure CORS for Production

Update `backend/src/index.ts`:
```typescript
import cors from 'cors';

// Add your frontend URL to CORS origins
app.use(cors({
  origin: [
    'http://localhost:5173', // Development
    'https://your-frontend-site.onrender.com' // Production
  ]
}));
```

## Step 7: Verify Deployment

1. **Check Backend Health:**
   - Visit `https://your-backend-service.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Database Connection:**
   - Check backend logs for successful Prisma connection
   - Try creating a test group via the API

3. **Test Frontend:**
   - Visit your frontend URL
   - Test creating a group and adding responses

## Troubleshooting

### Common Issues:

**Backend Build Fails:**
- Check that `render-build.sh` is executable
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**Database Connection Issues:**
- Verify `DATABASE_URL` environment variable is correct
- Ensure database and backend are in the same region
- Check that Prisma schema matches database

**Frontend API Errors:**
- Verify `VITE_API_URL` is set correctly  
- Check CORS configuration in backend
- Ensure backend is running and accessible

**Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- 750 compute hours/month per service
- Database limited to 1GB storage

### Checking Logs:

- **Backend Logs**: Go to your web service → "Logs" tab
- **Frontend Logs**: Go to your static site → "Logs" tab  
- **Database Logs**: Go to your PostgreSQL service → "Logs" tab

## Maintenance

### Updating the App:
1. Push changes to your GitHub repository
2. Render will automatically redeploy services
3. Check logs to ensure successful deployment

### Managing Data:
- Access database via Render's built-in query tool
- Consider implementing data cleanup for old groups
- Monitor database storage usage

## URLs After Deployment

Save these URLs for reference:
- **Frontend**: `https://your-frontend-site.onrender.com`
- **Backend**: `https://your-backend-service.onrender.com`  
- **Database**: Available via internal URL only

Your Who's Free app is now live and accessible to users worldwide!