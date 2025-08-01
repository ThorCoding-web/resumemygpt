import React from 'react';
import { FileText, Upload, Sparkles, CheckCircle, Zap, Target } from 'lucide-react';

interface LandingPageProps {
  onCreateNew: () => void;
  onImportExisting: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreateNew, onImportExisting }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ResumeBuilderGPT</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Resume Builder</span>
            </div>
            
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Perfect Resume with{' '}
              <span className="text-blue-600">AI Assistance</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create ATS-friendly resumes that get noticed. Our AI helps you tailor your resume 
              to specific job descriptions and provides real-time optimization suggestions.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Create New Resume</span>
            </button>
            
            <button
              onClick={onImportExisting}
              className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Import Existing Resume</span>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS-Friendly Templates</h3>
              <p className="text-gray-600">Choose from 6 professionally designed templates optimized for Applicant Tracking Systems.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Writing</h3>
              <p className="text-gray-600">Get intelligent suggestions for every section of your resume, tailored to your target role.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time ATS Scoring</h3>
              <p className="text-gray-600">See how well your resume matches job descriptions with our live compatibility score.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © 2025 ResumeBuilderGPT. Build resumes that get you hired.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;