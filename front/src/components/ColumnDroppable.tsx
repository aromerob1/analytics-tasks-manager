import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface ColumnDroppableProps {
  columnId: string;
  children: ReactNode;
}

export default function ColumnDroppable({
  columnId,
  children,
}: ColumnDroppableProps) {
  const { isOver, setNodeRef } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={`w-1/3 bg-white p-4 rounded shadow-lg border border-gray-300 ${
        isOver ? 'bg-blue-50' : ''
      }`}
    >
      {children}
    </div>
  );
}
