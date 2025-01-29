import api from "./ApiService";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // { token: "your_jwt_token" }
};

export const register = async (email: string, password: string) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};
