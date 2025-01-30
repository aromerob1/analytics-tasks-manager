import express from 'express';
import {
  createTaskController,
  getAllTasksController,
  getTasksByUserIdController,
  getTaskByIdController,
  updateTaskByIdController,
  deleteTaskByIdController,
  calculateAnalyticsController,
} from '../controllers/task.controllers';

const router = express.Router();

// Tasks routes

//Create task
router.post('/', createTaskController);

//Get all tasks
router.get('/', getAllTasksController);

//Get all tasks by user
router.get('/user', getTasksByUserIdController);

//Get task by id
router.get('/:id', getTaskByIdController);

//Update task by id
router.put('/:id', updateTaskByIdController);

//Delete task by id
router.delete('/:id', deleteTaskByIdController);

//Analytics calculation
router.post('/analytics', calculateAnalyticsController);

export default router;
