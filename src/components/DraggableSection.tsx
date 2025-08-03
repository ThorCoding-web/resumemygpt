import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({ id, children, className = '' }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${className}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-4 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>
      
      {/* Section Content */}
      <div className={`${isDragging ? 'shadow-lg' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default DraggableSection; 