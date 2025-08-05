import React, { useState, useCallback } from 'react';
import { ArrowLeft, Eye, Download, BarChart3, Sparkles, User, FileText as FileTextIcon, Briefcase, Award, BookOpen, Code, MessageSquare, PlusCircle, Menu, X, FileDown } from 'lucide-react';
import { Template } from '../App';
import ResumePreview from './ResumePreview';
import AIAssistant from './AIAssistant';
import DraggableContainer from './DraggableContainer';
import DraggableSection from './DraggableSection';
import { exportToPDF, exportToWord } from '../services/exportService';

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

// Updated ResumeData interface with all new sections
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
    tag?: string;
    techStack: string;
    date: string;
    bullets: string[];
    url?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
  }>;
  training: Array<{
    id: string;
    title: string;
    organizer: string;
    notes: string;
  }>;
  leadership: Array<{
    id: string;
    role: string;
    organization: string;
    description: string;
  }>;
  publications: Array<{
    id: string;
    title: string;
    link: string;
    description: string;
  }>;
  hackathons: Array<{
    id: string;
    name: string;
    rank: string;
    contribution: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    fluency: string;
  }>;
  customSections: Array<{
    id: string;
    title: string;
    items: Array<{
      id: string;
      content: string;
    }>;
  }>;
}

// Updated initial data with examples for new sections
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
  projects: [
    {
      id: 'proj1',
      name: 'AI-Powered Resume Builder',
      tag: 'Full-Stack',
      techStack: 'React, TypeScript, Node.js, TailwindCSS',
      date: 'Aug 2025',
      bullets: [
          'Developed a dynamic front-end with React for real-time resume editing.',
          'Implemented a Node.js backend to handle AI suggestions and data parsing.',
          'Designed ATS-friendly templates ensuring high compatibility.',
      ],
      url: 'https://github.com/RajivRatan27/resumebuildergpt'
    }
  ],
  certifications: [
      { id: 'cert1', name: 'Machine Learning', issuer: 'Coursera (Andrew Ng)', year: '2024' }
  ],
  training: [
      { id: 'train1', title: 'Advanced Docker Workshop', organizer: 'Amazon Web Services', notes: 'Learned container orchestration and scaling strategies.' }
  ],
  leadership: [
      { id: 'lead1', role: 'President', organization: 'Coding Club', description: 'Led a team of 50+ members and organized a university-wide hackathon.' }
  ],
  publications: [
    { id: 'pub1', title: 'The Future of AI in Web Development', link: 'medium.com/my-article', description: 'An overview of emerging AI trends.'}
  ],
  hackathons: [
    { id: 'hack1', name: 'Hack The World 2024', rank: '1st Place', contribution: 'Developed the winning full-stack application for social good.'}
  ],
  languages: [
      { id: 'lang1', name: 'English', fluency: 'Fluent' },
      { id: 'lang2', name: 'Hindi', fluency: 'Native' }
  ],
  customSections: []
};

