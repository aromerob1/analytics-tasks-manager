import KanbanBoard from '../components/KanbanBoard';
import { Task } from '../types';

export default function HomePage({ tasks }: { tasks: Task[] }) {
  return (
    <>
      <KanbanBoard tasks={tasks} />
    </>
  );
}
