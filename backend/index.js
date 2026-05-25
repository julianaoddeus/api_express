const express = require("express");
const cors = require('cors');
const loggerMiddleware = require("./middlewares/logger");

const usersRouter = require("./routes/users");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
