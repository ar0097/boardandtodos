const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    createTodo,
    getTodosByBoard,
    updateTodo,
    deleteTodo
} = require("../controllers/todo.controller");

router.use(auth);

router.post("/", createTodo);
router.get("/:boardId", getTodosByBoard);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
