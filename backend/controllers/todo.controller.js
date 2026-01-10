const Todo = require("../models/Todo");

exports.createTodo = async (req, res) => {
    try {
        const todo = await Todo.create({
            title: req.body.title,
            description: req.body.description,
            boardId: req.body.boardId,
            userId: req.user.id
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: "Failed to create todo" });
    }
};

exports.getTodosByBoard = async (req, res) => {
    try {
        const todos = await Todo.find({
            boardId: req.params.boardId,
            userId: req.user.id
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch todos" });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: "Failed to update todo" });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        await Todo.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete todo" });
    }
};
