'use client';

import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, X, Loader2, User as UserIcon } from 'lucide-react';
import { User } from '@/lib/types';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
  });

  const lodingUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.listar();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Erro ao carregar usuários');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    lodingUsers();
  }, [lodingUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersApi.atualizar(editingUser.id, { ...formData, active: editingUser.active });
      } else {
        await usersApi.criar(formData);
      }
      setFormData({ name: '', email: '', position: '' });
      setShowForm(false);
      setEditingUser(null);
      lodingUsers();
    } catch (err) {
      setError('Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await usersApi.deletar(id);
        lodingUsers();
      } catch (err) {
        setError('Erro ao deletar usuário');
      }
    }
  };

  const handleEdit = (usuario: User) => {
    setEditingUser(usuario);
    setFormData({
      name: usuario.name,
      email: usuario.email,
      position: usuario.position,
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Usuários</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingUser(null); setFormData({ name: '', email: '', position: '' }); }}>
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancelar' : 'Novo Usuário'}
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
            <CardTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite o email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Digite o cargo"
                />
              </div>
              <Button type="submit">{editingUser ? 'Salvar' : 'Criar Usuário'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 col-span-full">Nenhum usuário encontrado</p>
        ) : (
          users.map((usuario) => (
            <Card key={usuario.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{usuario.name}</h3>
                      <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      <p className="text-sm text-muted-foreground">{usuario.position}</p>
                    </div>
                  </div>
                  <Badge variant={usuario.active ? 'default' : 'secondary'}>
                    {usuario.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(usuario)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleDelete(usuario.id)}>
                    <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                    Deletar
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
