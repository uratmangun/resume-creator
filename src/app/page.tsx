'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sdk } from '@farcaster/miniapp-sdk'
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

export default function Home() {
  useEffect(() => {
    const initializeSdk = async () => {
      await sdk.actions.ready();
    };
    initializeSdk();
  }, []);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    githubUrl: '',
    description: '',
    experiences: [{ company: '', year: '', description: '' }],
    projects: [{ name: '', description: '', demoUrl: '', openSourceUrl: '' }]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { company: '', year: '', description: '' }]
    });
  };

  const removeExperience = (index: number) => {
    const newExperiences = formData.experiences.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      experiences: newExperiences.length > 0 ? newExperiences : [{ company: '', year: '', description: '' }]
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setFormData({
      ...formData,
      experiences: newExperiences
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', demoUrl: '', openSourceUrl: '' }]
    });
  };

  const removeProject = (index: number) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      projects: newProjects.length > 0 ? newProjects : [{ name: '', description: '', demoUrl: '', openSourceUrl: '' }]
    });
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setFormData({
      ...formData,
      projects: newProjects
    });
  };

  const generateResume = () => {
    // Check if user wants to save first
    const shouldSave = confirm('Do you want to save your current resume data before generating? This will ensure the new tab has the most up-to-date information.');
    
    if (shouldSave) {
      saveResumeToIndexedDB();
      // Wait a moment for the save to complete, then open the new tab
      setTimeout(() => {
        window.open('/resume-view', '_blank');
      }, 500);
    } else {
      // Open the resume view tab without saving
      window.open('/resume-view', '_blank');
    }
  };

  const generateJsonResume = () => {
    // Filter out empty experiences and projects
    const filteredExperiences = formData.experiences.filter(exp => 
      exp.company || exp.year || exp.description
    );
    const filteredProjects = formData.projects.filter(proj => 
      proj.name || proj.description || proj.demoUrl || proj.openSourceUrl
    );

    const resumeJson = {
      name: formData.name || '',
      githubUrl: formData.githubUrl || '',
      description: formData.description || '',
      experiences: filteredExperiences,
      projects: filteredProjects,
      generatedAt: new Date().toISOString()
    };

    const jsonString = JSON.stringify(resumeJson, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert('Resume JSON generated and copied to clipboard!');
  };

  const saveResumeToIndexedDB = async () => {
    try {
      const dbName = 'ResumeDB';
      const storeName = 'resumes';
      const version = 1;

      // Open IndexedDB
      const request = indexedDB.open(dbName, version);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        const resumeData = {
          id: 'current-resume',
          ...formData,
          savedAt: new Date().toISOString()
        };

        const saveRequest = store.put(resumeData);
        
        saveRequest.onsuccess = () => {
          alert('Resume saved successfully!');
        };

        saveRequest.onerror = () => {
          alert('Failed to save resume');
        };
      };

      request.onerror = () => {
        alert('Failed to open database');
      };
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume');
    }
  };

  const loadResumeFromIndexedDB = async () => {
    try {
      const dbName = 'ResumeDB';
      const storeName = 'resumes';
      const version = 1;

      const request = indexedDB.open(dbName, version);
      
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        const getRequest = store.get('current-resume');
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            setFormData({
              name: result.name || '',
              githubUrl: result.githubUrl || '',
              description: result.description || '',
              experiences: result.experiences || [{ company: '', year: '', description: '' }],
              projects: result.projects || [{ name: '', description: '', demoUrl: '', openSourceUrl: '' }]
            });
            alert('Resume loaded successfully!');
          } else {
            alert('No saved resume found');
          }
        };

        getRequest.onerror = () => {
          alert('Failed to load resume');
        };
      };

      request.onerror = () => {
        alert('Failed to open database');
      };
    } catch (error) {
      console.error('Error loading resume:', error);
      alert('Failed to load resume');
    }
  };

  const previewResume = () => {
    const hasExperiences = formData.experiences.some(exp => exp.company || exp.year || exp.description);
    const hasProjects = formData.projects.some(proj => proj.name || proj.description || proj.demoUrl || proj.openSourceUrl);
    
    // Check if form has any data
    if (!formData.name && !formData.githubUrl && !formData.description && !hasExperiences && !hasProjects) {
      alert('Please fill in some information to preview your resume.');
      return;
    }
    
    const experiencePreview = formData.experiences
      .filter(exp => exp.company || exp.year || exp.description)
      .map(exp => `${exp.company} (${exp.year})\n${exp.description}`)
      .join('\n\n') || 'Not provided';

    const projectPreview = formData.projects
      .filter(proj => proj.name || proj.description || proj.demoUrl || proj.openSourceUrl)
      .map(proj => {
        let projectText = `${proj.name}\n${proj.description}`;
        if (proj.demoUrl) projectText += `\nDemo: ${proj.demoUrl}`;
        if (proj.openSourceUrl) projectText += `\nSource: ${proj.openSourceUrl}`;
        return projectText;
      })
      .join('\n\n') || 'Not provided';
    
    // Create formatted preview content
    const previewContent = `
RESUME PREVIEW
${'='.repeat(50)}

Name: ${formData.name || 'Not provided'}
GitHub: ${formData.githubUrl || 'Not provided'}
Description: ${formData.description || 'Not provided'}

EXPERIENCE
${'-'.repeat(20)}
${experiencePreview}

PROJECTS  
${'-'.repeat(20)}
${projectPreview}
    `;
    
    alert(previewContent);
  };

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
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Resume Creator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Build your professional resume in minutes and submit your resume straight away using browser-use
          </p>
        </header>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <input
                type="url"
                name="githubUrl"
                placeholder="GitHub URL (e.g., https://github.com/username)"
                value={formData.githubUrl}
                onChange={handleChange}
                className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <textarea
              name="description"
              placeholder="Brief personal description or professional summary..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Professional Experience
              </h2>
              <button
                onClick={addExperience}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit"
              >
                + Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {formData.experiences.map((experience, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 relative">
                  {formData.experiences.length > 1 && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={experience.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g., 2020-2023)"
                      value={experience.year}
                      onChange={(e) => handleExperienceChange(index, 'year', e.target.value)}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <textarea
                    placeholder="Describe your role and achievements..."
                    value={experience.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Projects
              </h2>
              <button
                onClick={addProject}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit"
              >
                + Add Project
              </button>
            </div>
            <div className="space-y-6">
              {formData.projects.map((project, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 relative">
                  {formData.projects.length > 1 && (
                    <button
                      onClick={() => removeProject(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="url"
                        placeholder="Demo URL (optional)"
                        value={project.demoUrl}
                        onChange={(e) => handleProjectChange(index, 'demoUrl', e.target.value)}
                        className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                      <input
                        type="url"
                        placeholder="Open Source URL (optional)"
                        value={project.openSourceUrl}
                        onChange={(e) => handleProjectChange(index, 'openSourceUrl', e.target.value)}
                        className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Describe the project, technologies used, and key features..."
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              <button
                onClick={previewResume}
                className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Preview Resume
              </button>
              <button
                onClick={generateResume}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Generate Resume
              </button>
              <button
                onClick={generateJsonResume}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Generate JSON
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={saveResumeToIndexedDB}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Save Resume
              </button>
              <button
                onClick={loadResumeFromIndexedDB}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Load Resume
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-slate-500 dark:text-slate-400">
          <p>Fill out the form above and click Generate Resume to create your professional resume!</p>
        </div>

        {/* Job List Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Job List
            </h2>
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
    </div>
  );
}