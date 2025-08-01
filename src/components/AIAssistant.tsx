import React, { useState } from 'react';
import { X, Send, Sparkles, User, Bot, CheckCircle, Copy } from 'lucide-react';
import { ResumeData } from './ResumeEditor';
import { JobDetails } from '../App';

interface AIAssistantProps {
  activeSection: string;
  resumeData: ResumeData;
  jobDetails: JobDetails;
  onClose: () => void;
  onApplySuggestion: (section: string, content: any) => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestion?: any;
  applied?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  activeSection,
  resumeData,
  jobDetails,
  onClose,
  onApplySuggestion
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hi! I'm your AI resume assistant. I can help you improve your ${activeSection} section for the ${jobDetails.title} position. What would you like to work on?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sectionTips = {
    summary: [
      'Keep it 2-3 sentences and focus on your top achievements',
      'Include keywords from the job description',
      'Quantify your impact with specific numbers or percentages'
    ],
    experience: [
      'Start each bullet with a strong action verb',
      'Include quantifiable results (increased sales by 25%)',
      'Focus on achievements, not just responsibilities'
    ],
    education: [
      'Include relevant coursework if you\'re a recent graduate',
      'Add GPA if it\'s 3.5 or higher',
      'Mention relevant academic projects or honors'
    ],
    skills: [
      'Organize skills by category (Technical, Soft Skills, etc.)',
      'Only include skills you can confidently demonstrate',
      'Match skills mentioned in the job description'
    ],
    projects: [
      'Include 2-3 most relevant projects',
      'Explain the problem you solved and the impact',
      'List technologies or tools used'
    ],
    certifications: [
      'Include expiration dates for time-sensitive certifications',
      'Prioritize industry-relevant certifications',
      'Add certification numbers if applicable'
    ]
  };

  const generateAISuggestion = (userMessage: string) => {
    // Mock AI responses based on the active section and user input
    const suggestions = {
      summary: {
        content: `Based on your ${jobDetails.title} target role, here's an improved summary:

"Results-driven professional with 5+ years of experience in ${jobDetails.industry.toLowerCase()}, specializing in ${jobDetails.title.toLowerCase()} responsibilities. Proven track record of delivering high-impact projects that increased efficiency by 30% and reduced costs by $50K annually. Seeking to leverage expertise in strategic planning and team leadership to drive growth at a forward-thinking organization."

Key improvements:
• Added specific years of experience
• Included quantifiable achievements
• Mentioned relevant industry keywords
• Tailored to your target role`,
        suggestion: `Results-driven professional with 5+ years of experience in ${jobDetails.industry.toLowerCase()}, specializing in ${jobDetails.title.toLowerCase()} responsibilities. Proven track record of delivering high-impact projects that increased efficiency by 30% and reduced costs by $50K annually. Seeking to leverage expertise in strategic planning and team leadership to drive growth at a forward-thinking organization.`
      },
      experience: {
        content: `Here are improved bullet points for your current experience:

• Led cross-functional team of 8 developers to deliver 3 major product releases, resulting in 40% increase in user engagement
• Implemented automated testing protocols that reduced bug reports by 60% and improved deployment speed by 2x
• Collaborated with stakeholders to define product requirements, leading to successful launch of 2 new features used by 10K+ users

Key improvements:
• Started with strong action verbs (Led, Implemented, Collaborated)
• Added specific numbers and quantifiable results
• Focused on achievements rather than day-to-day tasks`,
        suggestion: [
          "Led cross-functional team of 8 developers to deliver 3 major product releases, resulting in 40% increase in user engagement",
          "Implemented automated testing protocols that reduced bug reports by 60% and improved deployment speed by 2x",
          "Collaborated with stakeholders to define product requirements, leading to successful launch of 2 new features used by 10K+ users"
        ]
      },
      skills: {
        content: `Here's an optimized skills section tailored for ${jobDetails.title}:

**Technical Skills**
• Programming: JavaScript, Python, React, Node.js
• Tools: Git, Docker, AWS, Jira, Figma
• Databases: PostgreSQL, MongoDB, Redis

**Soft Skills**
• Leadership & Team Management
• Strategic Planning & Problem Solving
• Cross-functional Collaboration

Key improvements:
• Organized by categories for better readability
• Prioritized skills mentioned in job descriptions
• Balanced technical and soft skills`,
        suggestion: ["JavaScript", "Python", "React", "Node.js", "Git", "Docker", "AWS", "Leadership", "Strategic Planning", "Problem Solving"]
      }
    };

    return suggestions[activeSection as keyof typeof suggestions] || {
      content: `I can help you improve your ${activeSection} section. What specific aspect would you like to focus on?`,
      suggestion: null
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAISuggestion(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        suggestion: aiResponse.suggestion
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleApplySuggestion = (messageId: string, suggestion: any) => {
    onApplySuggestion(activeSection, suggestion);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, applied: true } : msg
    ));
  };

  const handleCopySuggestion = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const quickPrompts = [
    'Improve this section',
    'Make it more quantifiable',
    'Add relevant keywords',
    'Make it more concise'
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-500">Improving: {activeSection}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tips Section */}
      <div className="p-4 bg-purple-50 border-b">
        <h4 className="text-sm font-medium text-purple-900 mb-2">💡 Tips for {activeSection}</h4>
        <ul className="space-y-1">
          {sectionTips[activeSection as keyof typeof sectionTips]?.map((tip, index) => (
            <li key={index} className="text-xs text-purple-700 flex items-start">
              <span className="mr-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.suggestion && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Suggested Content:</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleCopySuggestion(
                              typeof message.suggestion === 'string' 
                                ? message.suggestion 
                                : message.suggestion.join('\n')
                            )}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded text-left">
                        {typeof message.suggestion === 'string' ? (
                          <p className="whitespace-pre-wrap">{message.suggestion}</p>
                        ) : (
                          <ul className="space-y-1">
                            {message.suggestion.map((item: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button
                        onClick={() => handleApplySuggestion(message.id, message.suggestion)}
                        disabled={message.applied}
                        className={`mt-2 w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
                          message.applied
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                      >
                        {message.applied ? (
                          <span className="flex items-center justify-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Applied</span>
                          </span>
                        ) : (
                          'Apply to Resume'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => setInputMessage(prompt)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me to improve your resume..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;