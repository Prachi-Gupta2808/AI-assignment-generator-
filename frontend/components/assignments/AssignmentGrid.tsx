
'use client';

import { Assignment } from '@/types';
import { AssignmentCard } from './AssignmentCard';

interface AssignmentGridProps {
  assignments: Assignment[];
  onDelete: (id: string) => void;
}

export function AssignmentGrid({ assignments, onDelete }: AssignmentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
export default AssignmentGrid;
