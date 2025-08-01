import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Template } from '../App';
import TemplatePreview from './TemplatePreview';

interface TemplateSelectionProps {
  onSelectTemplate: (template: Template) => void;
  onBack: () => void;
}

const templates: Template[] = [
  {
    id: 'classic-chrono',
    name: 'Classic Chrono',
    description: 'Traditional chronological layout perfect for experienced professionals',
    category: 'minimal',
    preview: 'A clean, timeline-based design focusing on work experience progression'
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean and contemporary design with plenty of white space',
    category: 'minimal',
    preview: 'Sleek design with subtle typography and organized sections'
  },
  {
    id: 'plain-pro',
    name: 'Plain Pro',
    description: 'No-frills professional template that works everywhere',
    category: 'minimal',
    preview: 'Simple, straightforward layout optimized for ATS systems'
  },
  {
    id: 'smart-accent',
    name: 'Smart Accent',
    description: 'Professional template with strategic color highlights',
    category: 'colorful',
    preview: 'Balanced design with accent colors to highlight key information'
  },
  {
    id: 'side-stripe',
    name: 'Side Stripe',
    description: 'Modern layout with sidebar for skills and contact info',
    category: 'colorful',
    preview: 'Two-column design with colorful sidebar and main content area'
  },
  {
    id: 'elegant-contrast',
    name: 'Elegant Contrast',
    description: 'Sophisticated design with elegant color combinations',
    category: 'colorful',
    preview: 'Premium look with strategic use of colors and typography'
  }
];

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onSelectTemplate, onBack }) => {
  const minimalTemplates = templates.filter(t => t.category === 'minimal');
  const colorfulTemplates = templates.filter(t => t.category === 'colorful');

  const TemplateCard: React.FC<{ template: Template }> = ({ template }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer"
         onClick={() => onSelectTemplate(template)}>
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden border-b">
        <div className="absolute inset-2 transform scale-75 origin-top-left">
          <TemplatePreview 
            template={template}
            resumeData={{
              personalInfo: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '(555) 123-4567',
                location: 'San Francisco, CA',
                linkedin: 'linkedin.com/in/johndoe',
                website: 'johndoe.com'
              },
              summary: 'Experienced software engineer with 5+ years developing scalable web applications and leading cross-functional teams.',
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
            }}
            onUpdateResumeData={() => {}}
            activeSection=""
            editMode={false}
            isPreview={true}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent group-hover:from-blue-500/10 transition-all duration-200"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectTemplate(template);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Start Editing</span>
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

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Template</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Now that we know your target role, select from our collection of ATS-friendly resume templates. 
            Each template is designed to help you stand out while ensuring compatibility with applicant tracking systems.
          </p>
        </div>

        {/* Minimal Templates */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
            Minimal Templates
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {minimalTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>

        {/* Colorful Templates */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            Colorful Templates
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {colorfulTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;