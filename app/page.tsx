"use client"
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ClipboardList, Users } from 'lucide-react';
import { TasksList } from "@/_components/tasks-list";
import { UserList } from "@/_components/users-list";

export default function Home() {
  const [activeTab, setActiveTab] = useState("tasks");
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Gerenciador de Tarefas e Usuários
          </h1>
          <p className="text-muted-foreground">
            Sistema REST API - Node.js + Express + React
          </p>
        </header>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
               <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            
          </TabsList>
          <TabsContent value="tasks">
            <TasksList/>
          </TabsContent>
          <TabsContent value="users">
            <UserList/>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
