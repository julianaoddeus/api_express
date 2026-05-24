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
        const filePath = path.join(DATA_DIR, file);
        const data = await fs.readFile(filePath, "utf-8");
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

    const filePath = path.join(DATA_DIR, `${newTask.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(newTask, null, 2));

    return newTask;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const addTask = (req, res) => {
  const { title, assignee } = req.body;

  if (!title || !assignee) {
    return res.status(400).json({
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
    await ensureDataDir();

    const filePath = path.join(DATA_DIR, `${id}.json`);
    const existingData = await fs.readFile(filePath, "utf-8");
    const exists = JSON.parse(existingData);

    const updateTask = {
      id: exists.id,
      title: params.title,
      description: params.description || "executar tarefa",
      priority: params.position || "média",
      isCompleted: params.active !== undefined ? params.active : false,
      createdAt: exists.createdAt,
      updatedAt: new Date().toISOString(),
      assignee: params.assignee,
    };

    await fs.writeFile(filePath, JSON.stringify(updateTask, null, 2));

    return updateTask;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateTask = (req, res) => {
  const { title, assignee } = req.body;

  if (!title || !assignee) {
    return res.status(400).json({
      success: false,
      error: "Os campos título e responsável são obrigatórios",
    });
  }

  updateTaskPromise(req.params.id, req.body)
    .then((task) => res.status(200).json(task))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function removeTaskPromise(id) {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.unlink(filePath);
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

module.exports = { getTasks, addTask, updateTask, removeTask };
