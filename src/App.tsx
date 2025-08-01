import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TemplateSelection from './components/TemplateSelection';
import JobDetailsForm from './components/JobDetailsForm';
import ResumeEditor from './components/ResumeEditor';
import ImportResume from './components/ImportResume';

export type AppStep = 'landing' | 'templates' | 'job-details' | 'editor' | 'import';

export interface JobDetails {
  title: string;
  description: string;
  industry: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'colorful';
  preview: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    title: '',
    description: '',
    industry: ''
  });

  const handleCreateNew = () => {
    setCurrentStep('job-details');
  };

  const handleImportExisting = () => {
    setCurrentStep('import');
  };

  const handleJobDetailsSubmit = (details: JobDetails) => {
    setJobDetails(details);
    setCurrentStep('templates');
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentStep('editor');
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    setSelectedTemplate(null);
    setJobDetails({ title: '', description: '', industry: '' });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage
            onCreateNew={handleCreateNew}
            onImportExisting={handleImportExisting}
          />
        );
      case 'job-details':
        return (
          <JobDetailsForm
            onSubmit={handleJobDetailsSubmit}
            onBack={handleBackToLanding}
          />
        );
      case 'templates':
        return (
          <TemplateSelection
            onSelectTemplate={handleTemplateSelect}
            onBack={() => setCurrentStep('job-details')}
          />
        );
      case 'editor':
        return (
          <ResumeEditor
            template={selectedTemplate!}
            jobDetails={jobDetails}
            onBack={() => setCurrentStep('templates')}
          />
        );
      case 'import':
        return (
          <ImportResume
            onBack={handleBackToLanding}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {renderCurrentStep()}
    </div>
  );
}

export default App;