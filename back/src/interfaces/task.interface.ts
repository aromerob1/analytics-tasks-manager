interface TaskAttributes {
  id: number;
  description: string;
  category: string;
  status: 'todo' | 'doing' | 'done';
  userId: number;
  completedAt?: Date | null;
  deletedAt?: Date | null;
}
