import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isEditing: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text...',
  className = '',
  isEditing,
  onFocus,
  onBlur
}) => {
  const [editorData, setEditorData] = useState(value);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setEditorData(value);
  }, [value]);

  const handleEditorReady = (editor: any) => {
    editorRef.current = editor;
    
    // Configure the editor
    editor.editing.view.change((writer: any) => {
      writer.setStyle('min-height', '100px', editor.editing.view.document.getRoot());
    });

    // Set placeholder
    editor.model.document.on('change:data', () => {
      const data = editor.getData();
      setEditorData(data);
      onChange(data);
    });
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  // Show plain text when not editing
  if (!isEditing) {
    return (
      <div 
        className={`cursor-text hover:bg-gray-50 hover:border hover:border-gray-200 rounded p-2 transition-all duration-200 ${className} ${!value ? 'text-gray-400 italic' : ''}`}
        dangerouslySetInnerHTML={{ __html: value || placeholder }}
        onClick={onFocus}
      />
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        config={{
          placeholder: placeholder,
          toolbar: {
            items: [
              'bold',
              'italic',
              'underline',
              'strikethrough',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'undo',
              'redo'
            ]
          },
          removePlugins: [
            'CKFinderUploadAdapter',
            'CKFinder',
            'EasyImage',
            'Image',
            'ImageCaption',
            'ImageStyle',
            'ImageToolbar',
            'ImageUpload',
            'MediaEmbed'
          ]
        }}
        onReady={handleEditorReady}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default RichTextEditor; 