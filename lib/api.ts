import axios from "axios";
import { ApiResponse, Task, User } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const tasksApi = {
  listar: async (): Promise<ApiResponse<Task[]>> => {
    const response = await api.get(`/tasks`);
    return { success: true, data: response.data };
  },
  criar: async (params: Partial<Task>): Promise<ApiResponse<Task>> => {
    const response = await api.post(`/tasks/add`, params);
    return { success: true, data: response.data };
  },
  atualizar: async (
    id: string,
    params: Partial<Task>,
  ): Promise<ApiResponse<Task>> => {
    const response = await api.put(`/tasks/${id}`, params);
    return { success: true, data: response.data };
  },
  atualizarParcial: async (
    id: string,
    params: Partial<Task>,
  ): Promise<ApiResponse<Task>> => {
    const response = await api.patch(`/tasks/${id}`, params);
    return { success: true, data: response.data };
  },
  deletar: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/tasks/${id}`);
    return { success: true, data: response.data };
  },
};

export const usersApi = {
  listar: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users`);
    return { success: true, data: response.data };
  },
  criar: async (params: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.post(`/users/add`, params);
    return { success: true, data: response.data };
  },
  atualizar: async (
    id: string,
    params: Partial<User>,
  ): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, params);
    return { success: true, data: response.data };
  },
  deletar: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${id}`);
    return { success: true, data: response.data };
  },
};
