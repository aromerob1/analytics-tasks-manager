import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
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

import ColumnDroppable from './ColumnDroppable';
import SortableItem from './SortableItem';
import CreateEditModal from './CreateEditModal';
import { updateTask } from '../services/TaskService';
import { ColumnId, Task } from '../types';

type ColumnTasks = {
  todo: Task[];
  doing: Task[];
  done: Task[];
};

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const [columns, setColumns] = useState<ColumnTasks>({
    todo: [],
    doing: [],
    done: [],
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const grouped: ColumnTasks = { todo: [], doing: [], done: [] };

    tasks
      .filter((t) => !t.deletedAt)
      .forEach((task) => {
        grouped[task.status as ColumnId].push(task);
      });

    setColumns(grouped);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
      eventListenerOptions: { passive: false },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const possibleColumns: string[] = ['todo', 'doing', 'done'];
    const isColumnDrop = possibleColumns.includes(overId);

    const sourceColumn = (Object.keys(columns) as ColumnId[]).find((col) =>
      columns[col].some((t) => t.id.toString() === activeId)
    );
    if (!sourceColumn) return;

    if (isColumnDrop) {
      setColumns((prev) => {
        const sourceItems = [...prev[sourceColumn]];
        const activeIndex = sourceItems.findIndex(
          (t) => t.id.toString() === activeId
        );

        const [movedTask] = sourceItems.splice(activeIndex, 1);
        movedTask.status = overId as ColumnId;

        const payload: Partial<Task> = { status: movedTask.status };
        if (movedTask.status === 'done') {
          payload.completedAt = new Date();
        } else {
          payload.completedAt = null;
        }

        updateTask(movedTask.id, payload).catch((error) => {
          console.error('Failed to update task status on server:', error);
        });

        const destinationItems = [...prev[overId as ColumnId]];
        destinationItems.push(movedTask);

        return {
          ...prev,
          [sourceColumn]: sourceItems,
          [overId]: destinationItems,
        };
      });
    } else {
      const destinationColumn = (Object.keys(columns) as ColumnId[]).find(
        (col) => columns[col].some((t) => t.id.toString() === overId)
      );
      if (!destinationColumn) return;

      if (sourceColumn === destinationColumn) {
        setColumns((prev) => {
          const items = [...prev[sourceColumn]];
          const activeIndex = items.findIndex(
            (t) => t.id.toString() === activeId
          );
          const overIndex = items.findIndex((t) => t.id.toString() === overId);
          const reordered = arrayMove(items, activeIndex, overIndex);
          return { ...prev, [sourceColumn]: reordered };
        });
      } else {
        setColumns((prev) => {
          const sourceItems = [...prev[sourceColumn]];
          const destinationItems = [...prev[destinationColumn]];

          const activeIndex = sourceItems.findIndex(
            (t) => t.id.toString() === activeId
          );
          const overIndex = destinationItems.findIndex(
            (t) => t.id.toString() === overId
          );

          const [movedTask] = sourceItems.splice(activeIndex, 1);
          movedTask.status = destinationColumn as ColumnId;

          const payload: Partial<Task> = { status: movedTask.status };
          if (movedTask.status === 'done') {
            payload.completedAt = new Date();
          } else {
            payload.completedAt = null;
          }

          updateTask(movedTask.id, payload).catch((error) => {
            console.error('Failed to update task status on server:', error);
          });

          destinationItems.splice(overIndex, 0, movedTask);

          return {
            ...prev,
            [sourceColumn]: sourceItems,
            [destinationColumn]: destinationItems,
          };
        });
      }
    }
  };

  const handleCreatedOrModified = (newOrUpdatedTask: Task) => {
    setColumns((prev) => {
      const newCols = { ...prev };
      (Object.keys(newCols) as ColumnId[]).forEach((col) => {
        newCols[col] = newCols[col].filter((t) => t.id !== newOrUpdatedTask.id);
      });

      const colKey = newOrUpdatedTask.status as ColumnId;
      newCols[colKey].push(newOrUpdatedTask);
      return newCols;
    });
  };

  const handleDeleteTask = (taskId: number) => {
    let found: Task | undefined;
    let foundColumn: ColumnId | undefined;
    for (const col of ['todo', 'doing', 'done'] as ColumnId[]) {
      const item = columns[col].find((t) => t.id === taskId);
      if (item) {
        found = item;
        foundColumn = col;
        break;
      }
    }
    if (!found || !foundColumn) return;

    const payload = { deletedAt: new Date() };

    updateTask(taskId, payload)
      .then(() => {
        setColumns((prev) => {
          const newCols = { ...prev };
          newCols[foundColumn!] = newCols[foundColumn!].filter(
            (t) => t.id !== taskId
          );
          return newCols;
        });
      })
      .catch((error) => {
        console.error('Failed to soft-delete task:', error);
      });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 items-start">
        {(['todo', 'doing', 'done'] as ColumnId[]).map((columnId) => {
          const tasksInColumn = columns[columnId];

          return (
            <ColumnDroppable key={columnId} columnId={columnId}>
              <h2 className="text-xl font-semibold pb-2 border-b-2 mb-4 text-blue-700 border-blue-400">
                {columnId.toUpperCase()}
              </h2>
              <SortableContext
                items={tasksInColumn.map((t) => t.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                {tasksInColumn.map((task) => (
                  <SortableItem
                    key={task.id}
                    task={task}
                    onDeleteTask={handleDeleteTask}
                    onTaskCreatedOrModified={handleCreatedOrModified}
                  />
                ))}
              </SortableContext>

              {columnId === 'todo' && (
                <button
                  className="w-full p-2 mt-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 cursor-pointer"
                  onClick={() => setCreateModalOpen(true)}
                >
                  + Add Task
                </button>
              )}
            </ColumnDroppable>
          );
        })}
      </div>

      {createModalOpen && (
        <CreateEditModal
          mode="create"
          onClose={() => setCreateModalOpen(false)}
          onTaskCreatedOrModified={handleCreatedOrModified}
        />
      )}
    </DndContext>
  );
}
