import React, { useState, useEffect, useRef } from 'react';

interface InlineTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isEditing: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  multiline?: boolean;
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text...',
  className = '',
  isEditing,
  onFocus,
  onBlur,
  multiline = false
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      if (localValue !== value) {
        onChange(localValue);
      }
      onBlur?.();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      onBlur?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  // Show display text when not editing
  if (!isEditing) {
    return (
      <div 
        className={`cursor-text hover:bg-gray-50 hover:border hover:border-gray-200 rounded px-2 py-1 transition-all duration-200 ${className} ${!value ? 'text-gray-400 italic' : ''}`}
        onClick={onFocus}
      >
        {value || placeholder}
      </div>
    );
  }

  const commonProps = {
    ref: inputRef as any,
    value: localValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    placeholder,
    className: `w-full bg-transparent border border-transparent outline-none focus:border-blue-200 focus:rounded px-2 py-1 transition-all duration-200 ${className}`,
    style: {
      color: 'inherit',
      backgroundColor: 'transparent',
      ...(className.includes('text-white') && { color: 'white' }),
      ...(className.includes('text-gray-300') && { color: '#d1d5db' })
    }
  };

  if (multiline) {
    return (
      <textarea
        {...commonProps}
        rows={3}
        className={`w-full bg-transparent border border-transparent outline-none resize-none focus:border-blue-200 focus:rounded p-2 transition-all duration-200 ${className}`}
      />
    );
  }

  return <input type="text" {...commonProps} />;
};

export default InlineTextEditor; 