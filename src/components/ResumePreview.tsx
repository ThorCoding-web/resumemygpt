import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, Trash2, Sparkles, GripVertical } from 'lucide-react';
import { Template } from '../App';
import { ResumeData } from './ResumeEditor';
import TemplatePreview from './TemplatePreview';
import RichTextEditor from './RichTextEditor';
import InlineTextEditor from './InlineTextEditor';
import DraggableContainer from './DraggableContainer';
import DraggableSection from './DraggableSection';

interface ResumePreviewProps {
  template: Template;
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
  activeSection: string;
  editMode: boolean;
  sectionOrder?: string[];
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ template, resumeData, onUpdateResumeData, activeSection, editMode, sectionOrder }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [localSectionOrder, setLocalSectionOrder] = useState<string[]>(
    sectionOrder || ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'custom']
  );
  
  useEffect(() => {
    if (sectionOrder) {
      setLocalSectionOrder(sectionOrder);
    }
  }, [sectionOrder]);

  const handleSectionReorder = useCallback((newOrder: string[]) => {
    setLocalSectionOrder(newOrder);
  }, []);

  const handlePersonalInfoChange = useCallback((field: string, value: string) => {
    onUpdateResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    });
  }, [resumeData, onUpdateResumeData]);

  const handleSummaryChange = useCallback((value: string) => {
    onUpdateResumeData({
      ...resumeData,
      summary: value
    });
  }, [resumeData, onUpdateResumeData]);

  const handleProjectChange = useCallback((index: number, field: string, value: any) => {
    const newProjects = [...resumeData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onUpdateResumeData({
      ...resumeData,
      projects: newProjects
    });
  }, [resumeData, onUpdateResumeData]);

  const handleProjectBulletChange = useCallback((projIndex: number, bulletIndex: number, value: string) => {
    const newProjects = [...resumeData.projects];
    const newBullets = [...newProjects[projIndex].bullets];
    newBullets[bulletIndex] = value;
    newProjects[projIndex] = { ...newProjects[projIndex], bullets: newBullets };
    onUpdateResumeData({
      ...resumeData,
      projects: newProjects
    });
  }, [resumeData, onUpdateResumeData]);

  const addProject = useCallback(() => {
    const newProject = {
      id: Date.now().toString(),
      name: 'New Project',
      tag: '',
      techStack: 'Technology Stack',
      date: '2024',
      bullets: ['Project achievement or description'],
      url: ''
    };
    onUpdateResumeData({
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    });
  }, [resumeData, onUpdateResumeData]);

  const removeProject = useCallback((index: number) => {
    const newProjects = resumeData.projects.filter((_, i) => i !== index);
    onUpdateResumeData({
      ...resumeData,
      projects: newProjects
    });
  }, [resumeData, onUpdateResumeData]);

  const addProjectBullet = useCallback((projIndex: number) => {
    const newProjects = [...resumeData.projects];
    newProjects[projIndex].bullets.push('New project achievement');
    onUpdateResumeData({
      ...resumeData,
      projects: newProjects
    });
  }, [resumeData, onUpdateResumeData]);

  const removeProjectBullet = useCallback((projIndex: number, bulletIndex: number) => {
    const newProjects = [...resumeData.projects];
    newProjects[projIndex].bullets = newProjects[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    onUpdateResumeData({
      ...resumeData,
      projects: newProjects
    });
  }, [resumeData, onUpdateResumeData]);

  const handleCertificationChange = useCallback((index: number, field: string, value: string) => {
    const newCertifications = [...resumeData.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    onUpdateResumeData({
      ...resumeData,
      certifications: newCertifications
    });
  }, [resumeData, onUpdateResumeData]);

  const addCertification = useCallback(() => {
    const newCertification = {
      id: Date.now().toString(),
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      year: '2024'
    };
    onUpdateResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, newCertification]
    });
  }, [resumeData, onUpdateResumeData]);

  const removeCertification = useCallback((index: number) => {
    const newCertifications = resumeData.certifications.filter((_, i) => i !== index);
    onUpdateResumeData({
      ...resumeData,
      certifications: newCertifications
    });
  }, [resumeData, onUpdateResumeData]);

  const handleLanguageChange = useCallback((index: number, field: string, value: string) => {
    const newLanguages = [...resumeData.languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    onUpdateResumeData({
      ...resumeData,
      languages: newLanguages
    });
  }, [resumeData, onUpdateResumeData]);

  const addLanguage = useCallback(() => {
    const newLanguage = {
      id: Date.now().toString(),
      name: 'Language',
      fluency: 'Fluency Level'
    };
    onUpdateResumeData({
      ...resumeData,
      languages: [...resumeData.languages, newLanguage]
    });
  }, [resumeData, onUpdateResumeData]);

  const removeLanguage = useCallback((index: number) => {
    const newLanguages = resumeData.languages.filter((_, i) => i !== index);
    onUpdateResumeData({
      ...resumeData,
      languages: newLanguages
    });
  }, [resumeData, onUpdateResumeData]);

  const handleCustomSectionChange = useCallback((sectionIndex: number, field: string, value: string) => {
    const newCustomSections = [...resumeData.customSections];
    newCustomSections[sectionIndex] = { ...newCustomSections[sectionIndex], [field]: value };
    onUpdateResumeData({
      ...resumeData,
      customSections: newCustomSections
    });
  }, [resumeData, onUpdateResumeData]);

  const handleCustomSectionItemChange = useCallback((sectionIndex: number, itemIndex: number, value: string) => {
    const newCustomSections = [...resumeData.customSections];
    newCustomSections[sectionIndex].items[itemIndex].content = value;
    onUpdateResumeData({
      ...resumeData,
      customSections: newCustomSections
    });
  }, [resumeData, onUpdateResumeData]);

  const addCustomSection = useCallback(() => {
    const newSection = {
      id: Date.now().toString(),
      title: 'Custom Section',
      items: [{ id: (Date.now() + 1).toString(), content: 'Custom item' }]
    };
    onUpdateResumeData({
      ...resumeData,
      customSections: [...resumeData.customSections, newSection]
    });
  }, [resumeData, onUpdateResumeData]);

  const removeCustomSection = useCallback((index: number) => {
    const newCustomSections = resumeData.customSections.filter((_, i) => i !== index);
    onUpdateResumeData({
      ...resumeData,
      customSections: newCustomSections
    });
  }, [resumeData, onUpdateResumeData]);

  const addCustomSectionItem = useCallback((sectionIndex: number) => {
    const newCustomSections = [...resumeData.customSections];
    newCustomSections[sectionIndex].items.push({
      id: Date.now().toString(),
      content: 'New custom item'
    });
    onUpdateResumeData({
      ...resumeData,
      customSections: newCustomSections
    });
  }, [resumeData, onUpdateResumeData]);

  const removeCustomSectionItem = useCallback((sectionIndex: number, itemIndex: number) => {
    const newCustomSections = [...resumeData.customSections];
    newCustomSections[sectionIndex].items = newCustomSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    onUpdateResumeData({
      ...resumeData,
      customSections: newCustomSections
    });
  }, [resumeData, onUpdateResumeData]);

  const handleExperienceChange = useCallback((index: number, field: string, value: any) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onUpdateResumeData({
      ...resumeData,
      experience: newExperience
    });
  }, [resumeData, onUpdateResumeData]);

  const handleBulletChange = useCallback((expIndex: number, bulletIndex: number, value: string) => {
    const newExperience = [...resumeData.experience];
    const newBullets = [...newExperience[expIndex].bullets];
    newBullets[bulletIndex] = value;
    newExperience[expIndex] = { ...newExperience[expIndex], bullets: newBullets };
    onUpdateResumeData({
      ...resumeData,
      experience: newExperience
    });
  }, [resumeData, onUpdateResumeData]);

  const addExperience = useCallback(() => {
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
    onUpdateResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    });
  }, [resumeData, onUpdateResumeData]);

  const removeExperience = useCallback((index: number) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    onUpdateResumeData({
      ...resumeData,
      experience: newExperience
    });
  }, [resumeData, onUpdateResumeData]);

  const addBullet = useCallback((expIndex: number) => {
    const newExperience = [...resumeData.experience];
    newExperience[expIndex].bullets.push('New achievement or responsibility');
    onUpdateResumeData({
      ...resumeData,
      experience: newExperience
    });
  }, [resumeData, onUpdateResumeData]);

  const removeBullet = useCallback((expIndex: number, bulletIndex: number) => {
    const newExperience = [...resumeData.experience];
    newExperience[expIndex].bullets = newExperience[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onUpdateResumeData({
      ...resumeData,
      experience: newExperience
    });
  }, [resumeData, onUpdateResumeData]);

  const handleEducationChange = useCallback((index: number, field: string, value: string) => {
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onUpdateResumeData({
      ...resumeData,
      education: newEducation
    });
  }, [resumeData, onUpdateResumeData]);

  const handleSkillsChange = useCallback((skills: string[]) => {
    onUpdateResumeData({
      ...resumeData,
      skills
    });
  }, [resumeData, onUpdateResumeData]);

  const EditableField: React.FC<{
    fieldId: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
  }> = ({ fieldId, value, onChange, className = '', multiline = false, placeholder }) => {
    const isEditing = editingField === fieldId;

    const handleFocus = () => {
      if (editMode) {
        setEditingField(fieldId);
      }
    };

    const handleBlur = () => {
      setEditingField(null);
    };

    // If not in edit mode, just show the text
    if (!editMode) {
      if (multiline) {
        return (
          <div className={`whitespace-pre-wrap ${className}`}>
            {value || placeholder}
          </div>
        );
      }
      return (
        <span className={className}>
          {value || placeholder}
        </span>
      );
    }

    // Use RichTextEditor for summary (multiline with formatting)
    if (fieldId === 'summary') {
      return (
        <InlineTextEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          isEditing={isEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={true}
        />
      );
    }

    // Use InlineTextEditor for other fields
    return (
      <InlineTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        isEditing={isEditing}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline={multiline}
      />
    );
  };

  const SectionHeader: React.FC<{ title: string; sectionId: string; onAIImprove?: () => void }> = ({ 
    title, 
    sectionId, 
    onAIImprove 
  }) => (
    <div className={`flex items-center justify-between mb-4 group ${activeSection === sectionId ? 'bg-blue-50 -mx-2 px-2 py-1 rounded' : ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
      {editMode && onAIImprove && (
        <button
          onClick={onAIImprove}
          className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Sparkles className="w-3 h-3" />
          <span>Improve</span>
        </button>
      )}
    </div>
  );

  // Create a wrapper that provides editing functionality over the template preview
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return (
          <div key="personal" className="group mb-8">
            <div className={`text-center border-b pb-6 mb-8 ${activeSection === 'personal' ? 'bg-blue-50 -mx-2 px-2 py-1 rounded' : ''}`}>
              <h1 className="font-bold text-gray-900 text-3xl mb-2">
                <EditableField
                  fieldId="name"
                  value={resumeData.personalInfo.name}
                  onChange={(value) => handlePersonalInfoChange('name', value)}
                />
              </h1>
              <div className="text-gray-600">
                <div>
                  <EditableField
                    fieldId="email"
                    value={resumeData.personalInfo.email}
                    onChange={(value) => handlePersonalInfoChange('email', value)}
                  />
                  {' • '}
                  <EditableField
                    fieldId="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(value) => handlePersonalInfoChange('phone', value)}
                  />
                </div>
                <div>
                  <EditableField
                    fieldId="location"
                    value={resumeData.personalInfo.location}
                    onChange={(value) => handlePersonalInfoChange('location', value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div key="summary" className="group mb-8">
            <SectionHeader title="Professional Summary" sectionId="summary" />
            <EditableField
              fieldId="summary"
              value={resumeData.summary}
              onChange={handleSummaryChange}
              className="text-gray-700 leading-relaxed"
              multiline
            />
          </div>
        );

      case 'experience':
        return (
          <div key="experience" className="group mb-8">
            <SectionHeader title="Experience" sectionId="experience" />
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="mb-6 last:mb-0 relative group">
                {editMode && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      <EditableField
                        fieldId={`exp-title-${index}`}
                        value={exp.title}
                        onChange={(value) => handleExperienceChange(index, 'title', value)}
                      />
                    </h4>
                    <div className="text-gray-600 font-medium">
                      <EditableField
                        fieldId={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(value) => handleExperienceChange(index, 'company', value)}
                      />
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    <EditableField
                      fieldId={`exp-dates-${index}`}
                      value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`}
                      onChange={(value) => {
                        const [start, end] = value.split(' - ');
                        handleExperienceChange(index, 'startDate', start);
                        if (end !== 'Present') {
                          handleExperienceChange(index, 'endDate', end);
                          handleExperienceChange(index, 'current', false);
                        } else {
                          handleExperienceChange(index, 'current', true);
                        }
                      }}
                    />
                  </div>
                </div>
                <ul className="space-y-1 ml-4">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start group">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <div className="flex-1 relative">
                        <EditableField
                          fieldId={`bullet-${index}-${bulletIndex}`}
                          value={bullet}
                          onChange={(value) => handleBulletChange(index, bulletIndex, value)}
                          className="text-gray-700"
                        />
                        {editMode && (
                          <button
                            onClick={() => removeBullet(index, bulletIndex)}
                            className="absolute -right-6 top-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                  {editMode && (
                    <li>
                      <button
                        onClick={() => addBullet(index)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add bullet</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
            {editMode && (
              <button
                onClick={addExperience}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            )}
          </div>
        );

      case 'education':
        return (
          <div key="education" className="group mb-8">
            <SectionHeader title="Education" sectionId="education" />
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="mb-4 last:mb-0">
                <h4 className="font-semibold text-gray-900">
                  <EditableField
                    fieldId={`edu-degree-${index}`}
                    value={edu.degree}
                    onChange={(value) => handleEducationChange(index, 'degree', value)}
                  />
                </h4>
                <div className="text-gray-600">
                  <EditableField
                    fieldId={`edu-school-${index}`}
                    value={edu.school}
                    onChange={(value) => handleEducationChange(index, 'school', value)}
                  />
                  {edu.graduationDate && (
                    <>
                      {' • '}
                      <EditableField
                        fieldId={`edu-date-${index}`}
                        value={edu.graduationDate}
                        onChange={(value) => handleEducationChange(index, 'graduationDate', value)}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div key="skills" className="group mb-8">
            <SectionHeader title="Skills" sectionId="skills" />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!resumeData.projects || resumeData.projects.length === 0) return null;
        return (
          <div key="projects" className="group mb-8">
            <SectionHeader title="Projects" sectionId="projects" />
            {resumeData.projects.map((project, index) => (
              <div key={project.id} className="mb-6 last:mb-0 relative group">
                {editMode && (
                  <button
                    onClick={() => removeProject(index)}
                    className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      <EditableField
                        fieldId={`proj-name-${index}`}
                        value={project.name}
                        onChange={(value) => handleProjectChange(index, 'name', value)}
                      />
                      {project.tag && (
                        <span className="text-blue-600 ml-2">
                          (<EditableField
                            fieldId={`proj-tag-${index}`}
                            value={project.tag}
                            onChange={(value) => handleProjectChange(index, 'tag', value)}
                          />)
                        </span>
                      )}
                    </h4>
                    <div className="text-gray-600 text-sm">
                      <EditableField
                        fieldId={`proj-tech-${index}`}
                        value={project.techStack}
                        onChange={(value) => handleProjectChange(index, 'techStack', value)}
                      />
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    <EditableField
                      fieldId={`proj-date-${index}`}
                      value={project.date}
                      onChange={(value) => handleProjectChange(index, 'date', value)}
                    />
                  </div>
                </div>
                <ul className="space-y-1 ml-4">
                  {project.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start group">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <div className="flex-1 relative">
                        <EditableField
                          fieldId={`proj-bullet-${index}-${bulletIndex}`}
                          value={bullet}
                          onChange={(value) => handleProjectBulletChange(index, bulletIndex, value)}
                          className="text-gray-700"
                        />
                        {editMode && (
                          <button
                            onClick={() => removeProjectBullet(index, bulletIndex)}
                            className="absolute -right-6 top-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                  {editMode && (
                    <li>
                      <button
                        onClick={() => addProjectBullet(index)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add bullet</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
            {editMode && (
              <button
                onClick={addProject}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            )}
          </div>
        );

      case 'certifications':
        if (!resumeData.certifications || resumeData.certifications.length === 0) return null;
        return (
          <div key="certifications" className="group mb-8">
            <SectionHeader title="Certifications" sectionId="certifications" />
            {resumeData.certifications.map((cert, index) => (
              <div key={cert.id} className="mb-4 last:mb-0 relative group">
                {editMode && (
                  <button
                    onClick={() => removeCertification(index)}
                    className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <h4 className="font-semibold text-gray-900">
                  <EditableField
                    fieldId={`cert-name-${index}`}
                    value={cert.name}
                    onChange={(value) => handleCertificationChange(index, 'name', value)}
                  />
                </h4>
                <div className="text-gray-600">
                  <EditableField
                    fieldId={`cert-issuer-${index}`}
                    value={cert.issuer}
                    onChange={(value) => handleCertificationChange(index, 'issuer', value)}
                  />
                  {cert.year && (
                    <>
                      {' • '}
                      <EditableField
                        fieldId={`cert-year-${index}`}
                        value={cert.year}
                        onChange={(value) => handleCertificationChange(index, 'year', value)}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
            {editMode && (
              <button
                onClick={addCertification}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certification</span>
              </button>
            )}
          </div>
        );

      case 'languages':
        if (!resumeData.languages || resumeData.languages.length === 0) return null;
        return (
          <div key="languages" className="group mb-8">
            <SectionHeader title="Languages" sectionId="languages" />
            <div className="flex flex-wrap gap-2">
              {resumeData.languages.map((lang, index) => (
                <span key={lang.id} className="text-gray-700">
                  <EditableField
                    fieldId={`lang-name-${index}`}
                    value={lang.name}
                    onChange={(value) => handleLanguageChange(index, 'name', value)}
                  />
                  {' ('}
                  <EditableField
                    fieldId={`lang-fluency-${index}`}
                    value={lang.fluency}
                    onChange={(value) => handleLanguageChange(index, 'fluency', value)}
                  />
                  {')'}
                  {index < resumeData.languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
            {editMode && (
              <button
                onClick={addLanguage}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Language</span>
              </button>
            )}
          </div>
        );

      case 'custom':
        if (!resumeData.customSections || resumeData.customSections.length === 0) return null;
        return (
          <>
            {resumeData.customSections.map((section, sectionIndex) => (
              <div key={section.id} className="group mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
                    <EditableField
                      fieldId={`custom-title-${sectionIndex}`}
                      value={section.title}
                      onChange={(value) => handleCustomSectionChange(sectionIndex, 'title', value)}
                    />
                  </h3>
                  {editMode && (
                    <button
                      onClick={() => removeCustomSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <ul className="space-y-1 ml-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={item.id} className="flex items-start group">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <div className="flex-1 relative">
                        <EditableField
                          fieldId={`custom-item-${sectionIndex}-${itemIndex}`}
                          value={item.content}
                          onChange={(value) => handleCustomSectionItemChange(sectionIndex, itemIndex, value)}
                          className="text-gray-700"
                        />
                        {editMode && (
                          <button
                            onClick={() => removeCustomSectionItem(sectionIndex, itemIndex)}
                            className="absolute -right-6 top-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                  {editMode && (
                    <li>
                      <button
                        onClick={() => addCustomSectionItem(sectionIndex)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add item</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
            {editMode && (
              <button
                onClick={addCustomSection}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Section</span>
              </button>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const renderEditableTemplate = () => {
    // Side Stripe Template
    if (template.id === 'side-stripe') {
      return (
        <div className="bg-white shadow-lg grid grid-cols-3 gap-0 max-w-[8.5in] mx-auto">
          {/* Sidebar */}
          <div className="bg-gray-800 text-white p-6 col-span-1">
            <div className="group">
              <h1 className="text-2xl font-bold mb-1">
                <EditableField
                  fieldId="name"
                  value={resumeData.personalInfo.name}
                  onChange={(value) => handlePersonalInfoChange('name', value)}
                  className="text-white"
                />
              </h1>
              <div className="space-y-1 text-sm">
                <EditableField
                  fieldId="email"
                  value={resumeData.personalInfo.email}
                  onChange={(value) => handlePersonalInfoChange('email', value)}
                  className="text-gray-300"
                />
                <EditableField
                  fieldId="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(value) => handlePersonalInfoChange('phone', value)}
                  className="text-gray-300"
                />
                <EditableField
                  fieldId="location"
                  value={resumeData.personalInfo.location}
                  onChange={(value) => handlePersonalInfoChange('location', value)}
                  className="text-gray-300"
                />
              </div>
            </div>

            <div className="mt-8 group">
              <SectionHeader title="Skills" sectionId="skills" />
              <div className="space-y-1 text-sm">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="text-gray-300">{skill}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-2 p-6">
            <div className="group mb-8">
              <SectionHeader title="Summary" sectionId="summary" />
              <EditableField
                fieldId="summary"
                value={resumeData.summary}
                onChange={handleSummaryChange}
                className="text-gray-700 leading-relaxed"
                multiline
              />
            </div>

            <div className="group mb-8">
              <SectionHeader title="Experience" sectionId="experience" />
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="mb-6 last:mb-0 relative group">
                  {editMode && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="mb-2">
                    <h4 className="font-semibold text-gray-900">
                      <EditableField
                        fieldId={`exp-title-${index}`}
                        value={exp.title}
                        onChange={(value) => handleExperienceChange(index, 'title', value)}
                      />
                    </h4>
                    <div className="text-gray-600 font-medium">
                      <EditableField
                        fieldId={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(value) => handleExperienceChange(index, 'company', value)}
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      <EditableField
                        fieldId={`exp-dates-${index}`}
                        value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`}
                        onChange={(value) => {
                          const [start, end] = value.split(' - ');
                          handleExperienceChange(index, 'startDate', start);
                          if (end !== 'Present') {
                            handleExperienceChange(index, 'endDate', end);
                            handleExperienceChange(index, 'current', false);
                          } else {
                            handleExperienceChange(index, 'current', true);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start group">
                        <span className="text-gray-400 mr-2 mt-1.5">•</span>
                        <div className="flex-1 relative">
                          <EditableField
                            fieldId={`bullet-${index}-${bulletIndex}`}
                            value={bullet}
                            onChange={(value) => handleBulletChange(index, bulletIndex, value)}
                            className="text-gray-700"
                          />
                          {editMode && (
                            <button
                              onClick={() => removeBullet(index, bulletIndex)}
                              className="absolute -right-6 top-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                    {editMode && (
                      <li>
                        <button
                          onClick={() => addBullet(index)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add bullet</span>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
              {editMode && (
                <button
                  onClick={addExperience}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-4"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              )}
            </div>

            <div className="group">
              <SectionHeader title="Education" sectionId="education" />
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="mb-4 last:mb-0">
                  <h4 className="font-semibold text-gray-900">
                    <EditableField
                      fieldId={`edu-degree-${index}`}
                      value={edu.degree}
                      onChange={(value) => handleEducationChange(index, 'degree', value)}
                    />
                  </h4>
                  <div className="text-gray-600">
                    <EditableField
                      fieldId={`edu-school-${index}`}
                      value={edu.school}
                      onChange={(value) => handleEducationChange(index, 'school', value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Classic Chronological Template
    if (template.id === 'classic-chrono') {
      return (
        <div className="bg-white shadow-lg max-w-[8.5in] mx-auto p-8 relative">
          {editMode && (
            <DraggableContainer
              items={localSectionOrder}
              onReorder={handleSectionReorder}
              className="space-y-0"
            >
              {localSectionOrder.map((sectionId) => (
                <DraggableSection key={sectionId} id={sectionId}>
                  {renderSection(sectionId)}
                </DraggableSection>
              ))}
            </DraggableContainer>
          )}
          {!editMode && (
            <>
              {localSectionOrder.map((sectionId) => renderSection(sectionId))}
            </>
          )}
        </div>
      );
    }

    // Modern Minimalist Template
    if (template.id === 'modern-minimalist') {
      return (
        <div className="bg-white shadow-lg border-l-4 border-blue-500 max-w-[8.5in] mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-gray-900 text-3xl mb-2">
              <EditableField
                fieldId="name"
                value={resumeData.personalInfo.name}
                onChange={(value) => handlePersonalInfoChange('name', value)}
              />
            </h1>
            <div className="text-blue-600 font-medium">
              <EditableField
                fieldId="email"
                value={resumeData.personalInfo.email}
                onChange={(value) => handlePersonalInfoChange('email', value)}
              />
            </div>
            <div className="text-gray-600">
              <EditableField
                fieldId="phone"
                value={resumeData.personalInfo.phone}
                onChange={(value) => handlePersonalInfoChange('phone', value)}
              />
              {' • '}
              <EditableField
                fieldId="location"
                value={resumeData.personalInfo.location}
                onChange={(value) => handlePersonalInfoChange('location', value)}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <SectionHeader title="SUMMARY" sectionId="summary" />
            <EditableField
              fieldId="summary"
              value={resumeData.summary}
              onChange={handleSummaryChange}
              className="text-gray-700 leading-relaxed"
              multiline
            />
          </div>

          {/* Experience */}
          <div className="mb-6">
            <SectionHeader title="EXPERIENCE" sectionId="experience" />
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="mb-4 relative group">
                {editMode && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute -right-2 -top-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <h4 className="font-semibold text-gray-900">
                  <EditableField
                    fieldId={`exp-title-${index}`}
                    value={exp.title}
                    onChange={(value) => handleExperienceChange(index, 'title', value)}
                  />
                </h4>
                <div className="text-gray-600 font-medium">
                  <EditableField
                    fieldId={`exp-company-${index}`}
                    value={exp.company}
                    onChange={(value) => handleExperienceChange(index, 'company', value)}
                  />
                  {' | '}
                  <EditableField
                    fieldId={`exp-dates-${index}`}
                    value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`}
                    onChange={(value) => {
                      const [start, end] = value.split(' - ');
                      handleExperienceChange(index, 'startDate', start);
                      if (end !== 'Present') {
                        handleExperienceChange(index, 'endDate', end);
                        handleExperienceChange(index, 'current', false);
                      } else {
                        handleExperienceChange(index, 'current', true);
                      }
                    }}
                  />
                </div>
                <ul className="space-y-1 mt-2">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start group">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <div className="flex-1 relative">
                        <EditableField
                          fieldId={`bullet-${index}-${bulletIndex}`}
                          value={bullet}
                          onChange={(value) => handleBulletChange(index, bulletIndex, value)}
                          className="text-gray-700"
                        />
                        {editMode && (
                          <button
                            onClick={() => removeBullet(index, bulletIndex)}
                            className="absolute -right-6 top-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                  {editMode && (
                    <li>
                      <button
                        onClick={() => addBullet(index)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add bullet</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
            {editMode && (
              <button
                onClick={addExperience}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            )}
          </div>

          {/* Education & Skills */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <SectionHeader title="EDUCATION" sectionId="education" />
              {resumeData.education.map((edu, index) => (
                <div key={edu.id}>
                  <h4 className="font-semibold text-gray-900">
                    <EditableField
                      fieldId={`edu-degree-${index}`}
                      value={edu.degree}
                      onChange={(value) => handleEducationChange(index, 'degree', value)}
                    />
                  </h4>
                  <div className="text-gray-600">
                    <EditableField
                      fieldId={`edu-school-${index}`}
                      value={edu.school}
                      onChange={(value) => handleEducationChange(index, 'school', value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <SectionHeader title="SKILLS" sectionId="skills" />
              <div className="space-y-1">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="text-gray-700">• {skill}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Plain Pro Template
    if (template.id === 'plain-pro') {
      return (
        <div className="bg-white shadow-sm border max-w-[8.5in] mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-bold text-gray-900 text-2xl mb-1">
              <EditableField
                fieldId="name"
                value={resumeData.personalInfo.name}
                onChange={(value) => handlePersonalInfoChange('name', value)}
              />
            </h1>
            <div className="text-gray-600">
              <EditableField
                fieldId="email"
                value={resumeData.personalInfo.email}
                onChange={(value) => handlePersonalInfoChange('email', value)}
              />
              {' | '}
              <EditableField
                fieldId="phone"
                value={resumeData.personalInfo.phone}
                onChange={(value) => handlePersonalInfoChange('phone', value)}
              />
              {' | '}
              <EditableField
                fieldId="location"
                value={resumeData.personalInfo.location}
                onChange={(value) => handlePersonalInfoChange('location', value)}
              />
            </div>
          </div>
      
          {/* Summary */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-2">PROFESSIONAL SUMMARY</h3>
            <hr className="mb-2" />
            <EditableField
              fieldId="summary"
              value={resumeData.summary}
              onChange={handleSummaryChange}
              className="text-gray-700"
              multiline
            />
          </div>
      
          {/* Experience */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-2">PROFESSIONAL EXPERIENCE</h3>
            <hr className="mb-2" />
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="mb-3 relative group">
                <div className="flex justify-between">
                  <h4 className="font-bold text-gray-900">
                    <EditableField
                      fieldId={`exp-title-${index}`}
                      value={exp.title}
                      onChange={(value) => handleExperienceChange(index, 'title', value)}
                    />
                  </h4>
                  <span className="text-gray-600">
                    <EditableField
                      fieldId={`exp-dates-${index}`}
                      value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`}
                      onChange={(value) => {
                        const [start, end] = value.split(' - ');
                        handleExperienceChange(index, 'startDate', start);
                        if (end !== 'Present') {
                          handleExperienceChange(index, 'endDate', end);
                          handleExperienceChange(index, 'current', false);
                        } else {
                          handleExperienceChange(index, 'current', true);
                        }
                      }}
                    />
                  </span>
                </div>
                <div className="font-semibold text-gray-700">
                   <EditableField
                      fieldId={`exp-company-${index}`}
                      value={exp.company}
                      onChange={(value) => handleExperienceChange(index, 'company', value)}
                    />
                </div>
                <ul className="mt-1">
                  {exp.bullets.map((bullet, bulletIndex) => (
                     <li key={bulletIndex} className="flex items-start group">
                      <span className="text-gray-600 mr-2 mt-1">•</span>
                       <div className="flex-1 relative">
                         <EditableField
                           fieldId={`bullet-${index}-${bulletIndex}`}
                           value={bullet}
                           onChange={(value) => handleBulletChange(index, bulletIndex, value)}
                           className="text-gray-700"
                         />
                       </div>
                     </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
      
          {/* Education */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 mb-2">EDUCATION</h3>
            <hr className="mb-2" />
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">
                    <EditableField
                      fieldId={`edu-degree-${index}`}
                      value={edu.degree}
                      onChange={(value) => handleEducationChange(index, 'degree', value)}
                    />
                  </h4>
                  <div className="text-gray-700">
                    <EditableField
                      fieldId={`edu-school-${index}`}
                      value={edu.school}
                      onChange={(value) => handleEducationChange(index, 'school', value)}
                    />
                  </div>
                </div>
                <span className="text-gray-600">
                  <EditableField
                    fieldId={`edu-date-${index}`}
                    value={edu.graduationDate}
                    onChange={(value) => handleEducationChange(index, 'graduationDate', value)}
                  />
                </span>
              </div>
            ))}
          </div>
      
          {/* Skills */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">TECHNICAL SKILLS</h3>
            <hr className="mb-2" />
            <p className="text-gray-700">{resumeData.skills.join(', ')}</p>
          </div>
        </div>
      );
    }

    // Smart Accent Template
    if (template.id === 'smart-accent') {
      // PASTE THIS CODE FOR 'smart-accent'
return (
  <div className="bg-white shadow-lg max-w-[8.5in] mx-auto">
    <div className="p-8">
      {/* Header with accent */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 mb-6 -mx-8 -mt-8">
        <h1 className="font-bold text-3xl mb-2">
          <EditableField
            fieldId="name"
            value={resumeData.personalInfo.name}
            onChange={(value) => handlePersonalInfoChange('name', value)}
            className="text-white"
          />
        </h1>
        <div className="space-y-1">
          <div>
            <EditableField
              fieldId="email"
              value={resumeData.personalInfo.email}
              onChange={(value) => handlePersonalInfoChange('email', value)}
               className="text-gray-200"
            />
            {' • '}
            <EditableField
              fieldId="phone"
              value={resumeData.personalInfo.phone}
              onChange={(value) => handlePersonalInfoChange('phone', value)}
               className="text-gray-200"
            />
          </div>
          <div>
            <EditableField
              fieldId="location"
              value={resumeData.personalInfo.location}
              onChange={(value) => handlePersonalInfoChange('location', value)}
               className="text-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="font-semibold text-purple-600 border-b-2 border-purple-200 mb-3 pb-1">
          PROFESSIONAL SUMMARY
        </h3>
        <EditableField
          fieldId="summary"
          value={resumeData.summary}
          onChange={handleSummaryChange}
          className="text-gray-700 leading-relaxed"
          multiline
        />
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h3 className="font-semibold text-purple-600 border-b-2 border-purple-200 mb-3 pb-1">
          EXPERIENCE
        </h3>
        {resumeData.experience.map((exp, index) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">
                  <EditableField
                    fieldId={`exp-title-${index}`}
                    value={exp.title}
                    onChange={(value) => handleExperienceChange(index, 'title', value)}
                  />
                </h4>
                <div className="text-purple-600 font-medium">
                  <EditableField
                    fieldId={`exp-company-${index}`}
                    value={exp.company}
                    onChange={(value) => handleExperienceChange(index, 'company', value)}
                  />
                </div>
              </div>
              <div className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                <EditableField
                  fieldId={`exp-dates-${index}`}
                  value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`}
                  onChange={(value) => {
                    const [start, end] = value.split(' - ');
                    handleExperienceChange(index, 'startDate', start);
                    if (end !== 'Present') {
                      handleExperienceChange(index, 'endDate', end);
                      handleExperienceChange(index, 'current', false);
                    } else {
                      handleExperienceChange(index, 'current', true);
                    }
                  }}
                />
              </div>
            </div>
            <ul className="space-y-1 ml-4">
              {exp.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-1">▸</span>
                  <div className="flex-1 relative">
                    <EditableField
                      fieldId={`bullet-${index}-${bulletIndex}`}
                      value={bullet}
                      onChange={(value) => handleBulletChange(index, bulletIndex, value)}
                      className="text-gray-700"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-purple-600 border-b-2 border-purple-200 mb-3 pb-1">
            EDUCATION
          </h3>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id}>
              <h4 className="font-semibold text-gray-900">
                <EditableField
                  fieldId={`edu-degree-${index}`}
                  value={edu.degree}
                  onChange={(value) => handleEducationChange(index, 'degree', value)}
                />
              </h4>
              <div className="text-gray-600">
                 <EditableField
                    fieldId={`edu-school-${index}`}
                    value={edu.school}
                    onChange={(value) => handleEducationChange(index, 'school', value)}
                  />
              </div>
              <div className="text-purple-600 text-sm">
                 <EditableField
                    fieldId={`edu-date-${index}`}
                    value={edu.graduationDate}
                    onChange={(value) => handleEducationChange(index, 'graduationDate', value)}
                  />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-semibold text-purple-600 border-b-2 border-purple-200 mb-3 pb-1">
            SKILLS
          </h3>
          <div className="flex flex-wrap gap-1">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="bg-purple-100 text-purple-700 rounded px-2 py-1">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
    }

    // Elegant Contrast Template
    if (template.id === 'elegant-contrast') {
      // PASTE THIS CODE FOR 'elegant-contrast'
return (
  <div className="bg-white shadow-lg max-w-[8.5in] mx-auto">
    <div className="p-8">
      {/* Header */}
      <div className="bg-gray-900 text-white p-6 mb-6 -mx-8 -mt-8">
        <h1 className="font-bold text-3xl mb-2">
          <EditableField
            fieldId="name"
            value={resumeData.personalInfo.name}
            onChange={(value) => handlePersonalInfoChange('name', value)}
            className="text-white"
          />
        </h1>
        <div className="text-gray-300">
          <EditableField
            fieldId="email"
            value={resumeData.personalInfo.email}
            onChange={(value) => handlePersonalInfoChange('email', value)}
            className="text-gray-300"
          />
          {' • '}
          <EditableField
            fieldId="phone"
            value={resumeData.personalInfo.phone}
            onChange={(value) => handlePersonalInfoChange('phone', value)}
            className="text-gray-300"
          />
          {' • '}
          <EditableField
            fieldId="location"
            value={resumeData.personalInfo.location}
            onChange={(value) => handlePersonalInfoChange('location', value)}
            className="text-gray-300"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">
          <span className="bg-gray-900 text-white px-2 py-1">SUMMARY</span>
        </h3>
        <EditableField
          fieldId="summary"
          value={resumeData.summary}
          onChange={handleSummaryChange}
          className="text-gray-700 leading-relaxed"
          multiline
        />
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">
          <span className="bg-gray-900 text-white px-2 py-1">EXPERIENCE</span>
        </h3>
        {resumeData.experience.map((exp, index) => (
          <div key={exp.id} className="mb-4">
            <div className="border-l-4 border-gray-900 pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    <EditableField
                      fieldId={`exp-title-${index}`}
                      value={exp.title}
                      onChange={(value) => handleExperienceChange(index, 'title', value)}
                    />
                  </h4>
                  <div className="text-gray-600 font-medium">
                    <EditableField
                      fieldId={`exp-company-${index}`}
                      value={exp.company}
                      onChange={(value) => handleExperienceChange(index, 'company', value)}
                    />
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  <EditableField
                    fieldId={`exp-dates-${index}`}
                    value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`}
                    onChange={(value) => {
                      const [start, end] = value.split(' - ');
                      handleExperienceChange(index, 'startDate', start);
                      if (end !== 'Present') {
                        handleExperienceChange(index, 'endDate', end);
                        handleExperienceChange(index, 'current', false);
                      } else {
                        handleExperienceChange(index, 'current', true);
                      }
                    }}
                  />
                </div>
              </div>
              <ul className="space-y-1">
                {exp.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">■</span>
                    <div className="flex-1 relative">
                       <EditableField
                          fieldId={`bullet-${index}-${bulletIndex}`}
                          value={bullet}
                          onChange={(value) => handleBulletChange(index, bulletIndex, value)}
                          className="text-gray-700"
                        />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            <span className="bg-gray-900 text-white px-2 py-1">EDUCATION</span>
          </h3>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border-l-4 border-gray-300 pl-4 mb-2">
              <h4 className="font-semibold text-gray-900">
                 <EditableField
                    fieldId={`edu-degree-${index}`}
                    value={edu.degree}
                    onChange={(value) => handleEducationChange(index, 'degree', value)}
                  />
              </h4>
              <div className="text-gray-600">
                <EditableField
                  fieldId={`edu-school-${index}`}
                  value={edu.school}
                  onChange={(value) => handleEducationChange(index, 'school', value)}
                />
              </div>
              <div className="text-gray-500 text-sm">
                <EditableField
                  fieldId={`edu-date-${index}`}
                  value={edu.graduationDate}
                  onChange={(value) => handleEducationChange(index, 'graduationDate', value)}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            <span className="bg-gray-900 text-white px-2 py-1">SKILLS</span>
          </h3>
          <div className="border-l-4 border-gray-300 pl-4 space-y-1">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="text-gray-700">• {skill}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
    }

    // For other templates, use the TemplatePreview with editMode=false
    return (
      <div className="bg-white max-w-[8.5in] mx-auto shadow-lg p-8">
        <TemplatePreview
          template={template}
          resumeData={resumeData}
          onUpdateResumeData={onUpdateResumeData}
          activeSection={activeSection}
          editMode={false}
        />
      </div>
    );
  };

  return (
    <div className="min-h-full">
      {editMode ? renderEditableTemplate() : (
        <TemplatePreview
          template={template}
          resumeData={resumeData}
          onUpdateResumeData={onUpdateResumeData}
          activeSection={activeSection}
          editMode={false}
        />
      )}
    </div>
  );
};

export default ResumePreview;