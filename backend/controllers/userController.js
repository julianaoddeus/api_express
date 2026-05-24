const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs").promises;

const DATA_DIR = path.join(__dirname, "..", "data", "users");

const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Erro ao criar diretório:", error);
  }
};

async function getUsersPromise() {
  try {
    await ensureDataDir();
    const files = await fs.readdir(DATA_DIR);
    const users = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(DATA_DIR, file);
        const data = await fs.readFile(filePath, "utf-8");
        users.push(JSON.parse(data));
      }
    }

    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getUsers = (req, res) => {
  getUsersPromise()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function addUserPromise(user) {
  try {
    await ensureDataDir();

    const newUsers = {
      id: uuidv4(),
      name: user.name,
      email: user.email,
      position: user.position || "Membro",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const filePath = path.join(DATA_DIR, `${newUsers.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(newUsers, null, 2));

    return newUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const addUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Os campos nome e email são obrigatórios",
    });
  }

  addUserPromise(req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function updateUserPromise(id, params) {
  try {
    await ensureDataDir();

    const filePath = path.join(DATA_DIR, `${id}.json`);
    const existingData = await fs.readFile(filePath, "utf-8");
    const exists = JSON.parse(existingData);

    const updateUser = {
      id: exists.id,
      name: params.name,
      email: params.email,
      position: params.position || "Membro",
      active: params.active !== undefined ? params.active : true,
      createdAt: exists.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(updateUser, null, 2));

    return updateUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Os campos nome e email são obrigatórios",
    });
  }

  updateUserPromise(req.params.id, req.body)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json({ error: err.message }));
};

async function removeUserPromise(id) {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.unlink(filePath);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const removeUser = (req, res) => {
  removeUserPromise(req.params.id)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(500).json({ error: err.message }));
};

module.exports = { getUsers, addUser, updateUser, removeUser };
