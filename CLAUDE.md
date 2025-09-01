# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Who's Free" is a simple availability tracking app for groups using a React frontend and Node.js backend. The application displays red/green availability status for group members on specific dates through a shareable URL system.

## Development Commands

This is a monorepo managed with npm workspaces. Use these commands from the root directory:

- **Development**: `npm run dev` - Starts both frontend and backend in parallel
- **Build**: `npm run build` - Builds shared, backend, then frontend packages in sequence
- **Production**: `npm run start` - Starts the backend server in production mode

Individual workspace commands:
- `npm run dev --workspace=frontend` - Start React dev server only
- `npm run dev --workspace=backend` - Start Node.js API server only
- `npm run build --workspace=shared` - Build shared types/utilities

## IMPORTANT: Always Test Your Changes

**Before completing any task, ALWAYS run these commands to ensure code quality:**

1. **TypeScript Check**: `npx tsc --noEmit --workspace=frontend` - Check for TypeScript errors without building
2. **Build Test**: `npm run build` - Ensure the entire project builds successfully 
3. **Local Testing**: `npm run dev` - Test functionality locally before deployment

**Never skip this step** - TypeScript errors and build failures will prevent deployment and break the application. Always validate your changes compile and run correctly.

## Architecture

### Workspace Structure
```
/
├── frontend/     # React app with TypeScript + Mantine UI
├── backend/      # Node.js/Express API with TypeScript + Prisma ORM
└── shared/       # Shared TypeScript types and utilities
```

### Technology Stack
- **Frontend**: React, TypeScript, Mantine UI components, React Router, React Context API for state
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, Zod validation
- **Database**: PostgreSQL with UUID primary keys and timestamp tracking
- **Deployment**: Vercel (static site + serverless functions + PostgreSQL)

### Key Database Tables
- **groups**: Stores group information with name, description, date, and UUIDs
- **responses**: User availability responses linked to groups with unique constraint on (group_id, user_name)

### API Design
RESTful endpoints under `/api/`:
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group with all responses
- `POST /api/groups/:id/responses` - Add/update user response
- `GET /api/groups/:id/responses` - Get all responses for group

### Authentication
No authentication system - users enter names directly. Groups are protected only by UUID knowledge.

## Development Notes

- **Phase 1 & 2 Complete**: Full MVP with polished UI/UX
- **UI Framework**: Switched from Tailwind CSS to Mantine UI for better component library
- **Dark Mode**: Full dark/light mode support with system preference detection
- **Mobile Responsive**: Mobile-first design with responsive breakpoints
- **Form Validation**: Client-side validation with user feedback notifications
- **Error Handling**: Comprehensive error boundaries and loading states
- **Share Functionality**: Native Web Share API with clipboard fallback
- **Database**: SQLite for development, PostgreSQL for production (Vercel Postgres)
- **Deployment**: Ready for Vercel deployment with serverless functions (see DEPLOYMENT.md)

## Recent Updates

- Dark mode toggle with system preference detection
- Enhanced share modal with native sharing capabilities
- Loading skeletons for better perceived performance
- Form validation with detailed error messages
- Responsive design optimizations for mobile devices
- Fixed DatePicker weekend styling issues
- Added favicon with custom checkmark icon
- Comprehensive error handling and user feedback