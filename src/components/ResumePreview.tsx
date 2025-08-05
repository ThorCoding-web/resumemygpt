import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Template } from '../App';
import { ResumeData } from './ResumeEditor';
import TemplatePreview from './TemplatePreview';
import DraggableContainer from './DraggableContainer';
import DraggableSection from './DraggableSection';

interface ResumePreviewProps {
  template: Template;
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
  activeSection: string;
  editMode: boolean;
  sectionOrder: string[];
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  template,
  resumeData,
  onUpdateResumeData,
  activeSection,
  editMode,
  sectionOrder
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);

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

  const handleSectionReorder = useCallback((newOrder: string[]) => {
    // This would be handled by the parent component
    console.log('Section reorder:', newOrder);
  }, []);

  const EditableField: React.FC<{
    fieldId: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
  }> = ({ fieldId, value, onChange, className = '', multiline = false, placeholder }) => {
    const [localValue, setLocalValue] = useState(value);
    const isEditing = editingField === fieldId;

    const handleFocus = () => {
      setEditingField(fieldId);
      setLocalValue(value);
    };

    const handleBlur = () => {
      setEditingField(null);
      onChange(localValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        handleBlur();
      } else if (e.key === 'Escape') {
        setLocalValue(value);
        setEditingField(null);
      }
    };

    if (!editMode) {
      return multiline ? (
        <div className={`whitespace-pre-wrap ${className}`}>{value}</div>
      ) : (
        <span className={className}>{value}</span>
      );
    }

    return multiline ? (
      <textarea
        value={isEditing ? localValue : value}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent border border-transparent outline-none resize-none hover:bg-gray-50 focus:bg-blue-50 focus:border-blue-200 focus:rounded p-2 transition-all ${className}`}
        placeholder={placeholder}
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={isEditing ? localValue : value}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent border border-transparent outline-none hover:bg-gray-50 focus:bg-blue-50 focus:border-blue-200 focus:rounded px-2 py-1 transition-all ${className}`}
        placeholder={placeholder}
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

  // Render sections in the specified order
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        return (
          <div className="group">
            <h1 className="text-2xl font-bold mb-1">
              <EditableField
                fieldId="name"
                value={resumeData.personalInfo.name}
                onChange={(value) => handlePersonalInfoChange('name', value)}
                className="text-inherit"
              />
            </h1>
            <div className="space-y-1 text-sm">
              <EditableField
                fieldId="email"
                value={resumeData.personalInfo.email}
                onChange={(value) => handlePersonalInfoChange('email', value)}
                className="text-inherit"
              />
              <EditableField
                fieldId="phone"
                value={resumeData.personalInfo.phone}
                onChange={(value) => handlePersonalInfoChange('phone', value)}
                className="text-inherit"
              />
              <EditableField
                fieldId="location"
                value={resumeData.personalInfo.location}
                onChange={(value) => handlePersonalInfoChange('location', value)}
                className="text-inherit"
              />
            </div>
          </div>
        );

      case 'summary':
        return (
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
        );

      case 'experience':
        return (
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
        );

      case 'education':
        return (
          <div className="group mb-8">
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
                <div className="text-sm text-gray-500">
                  <EditableField
                    fieldId={`edu-date-${index}`}
                    value={edu.graduationDate}
                    onChange={(value) => handleEducationChange(index, 'graduationDate', value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="group mb-8">
            <SectionHeader title="Skills" sectionId="skills" />
            <div className="space-y-1 text-sm">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="text-gray-700">{skill}</div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!resumeData.projects || resumeData.projects.length === 0) return null;
        return (
          <div className="group mb-8">
            <SectionHeader title="Projects" sectionId="projects" />
            {resumeData.projects.map((project, index) => (
              <div key={project.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {project.name} {project.tag && <span className="text-blue-600">({project.tag})</span>}
                    </h4>
                    <div className="text-gray-600 text-sm">{project.techStack}</div>
                  </div>
                  <div className="text-gray-500 text-sm">{project.date}</div>
                </div>
                <ul className="space-y-1 ml-4">
                  {project.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'certifications':
        if (!resumeData.certifications || resumeData.certifications.length === 0) return null;
        return (
          <div className="group mb-8">
            <SectionHeader title="Certifications" sectionId="certifications" />
            {resumeData.certifications.map((cert, index) => (
              <div key={cert.id} className="mb-2 last:mb-0">
                <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                <div className="text-gray-600">{cert.issuer} {cert.year && `• ${cert.year}`}</div>
              </div>
            ))}
          </div>
        );

      case 'languages':
        if (!resumeData.languages || resumeData.languages.length === 0) return null;
        return (
          <div className="group mb-8">
            <SectionHeader title="Languages" sectionId="languages" />
            <div className="flex flex-wrap gap-2">
              {resumeData.languages.map((lang, index) => (
                <span key={lang.id} className="text-gray-700">
                  {lang.name} ({lang.fluency}){index < resumeData.languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        );

      case 'custom':
        if (!resumeData.customSections || resumeData.customSections.length === 0) return null;
        return (
          <>
            {resumeData.customSections.map((section, sectionIndex) => (
              <div key={section.id} className="group mb-8">
                <SectionHeader title={section.title} sectionId={`custom-${section.id}`} />
                <ul className="space-y-1 ml-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={item.id} className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  // Use DraggableContainer for section reordering
  if (editMode) {
    return (
      <div className="bg-white max-w-[8.5in] mx-auto shadow-lg p-8">
        <DraggableContainer
          items={sectionOrder}
          onReorder={handleSectionReorder}
          className="space-y-6"
        >
          {sectionOrder.map((sectionId) => (
            <DraggableSection key={sectionId} id={sectionId}>
              {renderSectionContent(sectionId)}
            </DraggableSection>
          ))}
        </DraggableContainer>
      </div>
    );
  }

  // For non-edit mode, use the TemplatePreview component
  return (
    <TemplatePreview
      template={template}
      resumeData={resumeData}
      onUpdateResumeData={onUpdateResumeData}
      activeSection={activeSection}
      editMode={false}
    />
  );
};

export default ResumePreview;