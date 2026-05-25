const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs").promises;

const DATA_DIR = path.join(__dirname, "..", "data", "tasks");

const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Erro ao criar diretório:", error);
  }
};

async function getTasksPromise() {
  try {
    await ensureDataDir();
    const files = await fs.readdir(DATA_DIR);
    const tasks = [];
    for (const file of files) {
      if (file.endsWith(".json")) {
        const data = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
        tasks.push(JSON.parse(data));
      }
    }
    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getTasks = (req, res) => {
  getTasksPromise()
    .then((tasks) => res.status(200).json(tasks))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function addTaskPromise(task) {
  try {
    await ensureDataDir();
    const newTask = {
      id: uuidv4(),
      title: task.title,
      description: task.description || "executar tarefa",
      priority: task.priority || "média",
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: task.assignee,
    };
    await fs.writeFile(
      path.join(DATA_DIR, `${newTask.id}.json`),
      JSON.stringify(newTask, null, 2),
    );
    return newTask;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const addTask = (req, res) => {
  const { title, assignee } = req.body;
  if (!title || !assignee) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Os campos título e responsável são obrigatórios",
      });
  }
  addTaskPromise(req.body)
    .then((task) => res.status(200).json(task))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function updateTaskPromise(id, params) {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const exists = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const updated = {
      ...exists,
      title: params.title,
      description: params.description || "executar tarefa",
      priority: params.priority || "média",
      isCompleted:
        params.isCompleted !== undefined
          ? params.isCompleted
          : exists.isCompleted,
      assignee: params.assignee,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateTask = (req, res) => {
  const { title, assignee } = req.body;
  if (!title || !assignee) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Os campos título e responsável são obrigatórios",
      });
  }
  updateTaskPromise(req.params.id, req.body)
    .then((task) => res.status(200).json(task))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function patchTaskPromise(id, params) {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const exists = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const updated = {
      ...exists,
      ...params,
      id: exists.id,
      createdAt: exists.createdAt,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const patchTask = (req, res) => {
  patchTaskPromise(req.params.id, req.body)
    .then((task) => res.status(200).json(task))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function removeTaskPromise(id) {
  try {
    await fs.unlink(path.join(DATA_DIR, `${id}.json`));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const removeTask = (req, res) => {
  removeTaskPromise(req.params.id)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

module.exports = { getTasks, addTask, updateTask, patchTask, removeTask };
