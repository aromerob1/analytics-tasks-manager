import { Task } from '../types';
import api from './ApiService';

export const getAllTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (taskData: {
  description: string;
  category: string;
}) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (
  taskId: number,
  taskData: {
    description?: string;
    category?: string;
    status?: string;
    completedAt?: Date | null;
    deletedAt?: Date;
  }
) => {
  console.log(taskData);
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const getTaskById = async (taskId: number) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const getTasksByUser = async () => {
  const response = await api.get(`/tasks/user`);
  return response.data;
};

export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}`);
};

export const getUserAnalytics = async (tasks: Task[]) => {
  const response = await api.post('/tasks/analytics', tasks);
  return response.data;
};
