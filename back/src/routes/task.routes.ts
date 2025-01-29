import express from 'express';
import { createTaskController, getAllTasksController, getTasksByUserIdController, getTaskByIdController, updateTaskByIdController, deleteTaskByIdController } from '../controllers/task.controllers';

const router = express.Router();

// Tasks routes

//Create task
router.post('/', createTaskController);

//Get all tasks
router.get('/', getAllTasksController);

//Get all tasks by user id
router.get('/user/:userId', getTasksByUserIdController);

//Get task by id
router.get('/:id', getTaskByIdController);

//Update task by id
router.put('/:id', updateTaskByIdController);

//Delete task by id
router.delete('/:id', deleteTaskByIdController);

export default router;