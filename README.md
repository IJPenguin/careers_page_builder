# Careers Page Builder

A comprehensive careers page builder that allows companies to create, customize, and manage their careers pages with authentication, drag-and-drop editing, and SEO optimization.

## Project Structure

```
Whitcarrot_Assignment/
└── frontend/          # Next.js full-stack application
    ├── app/
    │   ├── page.tsx          # Home page
    │   ├── [slug]/           # Dynamic company routes
    │   └── api/              # Backend API routes
    ├── components/           # React components
    ├── lib/
    │   ├── auth/            # Authentication system
    │   ├── db/              # Database client
    │   └── utils/           # Utilities
    ├── types/               # TypeScript types
    └── prisma/              # Database schema
```

## Features

-   **Authentication**: Secure login system for company members
-   **Slug-based Routing**: Company-specific pages (e.g., `/acme/careers`)
-   **Drag & Drop Editor**: Visual page builder with section reordering
-   **Multiple Sections**: About, Life @ Company, Values, Locations, Perks, Programs, Testimonials, Jobs, Socials, Footer
-   **Job Management**: Add jobs individually, via CSV, or Excel upload
-   **Customization**: Color themes, fonts, images, hero templates
-   **SEO Optimized**: Meta tags, Open Graph, sitemap.xml
-   **Mobile Responsive**: Fully responsive design

## Getting Started

### Prerequisites

-   Node.js 18+ and npm
-   MongoDB (local installation or MongoDB Atlas account)

### Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Configure DATABASE_URL (MongoDB connection string) and JWT_SECRET in .env.local
# Example: DATABASE_URL="mongodb://localhost:27017/careers_builder"
# Or MongoDB Atlas: DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/careers_builder"
npx prisma generate
npx prisma db push
npm run dev
```

The application will run at `http://localhost:3000`

## Routes

-   `/<company-slug>/login` - Company login page
-   `/<company-slug>/careers` - Public careers page
-   `/<company-slug>/edit` - Careers page editor (authenticated)
-   `/<company-slug>/preview` - Preview unpublished changes (authenticated)
-   `/404` - Custom 404 page

### API Routes

-   `POST /api/auth/login` - User login
-   `GET /api/auth/me` - Get current user
-   `POST /api/auth/logout` - User logout

## Database Schema

-   **Company**: Company information and slug
-   **User**: Authentication for company members
-   **CareersPage**: Page configuration and content
-   **Job**: Job listings with full details

## Tech Stack

### Frontend

-   Next.js 16 (App Router)
-   React 19
-   TypeScript
-   Tailwind CSS
-   Prisma ORM
-   DND Kit (drag & drop)
-   React Hook Form + Zod
-   PapaParse + XLSX

## Tech Stack

-   **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
-   **Backend**: Next.js API Routes (built-in)
-   **Database**: MongoDB with Prisma ORM
-   **Authentication**: JWT with HTTP-only cookies
-   **UI Libraries**: DND Kit, React Hook Form, Zod
-   **File Parsing**: PapaParse, XLSX

## Development Notes

-   Next.js API routes handle all backend functionality (no separate server needed)
-   Prisma ORM manages MongoDB database connections
-   Use `npx prisma db push` for schema changes (MongoDB doesn't use migrations)
-   MongoDB can be local or hosted (MongoDB Atlas recommended for production)
-   All pages are SEO optimized with meta tags and structured data
-   Authentication uses JWT tokens stored in HTTP-only cookies
