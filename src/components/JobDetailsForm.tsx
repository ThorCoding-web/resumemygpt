import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, FileText, Building } from 'lucide-react';
import { JobDetails } from '../App';

interface JobDetailsFormProps {
  onSubmit: (details: JobDetails) => void;
  onBack: () => void;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Operations',
  'Human Resources',
  'Legal',
  'Consulting',
  'Other'
];

const JobDetailsForm: React.FC<JobDetailsFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<JobDetails>({
    title: '',
    description: '',
    industry: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.industry) {
      onSubmit(formData);
    }
  };

  const isValid = formData.title.trim() && formData.industry;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Details</h1>
          <p className="text-lg text-gray-600">
            Tell us about the role you're targeting. We'll use this information to suggest the best template and optimize your resume with AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Title */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Target Job Title</h3>
                <p className="text-sm text-gray-600">What position are you applying for?</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Senior Software Engineer, Marketing Manager, Data Analyst"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Industry */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Industry</h3>
                <p className="text-sm text-gray-600">Which industry are you targeting?</p>
              </div>
            </div>
            <select
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select an industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Job Description (Optional)</h3>
                <p className="text-sm text-gray-600">Paste the job description to get AI-tailored suggestions</p>
              </div>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Paste the job description here for more personalized AI suggestions..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              The more details you provide, the better our AI can tailor your resume to the specific role.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isValid}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2 ${
                isValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Choose Template</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDetailsForm;