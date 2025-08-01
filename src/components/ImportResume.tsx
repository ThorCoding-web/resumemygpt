import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface ImportResumeProps {
  onBack: () => void;
}

interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
}

const ImportResume: React.FC<ImportResumeProps> = ({ onBack }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'parsing' | 'preview' | 'enhance'>('upload');
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [enhancementGoals, setEnhancementGoals] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['.pdf', '.docx', '.doc', '.txt'];

  const enhancementOptions = [
    { id: 'ats-optimize', label: 'Optimize for ATS systems', description: 'Improve formatting and keywords for applicant tracking systems' },
    { id: 'quantify', label: 'Add quantifiable results', description: 'Help add numbers and metrics to achievements' },
    { id: 'modernize', label: 'Modernize language', description: 'Update outdated phrases and improve impact' },
    { id: 'tailor-role', label: 'Tailor to specific role', description: 'Customize content for your target position' },
    { id: 'improve-format', label: 'Improve formatting', description: 'Enhance visual hierarchy and readability' },
    { id: 'add-projects', label: 'Highlight key projects', description: 'Better showcase important work and achievements' }
  ];

  // Mock parsed resume data
  const mockParsedData: ParsedResumeData = {
    personalInfo: {
      name: 'John Doe',
      email: 'johndoe@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA'
    },
    summary: 'Experienced software engineer with 5 years of experience in web development and team leadership.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        duration: '2021 - Present',
        description: 'Led development of web applications. Managed team of developers. Improved system performance.'
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        duration: '2019 - 2021',
        description: 'Developed features for mobile app. Worked with APIs. Fixed bugs and issues.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        year: '2019'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!supportedFormats.includes(fileExtension)) {
      alert('Please upload a supported file format: PDF, DOCX, DOC, or TXT');
      return;
    }

    setUploadedFile(file);
    setUploadStep('parsing');

    // Simulate parsing process
    setTimeout(() => {
      setParsedData(mockParsedData);
      setUploadStep('preview');
    }, 3000);
  };

  const handleEnhancementToggle = (goalId: string) => {
    setEnhancementGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleProceedToEditor = () => {
    // This would integrate with the main app flow
    alert('Would proceed to editor with parsed resume data and enhancement goals');
  };

  const renderUploadStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Import Your Resume</h1>
        <p className="text-lg text-gray-600">
          Upload your existing resume and we'll help you improve it with AI assistance.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Drop your resume here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            browse files
          </button>
        </h3>
        
        <p className="text-gray-500 mb-4">
          Supports: {supportedFormats.join(', ')}
        </p>
        
        <div className="text-sm text-gray-400">
          Maximum file size: 10MB
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Smart Parsing</h4>
          <p className="text-sm text-gray-600">AI extracts and organizes your information automatically</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">AI Enhancement</h4>
          <p className="text-sm text-gray-600">Get suggestions to improve content and formatting</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">ATS Ready</h4>
          <p className="text-sm text-gray-600">Ensure compatibility with applicant tracking systems</p>
        </div>
      </div>
    </div>
  );

  const renderParsingStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
        <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Parsing Your Resume</h2>
      <p className="text-gray-600 mb-8">
        Our AI is extracting and organizing your information...
      </p>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Processing: {uploadedFile?.name}</span>
          <span className="text-sm text-gray-500">{(uploadedFile?.size || 0) / 1024 / 1024 < 1 ? `${Math.round((uploadedFile?.size || 0) / 1024)}KB` : `${((uploadedFile?.size || 0) / 1024 / 1024).toFixed(1)}MB`}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
      
      <div className="text-left space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Extracting personal information</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Processing work experience</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Analyzing skills and education</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
          <span>Optimizing for ATS compatibility</span>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Extracted Information</h2>
        <p className="text-gray-600">
          Please review the information we extracted from your resume and make any necessary corrections.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Extracted Data */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={parsedData?.personalInfo.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={parsedData?.personalInfo.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={parsedData?.personalInfo.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
            <textarea
              value={parsedData?.summary || ''}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              readOnly
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {parsedData?.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience & Education */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Experience</h3>
            <div className="space-y-4">
              {parsedData?.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h4 className="font-medium text-gray-900">{exp.title}</h4>
                  <p className="text-gray-600 text-sm">{exp.company} • {exp.duration}</p>
                  <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Education</h3>
            <div className="space-y-3">
              {parsedData?.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600 text-sm">{edu.school} • {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => setUploadStep('enhance')}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <span>Continue to Enhancement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderEnhanceStep = () => (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How would you like to improve your resume?</h2>
        <p className="text-gray-600">
          Select the areas where you'd like AI assistance to enhance your resume.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {enhancementOptions.map(option => (
          <div
            key={option.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              enhancementGoals.includes(option.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleEnhancementToggle(option.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                enhancementGoals.includes(option.id)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {enhancementGoals.includes(option.id) && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{option.label}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Job-Specific Enhancement</h4>
            <p className="text-sm text-blue-700 mt-1">
              For the best results, you'll be able to input your target job description in the next step 
              to get personalized suggestions.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setUploadStep('preview')}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleProceedToEditor}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start AI Enhancement</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
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

        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { id: 'upload', label: 'Upload' },
              { id: 'parsing', label: 'Parse' },
              { id: 'preview', label: 'Review' },
              { id: 'enhance', label: 'Enhance' }
            ].map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  uploadStep === step.id
                    ? 'bg-blue-600 text-white'
                    : ['upload', 'parsing', 'preview'].indexOf(uploadStep) > ['upload', 'parsing', 'preview'].indexOf(step.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {['upload', 'parsing', 'preview'].indexOf(uploadStep) > ['upload', 'parsing', 'preview'].indexOf(step.id) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  uploadStep === step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < 3 && <div className="w-8 h-px bg-gray-300 mx-4"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {uploadStep === 'upload' && renderUploadStep()}
        {uploadStep === 'parsing' && renderParsingStep()}
        {uploadStep === 'preview' && renderPreviewStep()}
        {uploadStep === 'enhance' && renderEnhanceStep()}
      </div>
    </div>
  );
};

export default ImportResume;