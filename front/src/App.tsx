import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { useState, useEffect } from 'react';
import { getTasksByUser } from './services/TaskService';
import { Task } from './types';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    getTasksByUser().then((tasks: Task[]) => setTasks(tasks));
  }, []);
  console.log(tasks);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage tasks={tasks} />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
