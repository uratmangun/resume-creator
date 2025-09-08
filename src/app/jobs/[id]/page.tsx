'use client';

import { useParams, useRouter } from 'next/navigation';

// Mock job data (same as in main page)
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    position: "Full-time",
    description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies.",
    salary: "$95,000 - $120,000",
    location: "San Francisco, CA",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern CSS and styling frameworks",
      "Experience with state management libraries like Redux or Zustand",
      "Knowledge of testing frameworks (Jest, Cypress)",
      "Excellent communication and team collaboration skills"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work arrangements (remote/hybrid)",
      "Professional development budget",
      "401(k) with company matching"
    ],
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Design Studio Pro",
    position: "Full-time",
    description: "Create beautiful and intuitive user interfaces for web and mobile applications. Experience with Figma and design systems required.",
    salary: "$70,000 - $90,000",
    location: "New York, NY",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma, Sketch, or Adobe Creative Suite",
      "Experience with design systems and component libraries",
      "Strong portfolio showcasing web and mobile designs",
      "Understanding of user-centered design principles"
    ],
    benefits: [
      "Creative and collaborative work environment",
      "Health and wellness benefits",
      "Flexible PTO policy",
      "Design tool subscriptions covered",
      "Team building and social events"
    ],
    posted: "1 week ago"
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudTech Solutions",
    position: "Remote",
    description: "Develop and maintain scalable APIs and microservices using Node.js, Python, and cloud technologies.",
    salary: "$100,000 - $130,000",
    location: "Remote (US)",
    requirements: [
      "4+ years of backend development experience",
      "Strong proficiency in Node.js and Python",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Knowledge of database design and optimization",
      "Experience with microservices architecture"
    ],
    benefits: [
      "100% remote work opportunity",
      "Top-tier health benefits",
      "Home office setup allowance",
      "Annual company retreat",
      "Stock options program"
    ],
    posted: "3 days ago"
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Analytics Plus",
    position: "Hybrid",
    description: "Analyze complex datasets to provide actionable insights for business decisions. Proficiency in SQL, Python, and Tableau required.",
    salary: "$65,000 - $85,000",
    location: "Austin, TX",
    requirements: [
      "2+ years of data analysis experience",
      "Strong SQL and Python skills",
      "Experience with Tableau or Power BI",
      "Statistical analysis and data visualization expertise",
      "Business acumen and communication skills"
    ],
    benefits: [
      "Hybrid work model (3 days in office)",
      "Professional development opportunities",
      "Health and dental coverage",
      "Flexible work hours",
      "Performance-based bonuses"
    ],
    posted: "5 days ago"
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateCorp",
    position: "Full-time",
    description: "Lead product development from conception to launch. Work closely with engineering and design teams to deliver exceptional user experiences.",
    salary: "$110,000 - $140,000",
    location: "Seattle, WA",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile development methodologies",
      "Excellent stakeholder management abilities",
      "Data-driven decision making approach"
    ],
    benefits: [
      "Leadership development programs",
      "Comprehensive benefits package",
      "Equity participation",
      "Conference and training budget",
      "Collaborative team culture"
    ],
    posted: "1 day ago"
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "Infrastructure Pro",
    position: "Remote",
    description: "Manage CI/CD pipelines, cloud infrastructure, and deployment processes. Experience with AWS, Docker, and Kubernetes preferred.",
    salary: "$90,000 - $115,000",
    location: "Remote (Global)",
    requirements: [
      "3+ years of DevOps/Infrastructure experience",
      "Strong knowledge of AWS, Docker, and Kubernetes",
      "Experience with CI/CD tools (Jenkins, GitLab CI, etc.)",
      "Infrastructure as Code (Terraform, CloudFormation)",
      "Monitoring and logging tools expertise"
    ],
    benefits: [
      "Fully remote global team",
      "Flexible working hours across time zones",
      "Professional certification support",
      "Health and wellness stipend",
      "Annual equipment refresh"
    ],
    posted: "4 days ago"
  }
];

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);
  
  const job = mockJobs.find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Job Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      {job.company}
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    {job.position}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Posted {job.posted}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="text-right mb-4">
                  <div className="flex items-center justify-end">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {job.salary}
                    </span>
                  </div>
                </div>
                <button className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Job Description
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-600 dark:text-slate-400">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Benefits & Perks
              </h2>
              <ul className="space-y-3">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-slate-600 dark:text-slate-400">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Quick Apply
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                Interested in this position? Apply now and we'll get back to you soon!
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-3">
                Apply Now
              </button>
              <button className="w-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 rounded-lg font-semibold transition-colors">
                Save Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
