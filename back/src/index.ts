import express from 'express';
import dotenv from 'dotenv';
import tasksRouter from './routes/task.routes';
import authRouter from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import { connectDB } from './database';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('Tasks API is running');
});

app.use('/tasks', tasksRouter);

app.use('/auth', authRouter);

// Manejo global de errores
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});