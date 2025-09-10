'use client';

import { useEffect, useState } from 'react';

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

export default function PrintResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    // Get resume data from localStorage
    const storedData = localStorage.getItem('resumeDataForPrint');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setResumeData(data);
        // Clean up the stored data
        localStorage.removeItem('resumeDataForPrint');
      } catch (error) {
        console.error('Error parsing resume data:', error);
      }
    }
  }, []);

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading resume...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            font-family: Georgia, serif;
            font-size: 14pt;
            line-height: 1.4;
            color: black;
            background: white;
          }
          
          .print-container {
            max-width: none;
            margin: 0;
            padding: 0.75in;
            box-shadow: none;
            border: none;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
          
          h1 {
            font-size: 22pt;
            margin-bottom: 8pt;
          }
          
          h2 {
            font-size: 14pt;
            margin-bottom: 6pt;
            margin-top: 12pt;
          }
          
          h3 {
            font-size: 13pt;
            margin-bottom: 4pt;
          }
          
          p {
            font-size: 12pt;
            line-height: 1.3;
            margin-bottom: 6pt;
          }
          
          .text-xs {
            font-size: 12pt;
          }
          
          .text-sm {
            font-size: 13pt;
          }
          
          a {
            color: #0d9488;
            text-decoration: underline;
          }
          
          .github-link {
            display: inline-block;
            color: #0d9488;
            text-decoration: underline;
          }
          
          .github-icon {
            display: inline-block;
            width: 12pt;
            height: 12pt;
            vertical-align: middle;
            margin-right: 4pt;
          }
          
          .initial-box {
            width: 40pt;
            height: 40pt;
            background-color: #0d9488;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18pt;
            font-weight: bold;
            margin: 0 auto 12pt auto;
            border-radius: 4pt;
          }
          
          .section-divider {
            border-top: 1pt solid #cbd5e1;
            margin: 16pt 0;
          }
          
          .two-column {
            display: flex;
          }
          
          .section-label {
            width: 80pt;
            flex-shrink: 0;
            font-weight: bold;
            font-size: 10pt;
          }
          
          .section-content {
            flex: 1;
          }
        }
        
        @media screen {
          body {
            background-color: #f3f4f6;
            padding: 20px;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-100">
        <div className="no-print bg-white p-4 shadow-sm border-b mb-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Resume - Print View</h1>
            <div className="space-x-3">
              <button 
                onClick={() => window.print()} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Print PDF
              </button>
              <button 
                onClick={() => window.close()} 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="print-container max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8" style={{fontFamily: 'Georgia, serif'}}>
          {/* Header with initial box */}
          <div className="text-center mb-6">
            <div className="initial-box w-14 h-14 bg-teal-600 text-white text-xl font-bold rounded-md flex items-center justify-center mx-auto mb-3">
              {resumeData.name ? resumeData.name.charAt(0).toUpperCase() : '?'}
            </div>
            <h1 className="text-3xl font-normal text-gray-900 mb-1">
              {resumeData.name || 'Your Name'}
            </h1>
            <p className="text-lg text-gray-600 mb-2">Developer</p>
            
            {resumeData.githubUrl && (
              <p className="text-base text-gray-700">
                <a href={resumeData.githubUrl} target="_blank" rel="noopener noreferrer" className="github-link text-teal-600 inline-flex items-center gap-1">
                  <svg className="github-icon w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  {resumeData.githubUrl}
                </a>
              </p>
            )}
          </div>

          {/* Separator line */}
          <div className="section-divider border-t border-gray-300 mb-6"></div>

          {/* Summary Section */}
          {resumeData.description && (
            <div className="mb-6">
              <div className="two-column flex">
                <div className="section-label w-20 flex-shrink-0">
                  <h2 className="text-base font-semibold text-gray-900">Summary</h2>
                </div>
                <div className="section-content flex-1">
                  <p className="text-base text-gray-700 leading-relaxed">{resumeData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {resumeData.experiences.length > 0 && resumeData.experiences.some(exp => exp.company || exp.year || exp.description) && (
            <div className="mb-6">
              <div className="two-column flex">
                <div className="section-label w-20 flex-shrink-0">
                  <h2 className="text-base font-semibold text-gray-900">Experience</h2>
                </div>
                <div className="section-content flex-1 space-y-4">
                  {resumeData.experiences
                    .filter(exp => exp.company || exp.year || exp.description)
                    .map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-medium text-gray-900">{exp.company}</h3>
                          <span className="text-base text-gray-600 ml-4">{exp.year}</span>
                        </div>
                        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {resumeData.projects.length > 0 && resumeData.projects.some(proj => proj.name || proj.description || proj.demoUrl || proj.openSourceUrl) && (
            <div className="mb-6">
              <div className="two-column flex">
                <div className="section-label w-20 flex-shrink-0">
                  <h2 className="text-base font-semibold text-gray-900">Projects</h2>
                </div>
                <div className="section-content flex-1 space-y-4">
                  {resumeData.projects
                    .filter(proj => proj.name || proj.description || proj.demoUrl || proj.openSourceUrl)
                    .map((proj, index) => (
                      <div key={index}>
                        <h3 className="text-base font-medium text-gray-900 mb-1">{proj.name}</h3>
                        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap mb-2">{proj.description}</p>
                        <div className="space-y-1 text-base">
                          {proj.demoUrl && (
                            <p className="text-gray-600">
                              <span className="font-medium">Demo:</span>{' '}
                              <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                                {proj.demoUrl}
                              </a>
                            </p>
                          )}
                          {proj.openSourceUrl && (
                            <p className="text-gray-600">
                              <span className="font-medium">Source:</span>{' '}
                              <a href={proj.openSourceUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
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
    </>
  );
}
