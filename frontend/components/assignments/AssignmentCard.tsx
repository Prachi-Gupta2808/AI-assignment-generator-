'use client';

import { Assignment } from '@/types';
import { Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleView = () => {
    setMenuOpen(false);
    router.push(`/assignments/${assignment.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(assignment.id);
  };

  return (
    <div className="relative bg-white rounded-2xl p-5 border border-neutral-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-neutral-300/80 transition-all duration-200 flex flex-col justify-between select-none">
  
      <div className="flex items-start justify-between gap-4 mb-5">
        <h3 className="text-base font-bold text-neutral-800 tracking-tight leading-snug">
          {assignment.title}
        </h3>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer active:scale-95"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-38 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={handleView}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"
              >
                <Eye size={13} className="text-neutral-400" />
                <span>View Assignment</span>
              </button>
              <div className="border-t border-neutral-100 my-1" />
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <Trash2 size={13} className="text-red-400" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-neutral-50 pt-4 text-xs font-medium text-neutral-400">
        <div>
          <span>Assigned on : </span>
          <span className="text-neutral-700">{assignment.assignedDate}</span>
        </div>
        <div>
          <span>Due : </span>
          <span className="text-neutral-700">{assignment.dueDate}</span>
        </div>
      </div>
    </div>
  );
}
export default AssignmentCard;
