import { Task } from '../models/task.model';

export const createTask = async (taskData: TaskAttributes): Promise<Task> => {
    try {
      const task = await Task.create(taskData);
      return task;
    } catch (error) {
      throw new Error(`Error creating task: ${error}`);
    }
};

export const getAllTasks = async (): Promise<Task[]> => {
    try {
      const tasks = await Task.findAll();
      return tasks;
    } catch (error) {
      throw new Error(`Error getting tasks: ${error}`);
    }
};

export const getTasksByUserId = async (userId: number): Promise<Task[]> => {
    try {
      const tasks = await Task.findAll({ where: { userId } });
      return tasks;
    } catch (error) {
      throw new Error(`Error getting tasks by user id: ${error}`);
    }
};

export const getTaskById = async (id: number): Promise<Task | null> => {
    try {
      const task = await Task.findByPk(id);
      return task;
    } catch (error) {
      throw new Error(`Error getting task by id: ${error}`);
    }
};

export const updateTaskById = async (id: number, taskData: TaskAttributes): Promise<Task | null> => {
    try {
      const task = await Task.findByPk(id);
      if (task) {
        await task.update(taskData);
        return task;
      }
      return null;
    } catch (error) {
      throw new Error(`Error updating task by id: ${error}`);
    }
};

export const deleteTaskById = async (id: number): Promise<number> => {
    try {
      const task = await Task.findByPk(id);
      if (task) {
        await task.destroy();
        return id;
      }
      return 0;
    } catch (error) {
      throw new Error(`Error deleting task by id: ${error}`);
    }
};

