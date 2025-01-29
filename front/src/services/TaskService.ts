import api from "./ApiService";

export const getAllTasks = async () => {
  const response = await api.get("/tasks");
  return response.data; // Returns an array of tasks
};

export const createTask = async (taskData: { title: string; category: string }) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const updateTask = async (taskId: number, taskData: { title: string; category: string }) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const getTaskById = async (taskId: number) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
};

export const getTasksByUserId = async (userId: number) => {
    const response = await api.get(`/tasks/user/${userId}`);
    return response.data;
};

export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}`);
};
