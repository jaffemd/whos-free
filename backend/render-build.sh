#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Build and install shared types
echo "🔧 Building shared types..."
cd ../shared
npm install
npm run build

# Return to backend and build
echo "🏗️ Building backend..."
cd ../backend
npm run build

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations (only if DATABASE_URL is set)
if [ ! -z "$DATABASE_URL" ]; then
  echo "🔄 Running database migrations..."
  npx prisma db push --accept-data-loss
else
  echo "⚠️ DATABASE_URL not set, skipping database setup"
fi

echo "✅ Build process completed successfully!"