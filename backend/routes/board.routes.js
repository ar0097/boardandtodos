const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    createBoard,
    getBoards,
    updateBoard,
    deleteBoard
} = require("../controllers/board.controller");

router.use(auth);

router.post("/", createBoard);
router.get("/", getBoards);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;
