import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import CreateEditModal from './CreateEditModal';
import { ColumnId, Columns } from '../types';

// **Estado inicial del tablero Kanban**
const initialColumns: Columns = {
  todo: ['Task 1', 'Task 2', 'Task 3'],
  doing: ['Task 4', 'Task 5'],
  done: ['Task 6'],
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const showCreateModal = () => {
    setCreateModalOpen(true);
  };

  // **Sensores para manejar dispositivos táctiles y mouse**
  const sensors = useSensors(
    useSensor(PointerSensor, {
        // Ignorar elementos con `data-drag-disabled`
        activationConstraint: {
          distance: 10, // Opcional: umbral mínimo de arrastre
        },
        eventListenerOptions: {
          passive: false, // Permite detener la propagación
        },
      }),
  );

  // **Manejador cuando se termina de arrastrar**
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // **Encuentra las columnas de origen y destino**
    const sourceColumn = (Object.keys(columns) as ColumnId[]).find((key) =>
      columns[key].includes(active.id as string)
    );
    const destinationColumn = (Object.keys(columns) as ColumnId[]).find((key) =>
      columns[key].includes(over.id as string)
    );

    if (sourceColumn && destinationColumn) {
      setColumns((prev) => {
        const sourceItems = [...prev[sourceColumn]];
        const destinationItems = [...prev[destinationColumn]];

        const activeIndex = sourceItems.indexOf(active.id as string);
        const overIndex = destinationItems.indexOf(over.id as string);

        if (sourceColumn === destinationColumn) {
          // **Reordenar dentro de la misma columna**
          const updatedItems = arrayMove(sourceItems, activeIndex, overIndex);
          return { ...prev, [sourceColumn]: updatedItems };
        } else {
          // **Mover entre columnas**
          sourceItems.splice(activeIndex, 1);
          destinationItems.splice(overIndex, 0, active.id as string);

          return {
            ...prev,
            [sourceColumn]: sourceItems,
            [destinationColumn]: destinationItems,
          };
        }
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 items-start">
  {Object.entries(columns).map(([columnId, tasks]) => (
    <div key={columnId} className="w-1/3 bg-white p-4 rounded shadow-lg border border-gray-300">
      <h2
        className='text-xl font-semibold pb-2 border-b-2 mb-4 text-blue-700 border-blue-400'
      >
        {columnId.toUpperCase()}
      </h2>

      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableItem key={task} id={task} />
        ))}
      </SortableContext>

      <button className="w-full p-2 mt-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 cursor-pointer" onClick={showCreateModal}>
        + Add Task
      </button>
    </div>
  ))}
</div>
    {/* Modal de creacion */}
    {createModalOpen && ( 
    <CreateEditModal
            mode='create'
            onClose={() => setCreateModalOpen(false)}
            onConfirm={() => {
                // Lógica para crear una nueva tarea
                setCreateModalOpen(false);
            }}
        /> 
    )}
    </DndContext>
  );
}