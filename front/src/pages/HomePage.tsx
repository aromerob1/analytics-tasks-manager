import KanbanBoard from '../components/KanbanBoard';
import { useState, useEffect } from 'react';
import { Task } from '../types';
import { getAllTasks } from '../services/TaskService';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    getAllTasks().then((tasks: Task[]) => setTasks(tasks));
  }, []);
  console.log(tasks);

  return (
    <>
      <KanbanBoard />
    </>
  );
}
