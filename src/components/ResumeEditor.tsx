import React, { useState } from 'react';
import { ArrowLeft, Eye, Download, BarChart3, Sparkles } from 'lucide-react';
import { Template } from '../App';
import ResumePreview from './ResumePreview';
import AIAssistant from './AIAssistant';

interface ResumeEditorProps {
  template: Template;
  jobDetails: JobDetails;
  onBack: () => void;
}

export interface JobDetails {
  title: string;
  description: string;
  industry: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    phone: '8989456718',
    location: 'Amsterdam',
    linkedin: 'linkedin.com/in/johndoe',
    website: 'johndoe.com'
  },
  summary: 'Write a brief professional summary highlighting your key qualifications and career objectives...',
  experience: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: '2024',
      current: false,
      bullets: [
        'Led development of microservices architecture serving 1M+ users',
        'Improved system performance by 40% through optimization',
        'Mentored 5 junior developers and conducted code reviews'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'Stanford University',
      location: 'Stanford, CA',
      graduationDate: '2019'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
  projects: [],
  certifications: []
};

const ResumeEditor: React.FC<ResumeEditorProps> = ({ template, jobDetails, onBack }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [showAI, setShowAI] = useState(false);
  const [atsScore] = useState(85); // Mock ATS score
  const [previewMode, setPreviewMode] = useState(false);

  const handleExportPDF = () => {
    // Placeholder for PDF export functionality
    alert('PDF export would be implemented with a library like jsPDF or html2pdf');
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSummaryChange = (value: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return {
        ...prev,
        experience: newExperience
      };
    });
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      const newBullets = [...newExperience[expIndex].bullets];
      newBullets[bulletIndex] = value;
      newExperience[expIndex] = { ...newExperience[expIndex], bullets: newBullets };
      return {
        ...prev,
        experience: newExperience
      };
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: 'Job Title',
      company: 'Company Name',
      location: 'City, State',
      startDate: '2023',
      endDate: '2024',
      current: false,
      bullets: ['Achievement or responsibility']
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addBullet = (expIndex: number) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      newExperience[expIndex].bullets.push('New achievement or responsibility');
      return {
        ...prev,
        experience: newExperience
      };
    });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      newExperience[expIndex].bullets = newExperience[expIndex].bullets.filter((_, i) => i !== bulletIndex);
      return {
        ...prev,
        experience: newExperience
      };
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return {
        ...prev,
        education: newEducation
      };
    });
  };

  const handleSkillsChange = (skills: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Resume Editor</h1>
                <p className="text-sm text-gray-600">{template.name} • {jobDetails.title}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* ATS Score */}
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">ATS Score: {atsScore}%</span>
              </div>

              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Edit' : 'Preview'}</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Side - Resume Information Form */}
        <div className="w-1/2 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Information</h2>
            <p className="text-gray-600 mb-8">Fill out your information and see your resume update in real-time</p>

            {/* Personal Information */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.name.split(' ')[0] || ''}
                    onChange={(e) => {
                      const lastName = resumeData.personalInfo.name.split(' ').slice(1).join(' ') || '';
                      handlePersonalInfoChange('name', `${e.target.value} ${lastName}`.trim());
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.name.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => {
                      const firstName = resumeData.personalInfo.name.split(' ')[0] || '';
                      handlePersonalInfoChange('name', `${firstName} ${e.target.value}`.trim());
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
                />
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                </div>
                <button
                  onClick={addExperience}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Experience
                </button>
              </div>
              
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={(e) => {
                          if (e.target.value === 'Present') {
                            handleExperienceChange(index, 'current', true);
                          } else {
                            handleExperienceChange(index, 'endDate', e.target.value);
                            handleExperienceChange(index, 'current', false);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points</label>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleBulletChange(index, bulletIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeBullet(index, bulletIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addBullet(index)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      + Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              </div>
              
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                      <input
                        type="text"
                        value={edu.graduationDate}
                        onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={resumeData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JavaScript, React, Node.js, Python..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Eye className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ResumePreview
                template={template}
                resumeData={resumeData}
                onUpdateResumeData={setResumeData}
                activeSection={activeSection}
                editMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;