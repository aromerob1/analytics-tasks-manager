export interface Task {
  id: number;
  description: string;
  status: ColumnId;
  createdAt: Date;
  completedAt?: Date | null;
  category: string;
  deletedAt?: Date;
}

export type ColumnId = 'todo' | 'doing' | 'done';
export type Columns = Record<ColumnId, Task[]>;

export interface CreateEditModalProps {
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onTaskCreatedOrModified: (newTask: Task) => void;
}

export interface DangerModalProps {
  onClose: () => void;
  onConfirm: () => void;
}
