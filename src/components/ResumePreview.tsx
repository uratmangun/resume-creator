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
  const downloadAsPDF = async () => {
    if (!resumeData.name && !resumeData.description && !resumeData.experiences.some(exp => exp.company) && !resumeData.projects.some(proj => proj.name)) {
      alert('Please fill in some information before generating PDF');
      return;
    }

    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Get the resume content element
      const element = document.querySelector('.resume-content');
      if (!element) {
        alert('Resume content not found');
        return;
      }

      // Create temporary stylesheet to convert oklch colors to hex for PDF generation
      const tempStyle = document.createElement('style');
      tempStyle.id = 'pdf-color-fix';
      tempStyle.textContent = `
        /* Force all elements to use hex colors only */
        .resume-content,
        .resume-content *,
        .resume-content *::before,
        .resume-content *::after {
          /* Override any CSS custom properties that might use oklch */
          --tw-bg-opacity: 1 !important;
          --tw-text-opacity: 1 !important;
          --tw-border-opacity: 1 !important;
          --tw-ring-opacity: 1 !important;
          --tw-shadow-color: rgba(0, 0, 0, 0.1) !important;
          --tw-gradient-from: transparent !important;
          --tw-gradient-to: transparent !important;
          --tw-gradient-stops: transparent !important;
        }
        
        /* Specific color overrides for all slate variants */
        .text-slate-950, .dark .text-slate-50 { color: #020617 !important; }
        .text-slate-900, .dark .text-slate-100 { color: #0f172a !important; }
        .text-slate-800, .dark .text-slate-200 { color: #1e293b !important; }
        .text-slate-700, .dark .text-slate-300 { color: #334155 !important; }
        .text-slate-600, .dark .text-slate-400 { color: #475569 !important; }
        .text-slate-500 { color: #64748b !important; }
        .text-slate-400, .dark .text-slate-600 { color: #94a3b8 !important; }
        .text-slate-300, .dark .text-slate-700 { color: #cbd5e1 !important; }
        .text-slate-200, .dark .text-slate-800 { color: #e2e8f0 !important; }
        .text-slate-100, .dark .text-slate-900 { color: #f1f5f9 !important; }
        .text-slate-50, .dark .text-slate-950 { color: #f8fafc !important; }
        
        /* Background colors */
        .bg-white { background-color: #ffffff !important; }
        .bg-slate-50 { background-color: #f8fafc !important; }
        .bg-slate-100 { background-color: #f1f5f9 !important; }
        .bg-slate-200 { background-color: #e2e8f0 !important; }
        .bg-slate-300 { background-color: #cbd5e1 !important; }
        .bg-slate-400 { background-color: #94a3b8 !important; }
        .bg-slate-500 { background-color: #64748b !important; }
        .bg-slate-600 { background-color: #475569 !important; }
        .bg-slate-700 { background-color: #334155 !important; }
        .bg-slate-800 { background-color: #1e293b !important; }
        .bg-slate-900 { background-color: #0f172a !important; }
        .bg-slate-950 { background-color: #020617 !important; }
        
        /* All teal colors */
        .text-teal-50 { color: #f0fdfa !important; }
        .text-teal-100 { color: #ccfbf1 !important; }
        .text-teal-200 { color: #99f6e4 !important; }
        .text-teal-300 { color: #5eead4 !important; }
        .text-teal-400 { color: #2dd4bf !important; }
        .text-teal-500 { color: #14b8a6 !important; }
        .text-teal-600 { color: #0d9488 !important; }
        .text-teal-700 { color: #0f766e !important; }
        .text-teal-800 { color: #115e59 !important; }
        .text-teal-900 { color: #134e4a !important; }
        
        .bg-teal-50 { background-color: #f0fdfa !important; }
        .bg-teal-100 { background-color: #ccfbf1 !important; }
        .bg-teal-200 { background-color: #99f6e4 !important; }
        .bg-teal-300 { background-color: #5eead4 !important; }
        .bg-teal-400 { background-color: #2dd4bf !important; }
        .bg-teal-500 { background-color: #14b8a6 !important; }
        .bg-teal-600 { background-color: #0d9488 !important; }
        .bg-teal-700 { background-color: #0f766e !important; }
        .bg-teal-800 { background-color: #115e59 !important; }
        .bg-teal-900 { background-color: #134e4a !important; }
        
        /* Border colors */
        .border-slate-300 { border-color: #cbd5e1 !important; }
        .border-slate-600 { border-color: #475569 !important; }
        .border-teal-400 { border-color: #2dd4bf !important; }
        .border-teal-600 { border-color: #0d9488 !important; }
        .border-teal-800 { border-color: #115e59 !important; }
        
        /* Blue colors for fallback links */
        .text-blue-400 { color: #60a5fa !important; }
        .text-blue-600 { color: #2563eb !important; }
        .text-green-600 { color: #16a34a !important; }
        .text-green-700 { color: #15803d !important; }
        
        /* Remove all gradients and complex backgrounds */
        .bg-gradient-to-br,
        .bg-gradient-to-r,
        .bg-gradient-to-l,
        .bg-gradient-to-t,
        .bg-gradient-to-b,
        .bg-gradient-to-tr,
        .bg-gradient-to-tl,
        .bg-gradient-to-bl {
          background: #ffffff !important;
          background-image: none !important;
        }
        
        /* Force simple colors for all elements */
        .resume-content * {
          background-image: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        
        /* Ensure SVG icons are properly colored */
        .resume-content svg {
          fill: currentColor !important;
        }
      `;
      
      // Add the temporary style
      document.head.appendChild(tempStyle);

      const opt = {
        margin: 1,
        filename: `${resumeData.name.replace(/\s+/g, '_') || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Generate PDF and clean up
      await html2pdf().set(opt).from(element).save();
      
      // Remove the temporary style after PDF generation
      setTimeout(() => {
        const tempStyleElement = document.getElementById('pdf-color-fix');
        if (tempStyleElement) {
          tempStyleElement.remove();
        }
      }, 1000);
      
    } catch (error) {
      // Clean up temporary style if it exists
      const tempStyleElement = document.getElementById('pdf-color-fix');
      if (tempStyleElement) {
        tempStyleElement.remove();
      }
      
      // Fallback to window.print if html2pdf is not available
      console.error('PDF generation failed, falling back to print:', error);
      window.print();
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
