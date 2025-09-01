# Who's Free - Implementation Plan

## Overview

A simple web application that displays availability status (red/green light system) for groups of friends/family on specific dates. Users can create groups, share unique URLs, and view everyone's availability in a simple table format.

## Technical Architecture

### Project Structure
- **Repository**: Monorepo containing both frontend and backend
- **Structure**: 
  ```
  /
  ├── frontend/     # React application
  ├── backend/      # Node.js/Express API
  └── shared/       # Shared types and utilities
  ```

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Mantine UI for modern, consistent styling and components
- **State Management**: React Context API (sufficient for this simple app)
- **Routing**: React Router for client-side navigation
- **HTTP Client**: Fetch API or Axios for backend communication
- **Authentication**: None (users enter name directly, no login required)

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript for type safety
- **Database**: PostgreSQL (robust, well-supported across deployment platforms)
- **ORM**: Prisma (excellent TypeScript integration, migrations, and dev experience)
- **Validation**: Zod for request/response validation
- **CORS**: Enabled for frontend-backend communication
- **Authentication**: None initially (can be added later)

## Database Schema

### Groups Table
```sql
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Responses Table
```sql
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    is_available BOOLEAN NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_name)
);
```

## API Endpoints

### Group Management
- `POST /api/groups` - Create new group
  - Body: `{ name: string, description: string, date: string }`
  - Returns: `{ id: string, name: string, description: string, date: string }`

- `GET /api/groups/:id` - Get group details with all responses
  - Returns: `{ group: GroupData, responses: ResponseData[] }`

### Response Management
- `POST /api/groups/:id/responses` - Add/update user response
  - Body: `{ userName: string, isAvailable: boolean, message?: string }`
  - Returns: `{ success: boolean, response: ResponseData }`

- `GET /api/groups/:id/responses` - Get all responses for a group
  - Returns: `ResponseData[]`

## Frontend Implementation Details

### Key Components
1. **CreateGroupPage** - Form to create new groups
2. **GroupViewPage** - Display group info and responses table
3. **AddResponseModal** - Form for users to add their availability
4. **ResponseTable** - Grid showing all user responses with color coding
5. **ShareLink** - Component to display and copy group URL

### Routing Structure
```
/ - Landing page with create group form
/group/abc123 - Group view page with responses (format: /group/:id)
```

### UI/UX Features
- Responsive design (mobile-first)
- Copy-to-clipboard for sharing URLs
- Manual refresh button to update response table
- Loading states and error handling
- Form validation with user feedback

## Deployment Plan

### Vercel (Selected Option)
**Frontend**: Vercel Static Site
- Free static site hosting with global CDN
- Automatic builds from Git
- Custom domains supported
- Excellent performance optimization

**Backend**: Vercel Serverless Functions
- Serverless API routes in `/api` directory
- Auto-scaling and zero cold starts
- 100GB bandwidth and 1000 function invocations per day (free tier)
- TypeScript support out of the box

**Database**: Vercel Postgres or External Provider
- Vercel Postgres: Native integration with generous free tier
- Alternative: Neon, Supabase, or PlanetScale for PostgreSQL
- Seamless environment variable integration

**Why Vercel**:
- Serverless architecture (no server management)
- Excellent developer experience with zero configuration
- Automatic HTTPS and global CDN
- Perfect for React/Next.js applications
- No cold start issues for typical usage patterns

**Considerations**:
- Function execution time limits (10s hobby, 15s pro)
- Designed for serverless workloads
- Database connections need to be managed efficiently
- Free tier limitations on function invocations

## Implementation Phases

### Phase 1: Core Functionality (MVP)
1. Set up development environment
2. Create basic React frontend with routing
3. Build group creation form
4. Implement group view with response table
5. Create backend API with all endpoints
6. Set up database with migrations

### Phase 2: Polish & UX
1. Add responsive design
2. Implement error handling and loading states
3. Add form validation
4. Create share functionality
5. Style with consistent design system

### Phase 3: Deployment
1. Set up Vercel account and project
2. Configure Vercel Postgres database (or external provider)
3. Deploy serverless API functions to `/api` directory
4. Deploy frontend as Vercel static site
5. Configure environment variables for database connection
6. Set up automatic deployments from Git
7. Test production deployment

### Phase 4: Data Management
1. Analyze data retention requirements
2. Implement data cleanup strategy for expired groups
3. Add admin functionality for data management
4. Set up monitoring for database usage

## Development Considerations

### Security
- Input validation on both client and server
- SQL injection prevention via Prisma ORM
- Rate limiting for API endpoints
- CORS configuration for production

### Performance
- Database indexing on frequently queried fields
- Caching for group data
- Optimized bundle size
- Image optimization if needed

### Scalability
- Database connection pooling
- Horizontal scaling capability
- CDN for static assets
- Monitoring and logging setup

## Next Steps

With Vercel selected as the deployment platform, the implementation can proceed with:

1. **Development Environment Setup**: Initialize monorepo with React frontend and serverless API functions
2. **Database Design**: Implement Prisma schema and migrations for the groups and responses tables  
3. **API Development**: Build serverless functions in `/api` directory for group and response management
4. **Frontend Implementation**: Create React components with Mantine UI styling and manual refresh functionality
5. **Vercel Deployment**: Configure project and deploy to production with serverless architecture
6. **Data Management**: Plan and implement data retention policies

The Vercel platform provides excellent developer experience with zero configuration deployment, automatic scaling, and perfect integration for React applications with serverless backend functions.