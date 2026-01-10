const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db')
const dotenv = require('dotenv');

const authRoutes = require("./routes/auth.routes");
const boardRoutes = require("./routes/board.routes");
const todoRoutes = require("./routes/todo.routes");

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
