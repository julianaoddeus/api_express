const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.get("/", taskController.getTasks);
router.post("/add", taskController.addTask);
router.put("/:id", taskController.updateTask);
router.patch("/:id", taskController.patchTask);
router.delete("/:id", taskController.removeTask);

module.exports = router;
