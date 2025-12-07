import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Find the penguin-corp company
    const company = await prisma.company.findUnique({
        where: { slug: "penguin-corp" },
    });

    if (!company) {
        console.log("Company penguin-corp not found. Please register first.");
        return;
    }

    console.log(`Found company: ${company.name} (${company.id})`);

    // Create sample jobs
    const jobs = [
        {
            companyId: company.id,
            title: "Senior Frontend Engineer",
            workPolicy: "Remote",
            location: "San Francisco, CA",
            department: "Engineering",
            employmentType: "Full-time",
            experienceLevel: "Senior",
            jobType: "Permanent",
            salaryRange: "$140,000 - $180,000",
            jobSlug: "senior-frontend-engineer",
            postedDaysAgo: 2,
            description:
                "We're looking for a talented Senior Frontend Engineer to join our growing team. You'll work on building world-class user interfaces using React, TypeScript, and modern web technologies.",
            requirements: [
                "5+ years of experience with React and TypeScript",
                "Strong understanding of modern CSS and responsive design",
                "Experience with state management (Redux, Zustand, etc.)",
                "Excellent problem-solving and communication skills",
                "Bachelor's degree in Computer Science or equivalent experience",
            ],
            responsibilities: [
                "Design and implement user-facing features using React",
                "Collaborate with designers and backend engineers",
                "Write clean, maintainable, and well-tested code",
                "Mentor junior engineers and contribute to technical decisions",
                "Optimize applications for maximum speed and scalability",
            ],
        },
        {
            companyId: company.id,
            title: "Backend Engineer",
            workPolicy: "Hybrid",
            location: "New York, NY",
            department: "Engineering",
            employmentType: "Full-time",
            experienceLevel: "Mid-level",
            jobType: "Permanent",
            salaryRange: "$110,000 - $150,000",
            jobSlug: "backend-engineer",
            postedDaysAgo: 5,
            description:
                "Join our backend team to build scalable APIs and services that power our platform. Work with Node.js, PostgreSQL, and cloud technologies.",
            requirements: [
                "3+ years of backend development experience",
                "Proficiency in Node.js and TypeScript",
                "Experience with relational databases (PostgreSQL, MySQL)",
                "Understanding of RESTful API design",
                "Knowledge of cloud platforms (AWS, GCP, or Azure)",
            ],
            responsibilities: [
                "Design and develop robust backend APIs",
                "Optimize database queries and improve performance",
                "Implement authentication and authorization systems",
                "Write comprehensive tests and documentation",
                "Participate in code reviews and architectural discussions",
            ],
        },
        {
            companyId: company.id,
            title: "Product Designer",
            workPolicy: "On-site",
            location: "Austin, TX",
            department: "Design",
            employmentType: "Full-time",
            experienceLevel: "Mid-level",
            jobType: "Permanent",
            salaryRange: "$95,000 - $130,000",
            jobSlug: "product-designer",
            postedDaysAgo: 1,
            description:
                "We're seeking a creative Product Designer to shape the future of our products. You'll work closely with product managers and engineers to deliver exceptional user experiences.",
            requirements: [
                "3+ years of product design experience",
                "Strong portfolio demonstrating UX/UI design skills",
                "Proficiency in Figma and design systems",
                "Understanding of user research and usability testing",
                "Excellent visual design and prototyping skills",
            ],
            responsibilities: [
                "Create user flows, wireframes, and high-fidelity mockups",
                "Conduct user research and usability testing",
                "Collaborate with cross-functional teams",
                "Maintain and evolve the design system",
                "Present design concepts and rationale to stakeholders",
            ],
        },
        {
            companyId: company.id,
            title: "DevOps Engineer",
            workPolicy: "Remote",
            location: "Seattle, WA",
            department: "Engineering",
            employmentType: "Full-time",
            experienceLevel: "Senior",
            jobType: "Permanent",
            salaryRange: "$130,000 - $170,000",
            jobSlug: "devops-engineer",
            postedDaysAgo: 10,
            description:
                "Help us build and maintain world-class infrastructure. Work with Kubernetes, AWS, and modern DevOps tools to ensure reliability and scalability.",
            requirements: [
                "5+ years of DevOps or Site Reliability Engineering experience",
                "Strong knowledge of Kubernetes and container orchestration",
                "Experience with AWS services (EC2, S3, RDS, Lambda)",
                "Proficiency in Infrastructure as Code (Terraform, CloudFormation)",
                "Strong scripting skills (Python, Bash, etc.)",
            ],
            responsibilities: [
                "Design and maintain CI/CD pipelines",
                "Manage cloud infrastructure and monitor system health",
                "Implement security best practices and compliance measures",
                "Automate operational tasks and improve deployment processes",
                "Respond to incidents and perform root cause analysis",
            ],
        },
        {
            companyId: company.id,
            title: "Marketing Manager",
            workPolicy: "Hybrid",
            location: "Los Angeles, CA",
            department: "Marketing",
            employmentType: "Full-time",
            experienceLevel: "Mid-level",
            jobType: "Permanent",
            salaryRange: "$85,000 - $115,000",
            jobSlug: "marketing-manager",
            postedDaysAgo: 7,
            description:
                "Lead our marketing efforts to drive growth and brand awareness. Develop and execute marketing campaigns across multiple channels.",
            requirements: [
                "4+ years of marketing experience, preferably in tech",
                "Strong understanding of digital marketing channels",
                "Experience with marketing analytics and A/B testing",
                "Excellent written and verbal communication skills",
                "Proven track record of successful campaign execution",
            ],
            responsibilities: [
                "Develop and execute multi-channel marketing campaigns",
                "Analyze campaign performance and optimize strategies",
                "Collaborate with sales and product teams",
                "Manage marketing budget and vendor relationships",
                "Create compelling content for various audiences",
            ],
        },
        {
            companyId: company.id,
            title: "Data Scientist",
            workPolicy: "Remote",
            location: "Boston, MA",
            department: "Data",
            employmentType: "Full-time",
            experienceLevel: "Senior",
            jobType: "Permanent",
            salaryRange: "$135,000 - $175,000",
            jobSlug: "data-scientist",
            postedDaysAgo: 3,
            description:
                "Use data to drive business decisions and build machine learning models. Work with large datasets and modern ML frameworks.",
            requirements: [
                "5+ years of data science experience",
                "Strong programming skills in Python",
                "Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)",
                "Proficiency in SQL and data analysis",
                "Master's or PhD in Computer Science, Statistics, or related field preferred",
            ],
            responsibilities: [
                "Build and deploy machine learning models",
                "Analyze complex datasets to extract insights",
                "Collaborate with engineering teams on model integration",
                "Present findings to technical and non-technical stakeholders",
                "Stay current with latest ML/AI research and techniques",
            ],
        },
    ];

    console.log("\nCreating jobs...");

    for (const job of jobs) {
        try {
            const created = await prisma.job.create({
                data: job,
            });
            console.log(`✓ Created: ${created.title} (${created.jobSlug})`);
        } catch (error) {
            console.error(`✗ Failed to create ${job.title}:`, error);
        }
    }

    console.log("\n✅ Sample jobs created successfully!");
}

main()
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
