'use client';

import { useEffect } from 'react';

interface Experience {
  company: string;
  year: string;
  description: string;
}

interface Project {
  name: string;
  description: string;
  demoUrl: string;
  openSourceUrl: string;
}

interface ResumeData {
  name: string;
  githubUrl: string;
  description: string;
  experiences: Experience[];
  projects: Project[];
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDownloadPDF?: () => void;
}

export default function ResumePreview({ resumeData, onDownloadPDF }: ResumePreviewProps) {
  const downloadAsPDF = () => {
    if (!resumeData.name && !resumeData.description && !resumeData.experiences.some(exp => exp.company) && !resumeData.projects.some(proj => proj.name)) {
      alert('Please fill in some information before generating PDF');
      return;
    }

    // Store resume data in localStorage for the print page
    localStorage.setItem('resumeDataForPrint', JSON.stringify(resumeData));
    
    // Open print page in new tab
    const printWindow = window.open('/print-resume', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to open the print view');
    }
  };

  // Check if resume has any content to display
  const hasContent = resumeData.name || resumeData.description || 
    resumeData.experiences.some(exp => exp.company || exp.year || exp.description) ||
    resumeData.projects.some(proj => proj.name || proj.description || proj.demoUrl || proj.openSourceUrl);

  if (!hasContent) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <p className="text-lg">Start filling out your information above to see your resume preview here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Resume Preview
        </h2>
        <button
          onClick={downloadAsPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-fit"
        >
          Download PDF
        </button>
      </div>

      <div className="resume-content bg-white dark:bg-slate-700 shadow-md p-8 rounded-lg" style={{fontFamily: 'Georgia, serif'}}>
        {/* Header with initial box */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-600 dark:bg-teal-500 text-white text-xl font-bold rounded-md flex items-center justify-center mx-auto mb-3">
            {resumeData.name ? resumeData.name.charAt(0).toUpperCase() : '?'}
          </div>
          <h1 className="text-xl font-normal text-slate-900 dark:text-slate-100 mb-1">
            {resumeData.name || 'Your Name'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Developer</p>
          
          {resumeData.githubUrl && (
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <a href={resumeData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 border-b border-teal-600 dark:border-teal-400 hover:border-teal-800 inline-flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                {resumeData.githubUrl}
              </a>
            </p>
          )}
        </div>

        {/* Separator line */}
        <div className="border-t border-slate-300 dark:border-slate-600 mb-6"></div>

        {/* Summary Section */}
        {resumeData.description && (
          <div className="mb-6">
            <div className="flex">
              <div className="w-20 flex-shrink-0">
                <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Summary</h2>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{resumeData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {resumeData.experiences.length > 0 && resumeData.experiences.some(exp => exp.company || exp.year || exp.description) && (
          <div className="mb-6">
            <div className="flex">
              <div className="w-20 flex-shrink-0">
                <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Experience</h2>
              </div>
              <div className="flex-1 space-y-4">
                {resumeData.experiences
                  .filter(exp => exp.company || exp.year || exp.description)
                  .map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-xs font-medium text-slate-900 dark:text-slate-100">{exp.company}</h3>
                        <span className="text-xs text-slate-600 dark:text-slate-400 ml-4">{exp.year}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {resumeData.projects.length > 0 && resumeData.projects.some(proj => proj.name || proj.description || proj.demoUrl || proj.openSourceUrl) && (
          <div className="mb-6">
            <div className="flex">
              <div className="w-20 flex-shrink-0">
                <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Projects</h2>
              </div>
              <div className="flex-1 space-y-4">
                {resumeData.projects
                  .filter(proj => proj.name || proj.description || proj.demoUrl || proj.openSourceUrl)
                  .map((proj, index) => (
                    <div key={index}>
                      <h3 className="text-xs font-medium text-slate-900 dark:text-slate-100 mb-1">{proj.name}</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-2">{proj.description}</p>
                      <div className="space-y-1 text-xs">
                        {proj.demoUrl && (
                          <p className="text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Demo:</span>{' '}
                            <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline">
                              {proj.demoUrl}
                            </a>
                          </p>
                        )}
                        {proj.openSourceUrl && (
                          <p className="text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Source:</span>{' '}
                            <a href={proj.openSourceUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline">
                              {proj.openSourceUrl}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
