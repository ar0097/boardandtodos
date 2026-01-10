const Board = require("../models/Board");

exports.createBoard = async (req, res) => {
    try {
        const board = await Board.create({
            title: req.body.title,
            userId: req.user.id
        });
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ message: "Failed to create board" });
    }
};

exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.find({ userId: req.user.id });
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch boards" });
    }
};

exports.updateBoard = async (req, res) => {
    try {
        const board = await Board.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title: req.body.title },
            { new: true }
        );

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.json(board);
    } catch (error) {
        res.status(500).json({ message: "Failed to update board" });
    }
};

exports.deleteBoard = async (req, res) => {
    try {
        await Board.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        res.json({ message: "Board deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete board" });
    }
};
