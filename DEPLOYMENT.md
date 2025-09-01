# Deployment Guide - Vercel

This guide walks you through deploying the Who's Free app to Vercel, including the frontend (static site), backend (serverless functions), and PostgreSQL database via Vercel Postgres.

## Prerequisites

- Vercel account (free tier)
- GitHub repository with your code
- Git configured locally

## Architecture Overview

The deployment consists of:
- **Frontend** - React app served via Vercel's CDN
- **Backend API** - Node.js serverless functions
- **PostgreSQL Database** - Vercel Postgres (or external provider like Neon/Supabase)

## Step 1: Push Code to GitHub

Ensure all your code is committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Create Vercel Project

1. **Go to Vercel Dashboard** → Click "New Project"

2. **Import Repository:**
   - Select "Import Git Repository" 
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - **Project Name**: `whos-free`
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Click "Deploy"**

The initial deployment will start. We'll configure the database and API routes next.

## Step 3: Set Up Database

**Option A: Vercel Postgres (Recommended)**

1. **In your Vercel project** → Go to "Storage" tab
2. **Click "Create Database"** → Select "Postgres"
3. **Name**: `whos-free-db`
4. **Click "Create"**
5. **Copy the connection string** for environment variables

**Option B: External Database (Neon/Supabase)**

If you prefer an external provider:
- **Neon**: https://neon.tech (free tier: 3GB)
- **Supabase**: https://supabase.com (free tier: 500MB)

## Step 4: Set Up API Routes

Since Vercel uses serverless functions, we need to move our backend API to the `api/` directory in the project root.

1. **Create API directory structure:**
   ```
   api/
   ├── groups/
   │   ├── index.ts          # GET /api/groups, POST /api/groups
   │   └── [id]/
   │       ├── index.ts      # GET /api/groups/[id]
   │       └── responses/
   │           └── index.ts  # POST /api/groups/[id]/responses
   └── health.ts             # GET /api/health
   ```

2. **Configure Environment Variables:**
   - Go to your Vercel project → "Settings" → "Environment Variables"
   - Add:
     - `DATABASE_URL`: Your database connection string
     - `NODE_ENV`: `production`

## Step 5: Update Frontend Configuration

1. **Set Frontend Environment Variables:**
   - In Vercel project → "Settings" → "Environment Variables"
   - Add: `VITE_API_URL`: Leave empty (will use relative paths)

2. **The frontend is already configured** to use relative API paths for Vercel deployment

## Step 6: Verify Deployment

1. **Check API Health:**
   - Visit `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Database Connection:**
   - Check Vercel function logs for Prisma connection
   - Try creating a test group via the frontend

3. **Test Frontend:**
   - Visit `https://your-project.vercel.app`
   - Test creating a group and adding responses

## Troubleshooting

### Common Issues:

**API Function Fails:**
- Check Vercel function logs in dashboard
- Verify all dependencies are in `package.json`
- Ensure Prisma client is generated correctly

**Database Connection Issues:**
- Verify `DATABASE_URL` environment variable is correct
- Check that Prisma schema is deployed
- Run `npx prisma db push` manually if needed

**Frontend API Errors:**
- Check browser network tab for API call errors
- Verify API routes are accessible
- Check Vercel function logs for backend errors

**Free Tier Limitations:**
- 100GB bandwidth per month
- 1000 serverless function invocations per day
- Function timeout: 10 seconds (Hobby), 15 seconds (Pro)

### Checking Logs:

- **Function Logs**: Vercel Dashboard → Your Project → "Functions" tab
- **Build Logs**: Vercel Dashboard → "Deployments" → Click on a deployment
- **Real-time Logs**: Use Vercel CLI: `vercel logs`

## Database Migrations

When you update your Prisma schema:

1. **Push schema changes:**
   ```bash
   npx prisma db push
   ```

2. **Or create and run migrations:**
   ```bash
   npx prisma migrate dev --name your_migration_name
   npx prisma migrate deploy  # for production
   ```

## Maintenance

### Updating the App:
1. Push changes to your GitHub repository
2. Vercel automatically redeploys on every push
3. Check deployment status in Vercel dashboard

### Managing Data:
- Use Prisma Studio: `npx prisma studio`
- Access database via your provider's dashboard
- Consider implementing data cleanup for old groups

## URLs After Deployment

Save these URLs for reference:
- **Application**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api/*`
- **Database**: Access via your database provider dashboard

Your Who's Free app is now live and accessible to users worldwide!