const ResumeEditor: React.FC<ResumeEditorProps> = ({ template, jobDetails, onBack }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [showAI, setShowAI] = useState(false);
  const [atsScore] = useState(85); // Mock ATS score
  const [previewMode, setPreviewMode] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Section order for drag and drop
  const [sectionOrder] = useState<string[]>([
    'personal',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'training',
    'languages',
    'custom'
  ]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      await exportToPDF('resume-preview', `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      await exportToWord('resume-preview', `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.doc`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePersonalInfoChange = useCallback((field: string, value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value }}));
  }, []);

  const handleSummaryChange = useCallback((value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  }, []);

  // --- EXPERIENCE HANDLERS ---
  const handleExperienceChange = useCallback((index: number, field: string, value: any) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = { ...newExperience[index], [field]: value };
      return { ...prev, experience: newExperience };
    });
  }, []);

  const addExperience = useCallback(() => {
    const newExperience = { id: Date.now().toString(), title: 'Job Title', company: 'Company Name', location: 'City, State', startDate: '2023', endDate: '2024', current: false, bullets: ['Achievement or responsibility'] };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExperience] }));
  }, []);

  const removeExperience = useCallback((index: number) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  }, []);

  const handleExperienceBulletChange = useCallback((expIndex: number, bulletIndex: number, value: string) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      const newBullets = [...newExperience[expIndex].bullets];
      newBullets[bulletIndex] = value;
      newExperience[expIndex] = { ...newExperience[expIndex], bullets: newBullets };
      return { ...prev, experience: newExperience };
    });
  }, []);
  
  const addExperienceBullet = useCallback((expIndex: number) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      newExperience[expIndex].bullets.push('New achievement or responsibility');
      return { ...prev, experience: newExperience };
    });
  }, []);

  const removeExperienceBullet = useCallback((expIndex: number, bulletIndex: number) => {
    setResumeData(prev => {
      const newExperience = [...prev.experience];
      newExperience[expIndex].bullets = newExperience[expIndex].bullets.filter((_, i) => i !== bulletIndex);
      return { ...prev, experience: newExperience };
    });
  }, []);


  // --- EDUCATION HANDLERS ---
  const handleEducationChange = useCallback((index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  }, []);

  // --- SKILLS HANDLER ---
  const handleSkillsChange = useCallback((skills: string[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  }, []);
  
  // --- GENERIC SECTION HANDLERS ---
  const handleSectionChange = useCallback((section: keyof ResumeData, index: number, field: string, value: any) => {
      setResumeData(prev => {
          const newSectionData = [...(prev[section] as any[])];
          newSectionData[index] = { ...newSectionData[index], [field]: value };
          return { ...prev, [section]: newSectionData };
      });
  }, []);
  
  const addSectionItem = useCallback((section: keyof ResumeData, newItem: any) => {
      setResumeData(prev => ({ ...prev, [section]: [...(prev[section] as any[]), newItem] }));
  }, []);

  const removeSectionItem = useCallback((section: keyof ResumeData, index: number) => {
      setResumeData(prev => ({ ...prev, [section]: (prev[section] as any[]).filter((_, i) => i !== index) }));
  }, []);
  
  const handleSectionBulletChange = useCallback((section: 'projects', sectionIndex: number, bulletIndex: number, value: string) => {
    setResumeData(prev => {
      const newSectionData = [...prev[section]];
      const newBullets = [...newSectionData[sectionIndex].bullets];
      newBullets[bulletIndex] = value;
      newSectionData[sectionIndex] = { ...newSectionData[sectionIndex], bullets: newBullets };
      return { ...prev, [section]: newSectionData };
    });
  }, []);

  const addSectionBullet = useCallback((section: 'projects', sectionIndex: number) => {
      setResumeData(prev => {
          const newSectionData = [...prev[section]];
          newSectionData[sectionIndex].bullets.push('New bullet point');
          return { ...prev, [section]: newSectionData };
      });
  }, []);
  
  const removeSectionBullet = useCallback((section: 'projects', sectionIndex: number, bulletIndex: number) => {
    setResumeData(prev => {
      const newSectionData = [...prev[section]];
      newSectionData[sectionIndex].bullets = newSectionData[sectionIndex].bullets.filter((_, i) => i !== bulletIndex);
      return { ...prev, [section]: newSectionData };
    });
  }, []);
  
  // --- CUSTOM SECTION HANDLERS ---
  const addCustomSection = useCallback(() => {
      const newSection = { id: Date.now().toString(), title: 'New Section', items: [{ id: (Date.now() + 1).toString(), content: 'New item' }]};
      setResumeData(prev => ({ ...prev, customSections: [...prev.customSections, newSection] }));
  }, []);
  
  const handleCustomSectionTitleChange = useCallback((index: number, newTitle: string) => {
      setResumeData(prev => {
        const newSections = [...prev.customSections];
        newSections[index].title = newTitle;
        return { ...prev, customSections: newSections };
      });
  }, []);

  const addCustomSectionItem = useCallback((sectionIndex: number) => {
      setResumeData(prev => {
        const newSections = [...prev.customSections];
        newSections[sectionIndex].items.push({ id: Date.now().toString(), content: 'New detail or achievement' });
        return {...prev, customSections: newSections};
      });
  }, []);

  const handleCustomSectionItemChange = useCallback((sectionIndex: number, itemIndex: number, value: string) => {
      setResumeData(prev => {
        const newSections = [...prev.customSections];
        newSections[sectionIndex].items[itemIndex].content = value;
        return { ...prev, customSections: newSections };
      });
  }, []);
  
  const removeCustomSectionItem = useCallback((sectionIndex: number, itemIndex: number) => {
      setResumeData(prev => {
        const newSections = [...prev.customSections];
        newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
        return { ...prev, customSections: newSections };
      });
  }, []);

  // Handle section reordering
  const handleSectionReorder = useCallback(() => {
    // Section reordering functionality can be implemented here
    console.log('Section reorder triggered');
  }, []);

  const SectionWrapper: React.FC<{title: string; icon: React.ReactNode; onAddItem: () => void; addItemText: string; children: React.ReactNode}> = useCallback(({title, icon, onAddItem, addItemText, children}) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <button onClick={onAddItem} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{addItemText}</button>
      </div>
      {children}
    </div>
  ), []);

  // Function to render sections based on order
  const renderSection = useCallback((sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return (
          <DraggableSection key="personal" id="personal" className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input key="firstName" type="text" placeholder="First Name" value={resumeData.personalInfo.name.split(' ')[0] || ''} onChange={(e) => handlePersonalInfoChange('name', `${e.target.value} ${resumeData.personalInfo.name.split(' ').slice(1).join(' ')}`.trim())} className="w-full px-3 py-2 border rounded-lg"/>
              <input key="lastName" type="text" placeholder="Last Name" value={resumeData.personalInfo.name.split(' ').slice(1).join(' ') || ''} onChange={(e) => handlePersonalInfoChange('name', `${resumeData.personalInfo.name.split(' ')[0]} ${e.target.value}`.trim())} className="w-full px-3 py-2 border rounded-lg"/>
              <input key="email" type="email" placeholder="Email" value={resumeData.personalInfo.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
              <input key="phone" type="tel" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} className="w-full px-3 py-2 border rounded-lg"/>
            </div>
            <input key="location" type="text" placeholder="Location" value={resumeData.personalInfo.location} onChange={(e) => handlePersonalInfoChange('location', e.target.value)} className="w-full mt-4 px-3 py-2 border rounded-lg"/>
          </DraggableSection>
        );

      case 'summary':
        return (
          <DraggableSection key="summary" id="summary" className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
            </div>
            <textarea key="summary" value={resumeData.summary} onChange={(e) => handleSummaryChange(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg resize-none" placeholder="Write a brief professional summary..."/>
          </DraggableSection>
        );

      case 'experience':
        return (
          <DraggableSection key="experience" id="experience" className="mb-8">
            <SectionWrapper title="Experience" icon={<Briefcase className="w-4 h-4 text-green-600" />} onAddItem={addExperience} addItemText="Add Experience">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeExperience(index)} className="text-red-600 text-sm">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input key={`exp-${exp.id}-title`} type="text" placeholder="Job Title" value={exp.title} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input key={`exp-${exp.id}-company`} type="text" placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input key={`exp-${exp.id}-location`} type="text" placeholder="Location" value={exp.location} onChange={(e) => handleExperienceChange(index, 'location', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input key={`exp-${exp.id}-startDate`} type="text" placeholder="Start Date" value={exp.startDate} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input key={`exp-${exp.id}-endDate`} type="text" placeholder="End Date" value={exp.current ? 'Present' : exp.endDate} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} className="w-full p-2 border rounded-lg"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Bullet Points</label>
                    {exp.bullets.map((bullet, bIndex) => (
                      <div key={`exp-${exp.id}-bullet-${bIndex}`} className="flex items-center space-x-2 mb-1">
                        <input key={`exp-${exp.id}-bullet-input-${bIndex}`} type="text" value={bullet} onChange={(e) => handleExperienceBulletChange(index, bIndex, e.target.value)} className="flex-1 px-2 py-1 border rounded"/>
                        <button onClick={() => removeExperienceBullet(index, bIndex)} className="text-red-500 hover:text-red-700">X</button>
                      </div>
                    ))}
                    <button onClick={() => addExperienceBullet(index)} className="text-blue-600 text-sm mt-1">+ Add Bullet</button>
                  </div>
                </div>
              ))}
            </SectionWrapper>
          </DraggableSection>
        );

      case 'skills':
        return (
          <DraggableSection key="skills" id="skills" className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
            <input key="skills" type="text" value={resumeData.skills.join(', ')} onChange={(e) => handleSkillsChange(e.target.value.split(',').map(s => s.trim()))} className="w-full px-3 py-2 border rounded-lg" placeholder="JavaScript, React, Node.js..."/>
          </DraggableSection>
        );

      case 'projects':
        return (
          <DraggableSection key="projects" id="projects" className="mb-8">
            <SectionWrapper title="Projects" icon={<Code className="w-4 h-4 text-indigo-600" />} onAddItem={() => addSectionItem('projects', { id: Date.now().toString(), name: 'New Project', tag: '', techStack: '', date: '', bullets: [''] })} addItemText="Add Project">
              {resumeData.projects.map((proj, index) => (
                <div key={proj.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeSectionItem('projects', index)} className="text-red-600 text-sm">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input key={`proj-${proj.id}-name`} type="text" placeholder="Project Name" value={proj.name} onChange={(e) => handleSectionChange('projects', index, 'name', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input key={`proj-${proj.id}-tag`} type="text" placeholder="Tag (e.g., AI/ML)" value={proj.tag} onChange={(e) => handleSectionChange('projects', index, 'tag', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input key={`proj-${proj.id}-techStack`} type="text" placeholder="Tech Stack" value={proj.techStack} onChange={(e) => handleSectionChange('projects', index, 'techStack', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input key={`proj-${proj.id}-date`} type="text" placeholder="Date" value={proj.date} onChange={(e) => handleSectionChange('projects', index, 'date', e.target.value)} className="w-full p-2 border rounded-lg"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Bullet Points</label>
                    {proj.bullets.map((bullet, bIndex) => (
                      <div key={`proj-${proj.id}-bullet-${bIndex}`} className="flex items-center space-x-2 mb-1">
                        <input key={`proj-${proj.id}-bullet-input-${bIndex}`} type="text" value={bullet} onChange={(e) => handleSectionBulletChange('projects', index, bIndex, e.target.value)} className="flex-1 px-2 py-1 border rounded"/>
                        <button onClick={() => removeSectionBullet('projects', index, bIndex)} className="text-red-500 hover:text-red-700">X</button>
                      </div>
                    ))}
                    <button onClick={() => addSectionBullet('projects', index)} className="text-blue-600 text-sm mt-1">+ Add Bullet</button>
                  </div>
                </div>
              ))}
            </SectionWrapper>
          </DraggableSection>
        );

      case 'certifications':
        return (
          <DraggableSection key="certifications" id="certifications" className="mb-8">
            <SectionWrapper title="Certifications" icon={<Award className="w-4 h-4 text-yellow-600" />} onAddItem={() => addSectionItem('certifications', { id: Date.now().toString(), name: '', issuer: '', year: '' })} addItemText="Add Certificate">
              {resumeData.certifications.map((cert, index) => (
                <div key={cert.id} className="mb-2 p-3 border rounded-lg">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeSectionItem('certifications', index)} className="text-red-600 text-sm">Remove</button>
                  </div>
                  <input type="text" placeholder="Certificate Name" value={cert.name} onChange={(e) => handleSectionChange('certifications', index, 'name', e.target.value)} className="w-full p-2 border rounded-lg mb-2"/>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => handleSectionChange('certifications', index, 'issuer', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input type="text" placeholder="Year" value={cert.year} onChange={(e) => handleSectionChange('certifications', index, 'year', e.target.value)} className="w-full p-2 border rounded-lg"/>
                  </div>
                </div>
              ))}
            </SectionWrapper>
          </DraggableSection>
        );

      case 'training':
        return (
          <DraggableSection key="training" id="training" className="mb-8">
            <SectionWrapper title="Training & Workshops" icon={<BookOpen className="w-4 h-4 text-green-600" />} onAddItem={() => addSectionItem('training', { id: Date.now().toString(), title: '', organizer: '', notes: '' })} addItemText="Add Training">
              {resumeData.training.map((item, index) => (
                <div key={item.id} className="mb-2 p-3 border rounded-lg">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => removeSectionItem('training', index)} className="text-red-600 text-sm">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="text" placeholder="Workshop Title" value={item.title} onChange={(e) => handleSectionChange('training', index, 'title', e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input type="text" placeholder="Organizer" value={item.organizer} onChange={(e) => handleSectionChange('training', index, 'organizer', e.target.value)} className="w-full p-2 border rounded-lg"/>
                  </div>
                  <textarea placeholder="Key takeaways or notes..." value={item.notes} onChange={(e) => handleSectionChange('training', index, 'notes', e.target.value)} className="w-full p-2 border rounded-lg resize-none" rows={2}/>
                </div>
              ))}
            </SectionWrapper>
          </DraggableSection>
        );

      case 'languages':
        return (
          <DraggableSection key="languages" id="languages" className="mb-8">
            <SectionWrapper title="Languages" icon={<MessageSquare className="w-4 h-4 text-red-600" />} onAddItem={() => addSectionItem('languages', { id: Date.now().toString(), name: '', fluency: '' })} addItemText="Add Language">
              {resumeData.languages.map((lang, index) => (
                <div key={lang.id} className="flex items-center space-x-2 mb-2 p-2 border rounded-lg">
                  <input type="text" placeholder="Language" value={lang.name} onChange={(e) => handleSectionChange('languages', index, 'name', e.target.value)} className="flex-1 p-2 border rounded-lg"/>
                  <input type="text" placeholder="Fluency (e.g., Fluent, Native)" value={lang.fluency} onChange={(e) => handleSectionChange('languages', index, 'fluency', e.target.value)} className="flex-1 p-2 border rounded-lg"/>
                  <button onClick={() => removeSectionItem('languages', index)} className="text-red-500 hover:text-red-700">X</button>
                </div>
              ))}
            </SectionWrapper>
          </DraggableSection>
        );

      case 'custom':
        return (
          <DraggableSection key="custom" id="custom" className="mb-8">
            <SectionWrapper title="Custom Sections" icon={<PlusCircle className="w-4 h-4 text-purple-600" />} onAddItem={addCustomSection} addItemText="Add Custom Section">
              {resumeData.customSections.map((section, sIndex) => (
                <div key={section.id} className="mb-4 p-4 border border-purple-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <input type="text" value={section.title} onChange={(e) => handleCustomSectionTitleChange(sIndex, e.target.value)} className="text-md font-semibold border-b-2 border-purple-400 p-1 bg-transparent"/>
                    <button onClick={() => removeSectionItem('customSections', sIndex)} className="text-red-600 text-sm">Remove Section</button>
                  </div>
                  {section.items.map((item, iIndex) => (
                    <div key={item.id} className="flex items-center space-x-2 mb-2">
                      <span className="text-purple-500">•</span>
                      <input type="text" value={item.content} onChange={(e) => handleCustomSectionItemChange(sIndex, iIndex, e.target.value)} className="flex-1 px-2 py-1 border rounded"/>
                      <button onClick={() => removeCustomSectionItem(sIndex, iIndex)} className="text-red-500 hover:text-red-700">X</button>
                    </div>
                  ))}
                  <button onClick={() => addCustomSectionItem(sIndex)} className="text-purple-600 text-sm mt-2">+ Add Item</button>
                </div>
              ))}
            </SectionWrapper>
          </DraggableSection>
        );

      default:
        return null;
    }
  }, [resumeData, handlePersonalInfoChange, handleSummaryChange, handleExperienceChange, handleExperienceBulletChange, addExperience, removeExperience, addExperienceBullet, removeExperienceBullet, handleSkillsChange, handleSectionChange, handleSectionBulletChange, addSectionItem, removeSectionItem, addSectionBullet, removeSectionBullet, addCustomSection, handleCustomSectionTitleChange, addCustomSectionItem, handleCustomSectionItemChange, removeCustomSectionItem, SectionWrapper]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /><span>Back</span></button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Resume Editor</h1>
                <p className="text-sm text-gray-600">{template.name} • {jobDetails.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg"><BarChart3 className="w-4 h-4" /><span className="text-sm font-medium">ATS Score: {atsScore}%</span></div>
              <button onClick={() => setPreviewMode(!previewMode)} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"><Eye className="w-4 h-4" /><span>{previewMode ? 'Edit' : 'Preview'}</span></button>
              
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </>
                  )}
                </button>
                
                {showExportMenu && !isExporting && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-1">
                      <button
                        onClick={handleExportPDF}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileDown className="w-4 h-4 text-red-500" />
                        <span>Export as PDF</span>
                      </button>
                      <button
                        onClick={handleExportWord}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileDown className="w-4 h-4 text-blue-500" />
                        <span>Export as Word</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Side - Live Preview */}
        <div className={`${showEditor ? 'w-1/2' : 'w-full'} bg-gray-50 overflow-y-auto transition-all duration-300`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
              </div>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="flex items-center space-x-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                title={showEditor ? 'Hide Editor' : 'Show Editor'}
              >
                {showEditor ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span className="text-sm font-medium">Resume Editor</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div id="resume-preview">
                <ResumePreview
                  template={template}
                  resumeData={resumeData}
                  onUpdateResumeData={setResumeData}
                  activeSection={activeSection}
                  editMode={true}
                  sectionOrder={sectionOrder}
                  sectionOrder={sectionOrder}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Resume Information Form */}
        {showEditor && (
          <div className="w-1/2 bg-white border-l overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Information</h2>
              <p className="text-gray-600 mb-8">Fill out your information and see your resume update in real-time. Sections can be reordered by dragging in the preview.</p>

              <div className="space-y-8">
                {sectionOrder.map((sectionId) => renderSection(sectionId))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
};

export default ResumeEditor;