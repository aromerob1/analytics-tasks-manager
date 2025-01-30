import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import DangerModal from './DangerModal';
import CreateEditModal from './CreateEditModal';
import { Task } from '../types';

interface SortableItemProps {
  task: Task;
  onDeleteTask?: (taskId: number) => void;
  onTaskCreatedOrModified?: (updatedTask: Task) => void;
}

export default function SortableItem({
  task,
  onDeleteTask,
  onTaskCreatedOrModified,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id.toString(),
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const showDangerModal = () => setDangerModalOpen(true);
  const showEditModal = () => setEditModalOpen(true);

  const handleDelete = () => {
    onDeleteTask?.(task.id);
    setDangerModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 rounded shadow mb-2 cursor-pointer border bg-blue-100 border-blue-400 text-blue-900`}
    >
      <div className="flex justify-between items-center">
        <span>{task.description}</span>

        <Menu as="div" className="relative">
          <MenuButton className="p-1 rounded hover:bg-gray-200 cursor-pointer">
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
          </MenuButton>
          <MenuItems className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`flex items-center px-4 py-2 w-full text-sm ${
                    active ? 'bg-gray-100' : ''
                  }`}
                  onClick={showEditModal}
                >
                  <PencilIcon className="w-4 h-4 mr-2 text-gray-600" />
                  Edit
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  className={`flex items-center px-4 py-2 w-full text-sm text-red-600 ${
                    active ? 'bg-gray-100' : ''
                  }`}
                  onClick={showDangerModal}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="inline-flex items-center rounded-md bg-blue-800 px-2 py-1 text-xs font-medium text-white">
          {task.category}
        </span>
      </div>

      {/* DangerModal for confirming delete */}
      {dangerModalOpen && (
        <DangerModal
          onClose={() => setDangerModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* EditModal for editing */}
      {editModalOpen && (
        <CreateEditModal
          mode="edit"
          task={task}
          onClose={() => setEditModalOpen(false)}
          onTaskCreatedOrModified={(updatedTask) => {
            onTaskCreatedOrModified?.(updatedTask);
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
