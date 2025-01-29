import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import DangerModal from './DangerModal';
import CreateEditModal from './CreateEditModal';

const columnColors: Record<string, string> = {
  todo: "bg-blue-100 border-blue-400 text-blue-900",
  doing: "bg-yellow-100 border-yellow-400 text-yellow-900",
  done: "bg-green-100 border-green-400 text-green-900",
};

export default function SortableItem({ id }: { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const showDangerModal = () => {
    setDangerModalOpen(true);
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
    const showEditModal = () => {
        setEditModalOpen(true);
    }

    const onDelete = (id: string) => {
        console.log(`Deleting task: ${id}`);
    };



  const columnType = id.toLowerCase().includes("task") ? "todo"
    : id.toLowerCase().includes("doing") ? "doing"
    : "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 rounded shadow mb-2 cursor-pointer border ${columnColors[columnType]}`}
    >
      <div className="flex justify-between items-center">
        {id}
        
        {/* Menú de opciones */}
        <Menu as="div" className="relative">
          <MenuButton className="p-1 rounded hover:bg-gray-200 cursor-pointer">
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
          </MenuButton>

          <MenuItems className="absolute w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`flex items-center px-4 py-2 w-full text-sm ${active ? "bg-gray-100" : ""}`}
                  onClick={() => showEditModal()}
                >
                  <PencilIcon className="w-4 h-4 mr-2 text-gray-600" />
                  Edit
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  className={`flex items-center px-4 py-2 w-full text-sm text-red-600 ${active ? "bg-gray-100" : ""}`}
                  onClick={() => showDangerModal()}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      <div className='flex justify-between items-center mt-2'>
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          {"Work"}
        </span>
      </div>

      {/* Modal de confirmación de eliminación */}
      {dangerModalOpen && (
        <DangerModal
          onClose={() => setDangerModalOpen(false)}
          onConfirm={() => {
            onDelete(id); // Llamar la función para eliminar la tarea
            setDangerModalOpen(false);
          }}
        />
      )}

    {/* Modal de edicion */}
    {editModalOpen && ( 
    <CreateEditModal
            mode='edit'
            onClose={() => setEditModalOpen(false)}
            onConfirm={() => {
                console.log('Editando tarea');
                setEditModalOpen(false);
            }}
        /> 
    )}
    </div>
  );
}


