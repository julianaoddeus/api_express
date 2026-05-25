# api_express

Aplicação fullstack de gerenciamento de tarefas e usuários, com backend em Express e frontend em Next.js.

## Estrutura

```
├── backend/        # API REST com Express (porta 3001)
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── data/       # Persistência em arquivos JSON
└── app/            # Frontend Next.js (porta 3000)
```

## Tecnologias

- **Backend:** Node.js, Express 5, UUID, Nodemon
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui

## Como rodar

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
npm install
npm run dev
```

## Endpoints

### Tarefas — `/api/tasks`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista todas as tarefas |
| POST | `/add` | Cria uma tarefa |
| PUT | `/:id` | Atualiza uma tarefa |
| PATCH | `/:id` | Atualiza parcialmente |
| DELETE | `/:id` | Remove uma tarefa |

**Campos obrigatórios (POST/PUT):** `title`, `assignee`

**Campos opcionais:** `description`, `priority`, `isCompleted`

### Usuários — `/api/users`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista todos os usuários |
| POST | `/add` | Cria um usuário |
| PUT | `/:id` | Atualiza um usuário |
| DELETE | `/:id` | Remove um usuário |
