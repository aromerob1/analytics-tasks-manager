import express from 'express';
import dotenv from 'dotenv';
import tasksRouter from './routes/task.routes';
import { errorHandler } from './middlewares/error.middleware';
import { connectDB } from './database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('Tasks API is running');
});

app.use('/tasks', tasksRouter);

// Manejo global de errores
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});