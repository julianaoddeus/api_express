// Tipos
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "baixa" | "média" | "alta";
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  assignee: string;
}

export interface Users {
  id: string;
  name: string;
  email: string;
  position: string;
  active: boolean;
  createdAt: string;
  updateAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}
