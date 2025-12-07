# TECH SPEC

## Assumptions

Main assumptions that I made were:

-   Each company operates on their own and has their own careers page. So there is no multi-company support from one account.

-   I used JWT authentication where each user belong to their own company.

-   I stored all the data in MongoDB because its easy/fast and flexible to work with. But other databases can also be used.

-   Company slugs will be unique and will be used to identify each company's careers page.

-   Last assumption that was made is all the content sections are optional and all the assets and media will be uploaded by the company itself and the links will be hosted here.

## Architecture

The application is built using Next.js with the new app directory structure. Main components are:

-   Next JS
-   React 19
-   Typescript
-   Tailwind CSS
-   @dnd-kit (drag and drop)
-   Zod (for schema validation)
-   MongoDB
-   JWT
-   Gemini API

### System Design

-   Client Layer:

    -   Career Page (Public)
    -   Auth UI (Public)
    -   Editor UI (Private)

-   Routing Layer:

    -   Next JS App Router which has SSR (Server Side Rendered Pages for SER + RSC)
    -   API Routes (REST API)
    -   Middleware (for auth)

-   Business Logic Layer:

    -   Auth Service
    -   Content Editor
    -   Job Manager

-   Data Layer:

    -   MongoDB Database
    -   Prisma ORM

-   MongoDB Database
    -   Companies
    -   Jobs
    -   Users
    -   Careers Pages

## Schema

### Company

```prisma
model Company {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  slug      String   @unique              // URL-safe identifier
  name      String                        // Display name
  logo      String?                       // Logo URL (optional)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users       User[]                      // One-to-many
  careersPage CareersPage?                // One-to-one
  jobs        Job[]                       // One-to-many

  @@map("companies")
}
```

**Relationships:**

-   One company has many users
-   One company has one careers page
-   One company has many jobs

**Indexes:**

-   `slug` (unique) - Fast lookup by URL

#### User

```prisma
model User {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  email        String   @unique             // Authentication identifier
  passwordHash String                       // bcrypt hashed password
  companyId    String   @db.ObjectId        // Foreign key
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@map("users")
}
```

Deleting a company deletes all its users

**Indexes:**

-   `email` (unique) - Fast authentication lookup

#### CareersPage

```prisma
model CareersPage {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  companyId        String   @unique @db.ObjectId  // Foreign key (one-to-one)
  sectionSelector  Json                           // Array of enabled section IDs
  sectionContent   Json                           // Section data (about, values, etc.)
  orderOfSections  Json                           // Array defining section order
  colorTheme       Json                           // {primary, secondary, accent, bg, text}
  fontStyle        String   @default("Inter")     // Font family name
  images           Json                           // Image URLs for sections
  heroConfig       Json?                          // Hero section configuration
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@map("careers_pages")
}
```

**JSON Structures:**

`sectionSelector`: `["about", "values", "jobs"]`

`sectionContent`:

```json
{
  "about": { "title": "...", "description": "..." },
  "values": { "title": "...", "items": [...] },
  "media": { "logo": "...", "video": "...", "videoTitle": "..." }
}
```

`orderOfSections`: `["about", "values", "lifeAtCompany", "jobs"]`

`colorTheme`:

```json
{
    "primary": "#3B82F6",
    "secondary": "#1E40AF",
    "accent": "#60A5FA",
    "background": "#FFFFFF",
    "text": "#111827"
}
```

`heroConfig`:

```json
{
    "template": "centered",
    "headline": "Join Our Team",
    "subheadline": "Build the future with us",
    "ctaText": "View Open Positions",
    "ctaLink": "#jobs",
    "showLogo": true,
    "backgroundImage": "...",
    "overlayOpacity": 0.5
}
```

#### Job

```prisma
model Job {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  companyId       String   @db.ObjectId         // Foreign key
  title           String                         // Job title
  workPolicy      String                         // Remote/Hybrid/Onsite
  location        String                         // City, State/Country
  department      String                         // Engineering/Sales/etc
  employmentType  String                         // Full-time/Part-time/Contract
  experienceLevel String                         // Entry/Mid/Senior
  jobType         String                         // Permanent/Temporary/Internship
  salaryRange     String?                        // Optional salary info
  jobSlug         String                         // URL-safe identifier
  postedDaysAgo   Int      @default(0)          // Days since posting
  description     String?                        // Full job description
  requirements    Json                           // Array of requirement strings
  responsibilities Json                          // Array of responsibility strings
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([companyId, jobSlug])                // Composite unique constraint
  @@map("jobs")
}
```

### Test Plan

I have not implemented any test cases as of now but it can be implemented using Jest. I can add some unit tests and data validation tests. Though I don't have much testing experience so I focused more on functionality.
