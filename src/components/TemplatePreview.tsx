import React from 'react';
import { Template } from '../App';
import { ResumeData } from './ResumeEditor';

interface TemplatePreviewProps {
  template: Template;
  resumeData: ResumeData;
  onUpdateResumeData: (data: ResumeData) => void;
  activeSection: string;
  editMode: boolean;
  isPreview?: boolean;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  resumeData,
  isPreview = false
}) => {
  const baseScale = isPreview ? 'text-[4px] leading-[5px]' : '';
  const headerScale = isPreview ? 'text-[6px] leading-[7px]' : '';
  const titleScale = isPreview ? 'text-[5px] leading-[6px]' : '';
  
  // Improved scaling for better preview fit
  const previewScale = isPreview ? 'text-[3px] leading-[4px]' : '';
  const previewHeaderScale = isPreview ? 'text-[4px] leading-[5px]' : '';
  const previewTitleScale = isPreview ? 'text-[3.5px] leading-[4.5px]' : '';

  const renderClassicChronoTemplate = () => (
    <div className={`bg-white shadow-lg ${isPreview ? 'w-full h-full' : 'max-w-[8.5in] mx-auto'} ${isPreview ? previewScale : baseScale}`}>
      <div className={`${isPreview ? 'p-1' : 'p-8'}`}>
        {/* Header */}
        <div className={`text-center border-b ${isPreview ? 'pb-0.5 mb-1' : 'pb-6 mb-8'}`}>
          <h1 className={`font-bold text-gray-900 ${isPreview ? previewHeaderScale : 'text-3xl'} ${isPreview ? 'mb-0.5' : 'mb-2'}`}>
            {resumeData.personalInfo.name}
          </h1>
          <div className={`text-gray-600 ${isPreview ? 'space-y-0' : 'space-y-1'}`}>
            <div>{resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</div>
            <div>{resumeData.personalInfo.location}</div>
          </div>
        </div>

        {/* Summary */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-gray-900 uppercase tracking-wide ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-gray-900 uppercase tracking-wide ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
            Experience
          </h3>
          {resumeData.experience.slice(0, isPreview ? 1 : resumeData.experience.length).map((exp, index) => (
            <div key={exp.id} className={isPreview ? 'mb-0.5' : 'mb-4'}>
              <div className={`flex justify-between items-start ${isPreview ? 'mb-0.5' : 'mb-2'}`}>
                <div>
                  <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{exp.title}</h4>
                  <div className="text-gray-600 font-medium">{exp.company}</div>
                </div>
                <div className="text-gray-500 text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              <ul className={`space-y-1 ${isPreview ? 'ml-1' : 'ml-4'}`}>
                {exp.bullets.slice(0, isPreview ? 1 : exp.bullets.length).map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-gray-900 uppercase tracking-wide ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
            Education
          </h3>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id}>
              <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{edu.degree}</h4>
              <div className="text-gray-600">{edu.school} • {edu.graduationDate}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h3 className={`font-semibold text-gray-900 uppercase tracking-wide ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
            Skills
          </h3>
          <div className={`flex flex-wrap ${isPreview ? 'gap-0.5' : 'gap-2'}`}>
            {resumeData.skills.slice(0, isPreview ? 3 : resumeData.skills.length).map((skill, index) => (
              <span key={index} className={`bg-gray-100 text-gray-700 rounded-full ${isPreview ? 'px-0.5 py-0.5' : 'px-3 py-1'}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderModernMinimalistTemplate = () => (
    <div className={`bg-white shadow-lg border-l-4 border-blue-500 ${isPreview ? 'w-full h-full' : 'max-w-[8.5in] mx-auto'} ${isPreview ? previewScale : baseScale}`}>
      <div className={`${isPreview ? 'p-1' : 'p-8'}`}>
        {/* Header */}
        <div className={isPreview ? 'mb-1' : 'mb-8'}>
          <h1 className={`font-bold text-gray-900 ${isPreview ? previewHeaderScale : 'text-3xl'} ${isPreview ? 'mb-0.5' : 'mb-2'}`}>
            {resumeData.personalInfo.name}
          </h1>
          <div className="text-blue-600 font-medium">{resumeData.personalInfo.email}</div>
          <div className="text-gray-600">{resumeData.personalInfo.phone} • {resumeData.personalInfo.location}</div>
        </div>

        {/* Summary */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-blue-600 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>SUMMARY</h3>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-blue-600 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>EXPERIENCE</h3>
          {resumeData.experience.slice(0, isPreview ? 1 : resumeData.experience.length).map((exp, index) => (
            <div key={exp.id} className={isPreview ? 'mb-0.5' : 'mb-4'}>
              <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{exp.title}</h4>
              <div className="text-gray-600 font-medium">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
              <ul className={`space-y-1 ${isPreview ? 'mt-0.5' : 'mt-2'}`}>
                {exp.bullets.slice(0, isPreview ? 1 : exp.bullets.length).map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="text-gray-700">• {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education & Skills */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className={`font-semibold text-blue-600 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>EDUCATION</h3>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id}>
                <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{edu.degree}</h4>
                <div className="text-gray-600">{edu.school}</div>
              </div>
            ))}
          </div>
          <div>
            <h3 className={`font-semibold text-blue-600 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>SKILLS</h3>
            <div className="space-y-1">
              {resumeData.skills.slice(0, isPreview ? 3 : resumeData.skills.length).map((skill, index) => (
                <div key={index} className="text-gray-700">• {skill}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlainProTemplate = () => (
    <div className={`bg-white shadow-sm border ${isPreview ? 'w-full h-full' : 'max-w-[8.5in] mx-auto'} ${isPreview ? previewScale : baseScale}`}>
      <div className={`${isPreview ? 'p-1' : 'p-8'}`}>
        {/* Header */}
        <div className={`text-center ${isPreview ? 'mb-1' : 'mb-6'}`}>
          <h1 className={`font-bold text-gray-900 ${isPreview ? previewHeaderScale : 'text-2xl'} ${isPreview ? 'mb-0.5' : 'mb-1'}`}>
            {resumeData.personalInfo.name}
          </h1>
          <div className="text-gray-600">
            {resumeData.personalInfo.email} | {resumeData.personalInfo.phone} | {resumeData.personalInfo.location}
          </div>
        </div>

        {/* Summary */}
        <div className={isPreview ? 'mb-0.5' : 'mb-4'}>
          <h3 className={`font-bold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-2'}`}>PROFESSIONAL SUMMARY</h3>
          <hr className={isPreview ? 'mb-0.5' : 'mb-2'} />
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className={isPreview ? 'mb-0.5' : 'mb-4'}>
          <h3 className={`font-bold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-2'}`}>PROFESSIONAL EXPERIENCE</h3>
          <hr className={isPreview ? 'mb-0.5' : 'mb-2'} />
          {resumeData.experience.slice(0, isPreview ? 1 : resumeData.experience.length).map((exp, index) => (
            <div key={exp.id} className={isPreview ? 'mb-0.5' : 'mb-3'}>
              <div className="flex justify-between">
                <h4 className={`font-bold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{exp.title}</h4>
                <span className="text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="font-semibold text-gray-700">{exp.company}, {exp.location}</div>
              <ul className={isPreview ? 'mt-0.5' : 'mt-1'}>
                {exp.bullets.slice(0, isPreview ? 1 : exp.bullets.length).map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="text-gray-700">• {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className={isPreview ? 'mb-0.5' : 'mb-4'}>
          <h3 className={`font-bold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-2'}`}>EDUCATION</h3>
          <hr className={isPreview ? 'mb-0.5' : 'mb-2'} />
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="flex justify-between">
              <div>
                <h4 className={`font-bold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{edu.degree}</h4>
                <div className="text-gray-700">{edu.school}, {edu.location}</div>
              </div>
              <span className="text-gray-600">{edu.graduationDate}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h3 className={`font-bold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-2'}`}>TECHNICAL SKILLS</h3>
          <hr className={isPreview ? 'mb-0.5' : 'mb-2'} />
          <p className="text-gray-700">{resumeData.skills.slice(0, isPreview ? 3 : resumeData.skills.length).join(', ')}</p>
        </div>
      </div>
    </div>
  );

  const renderSmartAccentTemplate = () => (
    <div className={`bg-white shadow-lg ${isPreview ? 'w-full h-full' : 'max-w-[8.5in] mx-auto'} ${isPreview ? previewScale : baseScale}`}>
      <div className={`${isPreview ? 'p-1' : 'p-8'}`}>
        {/* Header with accent */}
        <div className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white ${isPreview ? 'p-0.5 mb-1' : 'p-6 mb-6'} ${isPreview ? '-mx-1 -mt-1' : '-mx-8 -mt-8'}`}>
          <h1 className={`font-bold ${isPreview ? previewHeaderScale : 'text-3xl'} ${isPreview ? 'mb-0.5' : 'mb-2'}`}>
            {resumeData.personalInfo.name}
          </h1>
          <div className={isPreview ? 'space-y-0' : 'space-y-1'}>
            <div>{resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</div>
            <div>{resumeData.personalInfo.location}</div>
          </div>
        </div>

        {/* Summary */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-purple-600 border-b-2 border-purple-200 ${isPreview ? 'mb-0.5 pb-0' : 'mb-3 pb-1'}`}>
            PROFESSIONAL SUMMARY
          </h3>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-purple-600 border-b-2 border-purple-200 ${isPreview ? 'mb-0.5 pb-0' : 'mb-3 pb-1'}`}>
            EXPERIENCE
          </h3>
          {resumeData.experience.slice(0, isPreview ? 1 : resumeData.experience.length).map((exp, index) => (
            <div key={exp.id} className={isPreview ? 'mb-0.5' : 'mb-4'}>
              <div className={`flex justify-between items-start ${isPreview ? 'mb-0.5' : 'mb-2'}`}>
                <div>
                  <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{exp.title}</h4>
                  <div className="text-purple-600 font-medium">{exp.company}</div>
                </div>
                <div className={`text-gray-500 text-sm bg-gray-100 rounded ${isPreview ? 'px-0.5 py-0.5' : 'px-2 py-1'}`}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              <ul className={`space-y-1 ${isPreview ? 'ml-1' : 'ml-4'}`}>
                {exp.bullets.slice(0, isPreview ? 1 : exp.bullets.length).map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-1">▸</span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education & Skills */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className={`font-semibold text-purple-600 border-b-2 border-purple-200 ${isPreview ? 'mb-0.5 pb-0' : 'mb-3 pb-1'}`}>
              EDUCATION
            </h3>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id}>
                <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{edu.degree}</h4>
                <div className="text-gray-600">{edu.school}</div>
                <div className="text-purple-600 text-sm">{edu.graduationDate}</div>
              </div>
            ))}
          </div>
          <div>
            <h3 className={`font-semibold text-purple-600 border-b-2 border-purple-200 ${isPreview ? 'mb-0.5 pb-0' : 'mb-3 pb-1'}`}>
              SKILLS
            </h3>
            <div className={`flex flex-wrap ${isPreview ? 'gap-0.5' : 'gap-1'}`}>
              {resumeData.skills.slice(0, isPreview ? 3 : resumeData.skills.length).map((skill, index) => (
                <span key={index} className={`bg-purple-100 text-purple-700 rounded ${isPreview ? 'px-0.5 py-0.5' : 'px-2 py-1'}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSideStripeTemplate = () => (
    <div className={`bg-white shadow-lg grid grid-cols-3 gap-0 ${isPreview ? 'w-full h-full' : 'max-w-[8.5in] mx-auto'} ${isPreview ? previewScale : baseScale}`}>
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white col-span-1 ${isPreview ? 'p-0.5' : 'p-6'}`}>
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h1 className={`font-bold ${isPreview ? previewHeaderScale : 'text-2xl'} ${isPreview ? 'mb-0.5' : 'mb-1'}`}>
            {resumeData.personalInfo.name}
          </h1>
          <div className={`space-y-1 ${isPreview ? 'text-[2px]' : 'text-sm'}`}>
            <div className="text-gray-300">{resumeData.personalInfo.email}</div>
            <div className="text-gray-300">{resumeData.personalInfo.phone}</div>
            <div className="text-gray-300">{resumeData.personalInfo.location}</div>
          </div>
        </div>

        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-white ${isPreview ? 'mb-0.5' : 'mb-3'}`}>SKILLS</h3>
          <div className={`space-y-1 ${isPreview ? 'text-[2px]' : 'text-sm'}`}>
            {resumeData.skills.slice(0, isPreview ? 3 : resumeData.skills.length).map((skill, index) => (
              <div key={index} className="text-gray-300">• {skill}</div>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`font-semibold text-white ${isPreview ? 'mb-0.5' : 'mb-3'}`}>EDUCATION</h3>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className={`${isPreview ? 'text-[2px]' : 'text-sm'}`}>
              <h4 className="font-semibold text-white">{edu.degree}</h4>
              <div className="text-gray-300">{edu.school}</div>
              <div className="text-gray-400">{edu.graduationDate}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`col-span-2 ${isPreview ? 'p-0.5' : 'p-6'}`}>
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>SUMMARY</h3>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>

        <div>
          <h3 className={`font-semibold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>EXPERIENCE</h3>
          {resumeData.experience.slice(0, isPreview ? 1 : resumeData.experience.length).map((exp, index) => (
            <div key={exp.id} className={isPreview ? 'mb-0.5' : 'mb-4'}>
              <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{exp.title}</h4>
              <div className="text-gray-600 font-medium">{exp.company}</div>
              <div className="text-gray-500 text-sm">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
              <ul className={`space-y-1 ${isPreview ? 'mt-0.5' : 'mt-2'}`}>
                {exp.bullets.slice(0, isPreview ? 1 : exp.bullets.length).map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start">
                    <span className="text-gray-400 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderElegantContrastTemplate = () => (
    <div className={`bg-white shadow-lg ${isPreview ? 'w-full h-full' : 'max-w-[8.5in] mx-auto'} ${isPreview ? previewScale : baseScale}`}>
      <div className={`${isPreview ? 'p-1' : 'p-8'}`}>
        {/* Header */}
        <div className={`bg-gray-900 text-white ${isPreview ? 'p-0.5 mb-1' : 'p-6 mb-6'} ${isPreview ? '-mx-1 -mt-1' : '-mx-8 -mt-8'}`}>
          <h1 className={`font-bold ${isPreview ? previewHeaderScale : 'text-3xl'} ${isPreview ? 'mb-0.5' : 'mb-2'}`}>
            {resumeData.personalInfo.name}
          </h1>
          <div className="text-gray-300">
            {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}
          </div>
        </div>

        {/* Summary */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
            <span className="bg-gray-900 text-white px-2 py-1">SUMMARY</span>
          </h3>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>

        {/* Experience */}
        <div className={isPreview ? 'mb-0.5' : 'mb-6'}>
          <h3 className={`font-semibold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
            <span className="bg-gray-900 text-white px-2 py-1">EXPERIENCE</span>
          </h3>
          {resumeData.experience.slice(0, isPreview ? 1 : resumeData.experience.length).map((exp, index) => (
            <div key={exp.id} className={isPreview ? 'mb-0.5' : 'mb-4'}>
              <div className={`border-l-4 border-gray-900 ${isPreview ? 'pl-0.5' : 'pl-4'}`}>
                <div className={`flex justify-between items-start ${isPreview ? 'mb-0.5' : 'mb-2'}`}>
                  <div>
                    <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{exp.title}</h4>
                    <div className="text-gray-600 font-medium">{exp.company}</div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                <ul className="space-y-1">
                  {exp.bullets.slice(0, isPreview ? 1 : exp.bullets.length).map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">■</span>
                      <span className="text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Education & Skills */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className={`font-semibold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
              <span className="bg-gray-900 text-white px-2 py-1">EDUCATION</span>
            </h3>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className={`border-l-4 border-gray-300 ${isPreview ? 'pl-0.5' : 'pl-4'}`}>
                <h4 className={`font-semibold text-gray-900 ${isPreview ? previewTitleScale : titleScale}`}>{edu.degree}</h4>
                <div className="text-gray-600">{edu.school}</div>
                <div className="text-gray-500 text-sm">{edu.graduationDate}</div>
              </div>
            ))}
          </div>
          <div>
            <h3 className={`font-semibold text-gray-900 ${isPreview ? 'mb-0.5' : 'mb-3'}`}>
              <span className="bg-gray-900 text-white px-2 py-1">SKILLS</span>
            </h3>
            <div className={`border-l-4 border-gray-300 ${isPreview ? 'pl-0.5' : 'pl-4'} space-y-1`}>
              {resumeData.skills.slice(0, isPreview ? 3 : resumeData.skills.length).map((skill, index) => (
                <div key={index} className="text-gray-700">• {skill}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Template renderer
  const renderTemplate = () => {
    switch (template.id) {
      case 'classic-chrono':
        return renderClassicChronoTemplate();
      case 'modern-minimalist':
        return renderModernMinimalistTemplate();
      case 'plain-pro':
        return renderPlainProTemplate();
      case 'smart-accent':
        return renderSmartAccentTemplate();
      case 'side-stripe':
        return renderSideStripeTemplate();
      case 'elegant-contrast':
        return renderElegantContrastTemplate();
      default:
        return renderClassicChronoTemplate();
    }
  };

  return renderTemplate();
};

export default TemplatePreview;