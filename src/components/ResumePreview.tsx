import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Template } from '../App';
import { ResumeData } from './ResumeEditor';
import TemplatePreview from './TemplatePreview';

interface ResumePreviewProps {
  template: Template;
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
  activeSection: string;
  editMode: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ template, resumeData, onUpdateResumeData, activeSection, editMode }) => {
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

  const EditableField: React.FC<{
    fieldId: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
  }> = React.memo(({ fieldId, value, onChange, className = '', multiline = false, placeholder }) => {
    const [localValue, setLocalValue] = useState(value);
    const isEditing = editingField === fieldId;
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const displayRef = useRef<HTMLDivElement | HTMLSpanElement>(null);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        // Don't auto-select, let user place cursor where they want
      }
    }, [isEditing]);

    const handleDisplayClick = (e: React.MouseEvent) => {
      if (!editMode) return;
      
      setEditingField(fieldId);
      setLocalValue(value);
      
      // Focus the input after a small delay to ensure it's rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          
          // For single-line inputs, try to position cursor based on click
          if (!multiline && inputRef.current instanceof HTMLInputElement) {
            const rect = inputRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            
            // Get the computed style to calculate character width more accurately
            const computedStyle = window.getComputedStyle(inputRef.current);
            const fontSize = parseFloat(computedStyle.fontSize);
            const fontFamily = computedStyle.fontFamily;
            
            // Create a temporary span to measure character width
            const tempSpan = document.createElement('span');
            tempSpan.style.fontSize = fontSize + 'px';
            tempSpan.style.fontFamily = fontFamily;
            tempSpan.style.position = 'absolute';
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.whiteSpace = 'pre';
            document.body.appendChild(tempSpan);
            
            // Calculate average character width
            tempSpan.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const avgCharWidth = tempSpan.offsetWidth / tempSpan.textContent.length;
            document.body.removeChild(tempSpan);
            
            // Calculate cursor position
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
            const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
            const offsetX = clickX - paddingLeft - borderLeft;
            const estimatedPosition = Math.round(offsetX / avgCharWidth);
            const cursorPosition = Math.max(0, Math.min(estimatedPosition, value.length));
            
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
          
          // For textarea, try to position cursor based on click coordinates
          if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
            const rect = inputRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Get the computed style
            const computedStyle = window.getComputedStyle(inputRef.current);
            const fontSize = parseFloat(computedStyle.fontSize);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
            
            // Calculate line number
            const lineNumber = Math.floor((clickY - paddingTop) / lineHeight);
            const lines = value.split('\n');
            const targetLine = Math.max(0, Math.min(lineNumber, lines.length - 1));
            
            // Calculate character position within the line
            const tempSpan = document.createElement('span');
            tempSpan.style.fontSize = fontSize + 'px';
            tempSpan.style.fontFamily = computedStyle.fontFamily;
            tempSpan.style.position = 'absolute';
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.whiteSpace = 'pre';
            document.body.appendChild(tempSpan);
            
            tempSpan.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const avgCharWidth = tempSpan.offsetWidth / tempSpan.textContent.length;
            document.body.removeChild(tempSpan);
            
            const offsetX = clickX - paddingLeft;
            const charPos = Math.round(offsetX / avgCharWidth);
            const lineContent = lines[targetLine] || '';
            const charPosition = Math.max(0, Math.min(charPos, lineContent.length));
            
            // Calculate absolute position
            let absolutePosition = 0;
            for (let i = 0; i < targetLine; i++) {
              absolutePosition += lines[i].length + 1; // +1 for newline
            }
            absolutePosition += charPosition;
            
            inputRef.current.setSelectionRange(absolutePosition, absolutePosition);
          }
        }
      }, 10);
    };

    const handleDisplayMouseDown = (e: React.MouseEvent) => {
      // Allow text selection by dragging
      if (editMode && !isEditing) {
        e.preventDefault();
        handleDisplayClick(e);
      }
    };

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
      } else if (e.key === 'Tab') {
        // Allow Tab navigation to work naturally
        // The browser will handle focus movement
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      // Prevent blur when clicking on the same field
      if (isEditing) {
        e.preventDefault();
      }
    };

    if (!editMode) {
      return multiline ? (
        <div className={`whitespace-pre-wrap ${className}`}>{value}</div>
      ) : (
        <span className={className}>{value}</span>
      );
    }

    // Show editable display when not editing
    if (!isEditing) {
      return multiline ? (
        <div 
          ref={displayRef as React.RefObject<HTMLDivElement>}
          onClick={handleDisplayClick}
          className={`whitespace-pre-wrap cursor-text hover:bg-gray-50 hover:border hover:border-gray-200 rounded p-2 transition-all duration-200 ${className} ${!value ? 'text-gray-400 italic' : ''}`}
        >
          {value || placeholder}
        </div>
      ) : (
        <span 
          ref={displayRef as React.RefObject<HTMLSpanElement>}
          onClick={handleDisplayClick}
          className={`cursor-text hover:bg-gray-50 hover:border hover:border-gray-200 rounded px-2 py-1 transition-all duration-200 ${className} ${!value ? 'text-gray-400 italic' : ''}`}
        >
          {value || placeholder}
        </span>
      );
    }

    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent border border-transparent outline-none resize-none hover:bg-gray-50 focus:bg-blue-50 focus:border-blue-200 focus:rounded p-2 transition-all duration-200 ${className}`}
        placeholder={placeholder}
        rows={3}
        style={{
          color: 'inherit',
          backgroundColor: 'transparent',
          ...(className.includes('text-white') && { color: 'white' }),
          ...(className.includes('text-gray-300') && { color: '#d1d5db' })
        }}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        className={`w-full bg-transparent border border-transparent outline-none hover:bg-gray-50 focus:bg-blue-50 focus:border-blue-200 focus:rounded px-2 py-1 transition-all duration-200 ${className}`}
        placeholder={placeholder}
        style={{
          color: 'inherit',
          backgroundColor: 'transparent',
          ...(className.includes('text-white') && { color: 'white' }),
          ...(className.includes('text-gray-300') && { color: '#d1d5db' })
        }}
      />
    );
  });

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
        <div className="bg-white shadow-lg max-w-[8.5in] mx-auto p-8">
          {/* Header */}
          <div className="text-center border-b pb-6 mb-8">
            <h1 className="font-bold text-gray-900 text-3xl mb-2">
              <EditableField
                fieldId="name"
                value={resumeData.personalInfo.name}
                onChange={(value) => handlePersonalInfoChange('name', value)}
              />
            </h1>
            <div className="text-gray-600 space-y-1">
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

          {/* Summary */}
          <div className="mb-6">
            <SectionHeader title="Professional Summary" sectionId="summary" />
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
            <SectionHeader title="Experience" sectionId="experience" />
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

          {/* Education */}
          <div className="mb-6">
            <SectionHeader title="Education" sectionId="education" />
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
                  {' • '}
                  <EditableField
                    fieldId={`edu-date-${index}`}
                    value={edu.graduationDate}
                    onChange={(value) => handleEducationChange(index, 'graduationDate', value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <SectionHeader title="Skills" sectionId="skills" />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
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
        <div className="bg-white shadow-lg max-w-[8.5in] mx-auto p-8">
          {/* Header */}
          <div className="text-center border-b pb-6 mb-8">
            <h1 className="font-bold text-gray-900 text-3xl mb-2">
              <EditableField
                fieldId="name"
                value={resumeData.personalInfo.name}
                onChange={(value) => handlePersonalInfoChange('name', value)}
              />
            </h1>
            <div className="text-gray-600 space-y-1">
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

          {/* Summary */}
          <div className="mb-6">
            <SectionHeader title="Professional Summary" sectionId="summary" />
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
            <SectionHeader title="Experience" sectionId="experience" />
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

          {/* Education */}
          <div className="mb-6">
            <SectionHeader title="Education" sectionId="education" />
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

          {/* Skills */}
          <div>
            <SectionHeader title="Skills" sectionId="skills" />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Smart Accent Template
    if (template.id === 'smart-accent') {
      return (
        <div className="bg-white shadow-lg max-w-[8.5in] mx-auto p-8">
          {/* Header */}
          <div className="text-center border-b pb-6 mb-8">
            <h1 className="font-bold text-gray-900 text-3xl mb-2">
              <EditableField
                fieldId="name"
                value={resumeData.personalInfo.name}
                onChange={(value) => handlePersonalInfoChange('name', value)}
              />
            </h1>
            <div className="text-gray-600 space-y-1">
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

          {/* Summary */}
          <div className="mb-6">
            <SectionHeader title="Professional Summary" sectionId="summary" />
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
            <SectionHeader title="Experience" sectionId="experience" />
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

          {/* Education */}
          <div className="mb-6">
            <SectionHeader title="Education" sectionId="education" />
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

          {/* Skills */}
          <div>
            <SectionHeader title="Skills" sectionId="skills" />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Elegant Contrast Template
    if (template.id === 'elegant-contrast') {
      return (
        <div className="bg-white shadow-lg max-w-[8.5in] mx-auto p-8">
          {/* Header */}
          <div className="text-center border-b pb-6 mb-8">
            <h1 className="font-bold text-gray-900 text-3xl mb-2">
              <EditableField
                fieldId="name"
                value={resumeData.personalInfo.name}
                onChange={(value) => handlePersonalInfoChange('name', value)}
              />
            </h1>
            <div className="text-gray-600 space-y-1">
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

          {/* Summary */}
          <div className="mb-6">
            <SectionHeader title="Professional Summary" sectionId="summary" />
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
            <SectionHeader title="Experience" sectionId="experience" />
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

          {/* Education */}
          <div className="mb-6">
            <SectionHeader title="Education" sectionId="education" />
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

          {/* Skills */}
          <div>
            <SectionHeader title="Skills" sectionId="skills" />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                  {skill}
                </span>
              ))}
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
      
      {editMode && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-sm">
          <h4 className="font-semibold text-gray-900 mb-2">Editing Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click any text to edit inline</li>
            <li>• Press Enter to save (single line)</li>
            <li>• Press Escape to cancel</li>
            <li>• Click + buttons to add new items</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;