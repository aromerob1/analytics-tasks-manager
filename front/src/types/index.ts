// Tipo para una tarea
export interface Task {
  id: string;
  description: string;
  status: ColumnId;
  createdAt: Date;
  completedAt?: Date;
  category?: string;
  deleted?: boolean;
}

export type ColumnId = 'todo' | 'doing' | 'done';
export type Columns = Record<ColumnId, string[]>;

export interface CreateEditModalProps {
  mode: 'create' | 'edit'; // Define el modo del modal
  onClose: () => void; // Función para cerrar el modal
  onConfirm: () => void; // Acción al confirmar
}

export interface DangerModalProps {
  onClose: () => void; // Función para cerrar el modal
  onConfirm: () => void; // Acción al confirmar
}
