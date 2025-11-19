# Staffing Management App

A web-based application for managing temporary staffing, events, and feedback collection.

## Features

- **Role-Based Access Control**: Admin, Project Manager, and Supervisor roles
- **Event Management**: Create and manage multiple events/workspaces
- **Staff Database**: Import and manage staff from Google Sheets (5000+ staff)
- **Assignment System**: Project Managers assign staff to Supervisors
- **Feedback Collection**: Mobile-friendly feedback forms for Supervisors
- **Mobile-First Design**: Optimized for phone use by Supervisors

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd staffing-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Seed the database with a default admin user:
```bash
npm run db:seed
```
   This creates an admin user with:
   - Email: `admin@example.com`
   - Password: `admin123`
   - **IMPORTANT**: Change this password after first login!

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Admin

1. Log in with your admin account
2. **Users**: Create and manage user accounts with roles
3. **Events**: Create events and assign Project Managers/Supervisors
4. **Staff**: Import staff from Google Sheets

### Project Manager

1. View assigned events
2. Select staff from the database
3. Assign staff to Supervisors for each event

### Supervisor

1. View assigned staff list
2. Submit feedback for each staff member (multiple feedback allowed)
3. Mobile-optimized interface for phone use

## Google Sheets Import

To import staff from Google Sheets:

1. Set up Google Service Account credentials (optional for testing - you can make sheet publicly readable)
2. Get your Google Sheets ID from the URL
3. Go to Admin > Staff > Import from Google Sheets
4. Enter the Spreadsheet ID and range (e.g., `A1:Z1000`)

## Database Schema

- **User**: Authentication and roles
- **Staff**: Staff database (imported from Google Sheets)
- **Event**: Events/workspaces
- **EventUser**: User assignments to events
- **Assignment**: Staff assigned to supervisors for events
- **Feedback**: Supervisor feedback submissions

## Development

```bash
# Run development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Build for production
npm run build
```

## Production Deployment

1. Set up a PostgreSQL database (Vercel Postgres, Supabase, Railway, etc.)
2. Update `DATABASE_URL` in production environment
3. Set `NEXTAUTH_URL` to your production domain
4. Deploy to Vercel or your preferred platform

## Future Enhancements

- Phase 2: ClickUp API integration (replace Google Sheets)
- Advanced reporting and analytics
- Real-time notifications
- Bulk assignment features
