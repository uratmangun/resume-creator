'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    position: "Full-time",
    description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies.",
    salary: "$95,000 - $120,000"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Design Studio Pro",
    position: "Full-time",
    description: "Create beautiful and intuitive user interfaces for web and mobile applications. Experience with Figma and design systems required.",
    salary: "$70,000 - $90,000"
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudTech Solutions",
    position: "Remote",
    description: "Develop and maintain scalable APIs and microservices using Node.js, Python, and cloud technologies.",
    salary: "$100,000 - $130,000"
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Analytics Plus",
    position: "Hybrid",
    description: "Analyze complex datasets to provide actionable insights for business decisions. Proficiency in SQL, Python, and Tableau required.",
    salary: "$65,000 - $85,000"
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateCorp",
    position: "Full-time",
    description: "Lead product development from conception to launch. Work closely with engineering and design teams to deliver exceptional user experiences.",
    salary: "$110,000 - $140,000"
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "Infrastructure Pro",
    position: "Remote",
    description: "Manage CI/CD pipelines, cloud infrastructure, and deployment processes. Experience with AWS, Docker, and Kubernetes preferred.",
    salary: "$90,000 - $115,000"
  }
];

export default function JobsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredJobs(mockJobs);
    } else {
      const filtered = mockJobs.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.position.toLowerCase().includes(term)
      );
      setFilteredJobs(filtered);
    }
  };

  const handleJobClick = (jobId: number) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Job List
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Explore available job opportunities
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search jobs by title, company, or keywords..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {job.title}
                      </h3>
                      <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-2 sm:mt-0">
                        {job.position}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                        {job.company}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No jobs found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
