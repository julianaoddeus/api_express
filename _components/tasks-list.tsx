"use client";

import { useState, useEffect, useCallback } from "react";
import { tasksApi, usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Circle, Pencil, Trash2, Plus, X } from "lucide-react";
import { Task, User } from "@/lib/types";

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "média" as "baixa" | "média" | "alta",
    assignee: "",
  });

  const lodingTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await tasksApi.listar();
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || "Erro ao carregar tarefas");
      }
    } catch (err) {
      setError(
        "Erro de conexão com o servidor. Verifique se o backend está rodando.",
      );
    }
  }, []);

  const lodingUsers = useCallback(async () => {
    try {
      const response = await usersApi.listar();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || "Erro ao carregar usuários");
      }
    } catch (err) {
      setError(
        "Erro de conexão com o servidor. Verifique se o backend está rodando.",
      );
    }
  }, []);

  useEffect(() => {
    lodingTasks();
    lodingUsers();
  }, [lodingTasks, lodingUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await tasksApi.atualizar(editingTask.id, {
          ...formData,
          isCompleted: editingTask.isCompleted,
        });
      } else {
        await tasksApi.criar(formData);
      }
      setFormData({
        title: "",
        description: "",
        priority: "média",
        assignee: "",
      });
      setShowForm(false);
      setEditingTask(null);
      lodingTasks();
    } catch (err) {
      setError("Erro ao salvar tarefa");
    }
  };

  const handleToggleisCompleted = async (task: Task) => {
    try {
      await tasksApi.atualizarParcial(task.id, {
        isCompleted: !task.isCompleted,
      });
      lodingTasks();
    } catch (err) {
      setError("Erro ao atualizar tarefa");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await tasksApi.deletar(id);
        lodingTasks();
      } catch (err) {
        setError("Erro ao deletar tarefa");
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
    });
    setShowForm(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "média":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tarefas</h2>
        <Button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setEditingTask(null);
            setFormData({
              title: "",
              description: "",
              priority: "média",
              assignee: "",
            });
          }}
        >
          {showForm ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {showForm ? "Cancelar" : "Nova Tarefa"}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Digite o título da tarefa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Digite a descrição"
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={formData.assignee}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assignee: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.name}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "baixa" | "média" | "alta") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="média">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">
                {editingTask ? "Salvar" : "Criar Task"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma tarefa encontrada
          </p>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className={task.isCompleted ? "opacity-60" : ""}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleisCompleted(task)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  <div>
                    <h3
                      className={`font-medium ${task.isCompleted ? "line-through" : ""}`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {task.assignee}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
