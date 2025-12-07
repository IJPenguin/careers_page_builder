# CAREERS PAGE BUILDER

### Live Deployment Link

[https://careers-page-builder-5hye.onrender.com](https://careers-page-builder-5hye.onrender.com)

### How to run locally

-   First clone the repository:

```bash
git clone https://github.com/IJPenguin/careers_page_builder.git
```

-   Navigate to the project directory:

```bash
cd careers_page_builder
```

-   Install the dependencies:

```bash
npm install
```

-   Copy .env.example to .env and fill in the details:

```bash
cp .env.example .env
```

[Note: Make sure to use a replicaset mongodb instance as prisma does not support single node connections.]

-   Start the development server:

```bash
npm run dev
```

-   Open your browser and go to `http://localhost:3000` to see the application running locally.

### What I Built?

-   This app allows companies to create their own careers page and customize it and allows job searching candidates to view available jobs. (The application is not built)

-   I built this using Next.js, Typescript and Tailwind CSS. Next.js was chosed because of it server-side rendering capabilities which allows us to make the page SEO friendly. I used MongoDB for database as its flexible and easy to work with in quick projects.

-   I also added sitemap.xml and robots.txt generation for better SEO.

-   I also added AI support for helping in writing of content in the customize page.

-   This has JWT based auth for company where they can sign up and login to create their careers page. Passwords are hashed using bcrypt for security.

### Improvement Plan

-   We can definitely improve the UI as I am not much of a designer and I mainly focused on functionality and ease of use.

-   We can add animations and more customization options. Though I think its responsive for all sorts of screens and devices.

-   For scalability, we can implement Redis caching for frequently accessed career pages and job listings, add CDN distribution for static assets.

-   We can also create an admin panel in order to overview everything in one place.

-   We can add user analytics and heatmaps for each section so that company can improve using that data.

-   We can create sharing features and referral features as well so that the jobs can be referred to someone and shared on platforms like twitter and linkedin.
