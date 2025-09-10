"use client";

import { useEffect, useState } from "react";
import ResumePreview from "@/components/ResumePreview";

interface SessionData {
  id: string;
  status: string;
  startedAt: string;
  liveUrl: string;
  finishedAt: string;
}

interface SessionsResponse {
  items: SessionData[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
}

export default function DebugPage() {
  const [resumeData, setResumeData] = useState(null);
  const [dbStatus, setDbStatus] = useState("Loading...");
  const [apiKey, setApiKey] = useState("");
  const [sessions, setSessions] = useState<SessionsResponse | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState("");

  useEffect(() => {
    // Load resume data from IndexedDB for debugging
    loadResumeData();
    
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('browser-use-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    // Save to localStorage
    localStorage.setItem('browser-use-api-key', newApiKey);
  };

  const fetchSessions = async () => {
    if (!apiKey) {
      setSessionsError("Please enter your API key first");
      return;
    }

    setSessionsLoading(true);
    setSessionsError("");
    
    try {
      const response = await fetch('https://api.browser-use.com/api/v2/sessions', {
        method: 'GET',
        headers: {
          'X-Browser-Use-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SessionsResponse = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessionsError(error instanceof Error ? error.message : 'Failed to fetch sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  const loadResumeData = async () => {
    try {
      const dbName = "ResumeDB";
      const storeName = "resumes";
      const version = 1;

      const request = indexedDB.open(dbName, version);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);

        const getRequest = store.get("current-resume");

        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            setResumeData(result);
            setDbStatus("Resume data found");
          } else {
            setDbStatus("No resume data found");
          }
        };

        getRequest.onerror = () => {
          setDbStatus("Error loading resume data");
        };
      };

      request.onerror = () => {
        setDbStatus("Error opening database");
      };
    } catch (error) {
      console.error("Error in loadResumeData:", error);
      setDbStatus("Error accessing IndexedDB");
    }
  };

  const clearDatabase = async () => {
    try {
      const dbName = "ResumeDB";
      const deleteRequest = indexedDB.deleteDatabase(dbName);
      
      deleteRequest.onsuccess = () => {
        setResumeData(null);
        setDbStatus("Database cleared successfully");
        alert("Database cleared successfully!");
      };

      deleteRequest.onerror = () => {
        setDbStatus("Error clearing database");
        alert("Error clearing database");
      };
    } catch (error) {
      console.error("Error clearing database:", error);
      setDbStatus("Error clearing database");
      alert("Error clearing database");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
      {/* Top Left Navigation */}
      <div className="fixed top-4 left-4 z-10">
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-block shadow-lg"
        >
          ← Back to Resume Creator
        </a>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Debug Page
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Debug information and utilities for the Resume Creator
          </p>
        </header>

        <div className="space-y-6">
          {/* Browser-Use API Key Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Browser-Use API Key
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="api-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your browser-use API key..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>Your API key is stored securely in your browser's localStorage and will be automatically loaded when you return to this page.</p>
              </div>
            </div>
          </div>

          {/* Browser-Use Sessions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Browser-Use Sessions
              </h2>
              <button
                onClick={fetchSessions}
                disabled={sessionsLoading || !apiKey}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {sessionsLoading ? 'Loading...' : 'Load Sessions'}
              </button>
            </div>
            
            {sessionsError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-red-700 dark:text-red-300 text-sm">{sessionsError}</p>
              </div>
            )}

            {sessions ? (
              <div className="space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <p>Total Sessions: {sessions.totalItems} | Page: {sessions.pageNumber} | Page Size: {sessions.pageSize}</p>
                </div>
                
                {sessions.items.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.items.map((session) => (
                      <div key={session.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Session ID</p>
                            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{session.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              session.status === 'active' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Started At</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(session.startedAt).toLocaleString()}</p>
                          </div>
                          {session.finishedAt && (
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Finished At</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(session.finishedAt).toLocaleString()}</p>
                            </div>
                          )}
                          {session.liveUrl && (
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Live URL</p>
                              <a 
                                href={session.liveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                              >
                                {session.liveUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-300">No sessions found.</p>
                )}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                {!apiKey ? 'Please enter your API key and click "Refresh Sessions" to load data.' : 'Click "Refresh Sessions" to load session data.'}
              </p>
            )}
          </div>

          {/* Database Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Database Status
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Status: <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{dbStatus}</span>
            </p>
            <button
              onClick={clearDatabase}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Database
            </button>
          </div>

          {/* Resume Data Display */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Stored Resume Data
            </h2>
            {resumeData ? (
              <pre className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg overflow-auto text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {JSON.stringify(resumeData, null, 2)}
              </pre>
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                No resume data available
              </p>
            )}
          </div>

          {/* System Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              System Information
            </h2>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p><strong>User Agent:</strong> <span className="font-mono text-xs">{typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</span></p>
              <p><strong>IndexedDB Support:</strong> <span className="font-mono">{typeof window !== 'undefined' && 'indexedDB' in window ? 'Yes' : 'No'}</span></p>
              <p><strong>Local Storage Support:</strong> <span className="font-mono">{typeof window !== 'undefined' && 'localStorage' in window ? 'Yes' : 'No'}</span></p>
              <p><strong>Current Time:</strong> <span className="font-mono">{new Date().toISOString()}</span></p>
            </div>
          </div>

          {/* Resume Preview Section */}
          {resumeData && (
            <div id="resume-preview" className="mt-8">
              <ResumePreview resumeData={resumeData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
