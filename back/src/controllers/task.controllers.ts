import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async.handler';
import { createTask, getAllTasks, getTaskById, deleteTaskById, getTasksByUserId, updateTaskById } from '../services/task.service';

export const createTaskController = asyncHandler(async (req: Request, res: Response) => {
    const task = await createTask(req.body);
    res.status(201).json(task);
});

export const getAllTasksController = asyncHandler(async (req: Request, res: Response) => {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
});

export const getTasksByUserIdController = asyncHandler(async (req: Request, res: Response) => {
    const tasks = await getTasksByUserId(Number(req.params.userId));
    res.status(200).json(tasks);
});

export const getTaskByIdController = asyncHandler(async (req: Request, res: Response) => {
    const task = await getTaskById(Number(req.params.id));
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json('Task not found');
    }
});

export const updateTaskByIdController = asyncHandler(async (req: Request, res: Response) => {
    const task = await updateTaskById(Number(req.params.id), req.body);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json('Task not found');
    }
});

export const deleteTaskByIdController = asyncHandler(async (req: Request, res: Response) => {
    const id = await deleteTaskById(Number(req.params.id));
    if (id) {
        res.status(200).json('Task deleted');
    } else {
        res.status(404).json('Task not found');
    }
});

