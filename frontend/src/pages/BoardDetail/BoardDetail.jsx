import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import TodoItem, { TodoEmpty } from "../../components/TodoItem/TodoItem";
import Modal from "../../components/Modal/Modal";
import {
  getBoards,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../../services/api";
import "./BoardDetail.css";

const BoardDetail = () => {
  const { boardId } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && boardId) {
      fetchBoardAndTodos();
    }
  }, [isAuthenticated, boardId]);

  const fetchBoardAndTodos = async () => {
    if (!boardId) return;

    try {
      setIsLoading(true);
      const [boards, todosData] = await Promise.all([
        getBoards(),
        getTodos(boardId),
      ]);

      const currentBoard = boards.find((b) => b._id === boardId);
      if (!currentBoard) {
        setError("Board not found");
        return;
      }

      setBoard(currentBoard);
      setTodos(todosData);
    } catch (err) {
      setError(err ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = async () => {
    if (!todoTitle.trim() || !boardId) return;

    try {
      setIsSubmitting(true);
      const newTodo = await createTodo(
        todoTitle.trim(),
        todoDescription.trim(),
        boardId
      );
      setTodos([...todos, newTodo]);
      setIsCreateModalOpen(false);
      resetTodoForm();
    } catch (err) {
      setError(err ? err.message : "Failed to create todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTodo = async () => {
    if (!todoTitle.trim() || !selectedTodo || !boardId) return;

    try {
      setIsSubmitting(true);
      const updatedTodo = await updateTodo(
        selectedTodo._id,
        todoTitle.trim(),
        todoDescription.trim(),
        boardId
      );
      setTodos(
        todos.map((t) => (t._id === selectedTodo._id ? updatedTodo : t))
      );
      setIsEditModalOpen(false);
      setSelectedTodo(null);
      resetTodoForm();
    } catch (err) {
      setError(err ? err.message : "Failed to update todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTodo = async () => {
    if (!selectedTodo) return;

    try {
      setIsSubmitting(true);
      await deleteTodo(selectedTodo._id);
      setTodos(todos.filter((t) => t._id !== selectedTodo._id));
      setIsDeleteModalOpen(false);
      setSelectedTodo(null);
    } catch (err) {
      setError(err ? err.message : "Failed to delete todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetTodoForm = () => {
    setTodoTitle("");
    setTodoDescription("");
  };

  const openEditModal = (todo) => {
    setSelectedTodo(todo);
    setTodoTitle(todo.title);
    setTodoDescription(todo.description || "");
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (todo) => {
    setSelectedTodo(todo);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="board-detail">
        <Header />
        <div className="board-detail-content">
          <div className="board-detail-loading">
            <div className="board-detail-loading-spinner" />
            <span>Loading board...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !board) {
    return (
      <div className="board-detail">
        <Header />
        <div className="board-detail-content">
          <div className="board-detail-error">
            <div className="board-detail-error-icon">😕</div>
            <h2 className="board-detail-error-title">Board not found</h2>
            <p className="board-detail-error-text">
              The board you're looking for doesn't exist or has been deleted.
            </p>
            <button
              className="board-detail-error-btn"
              onClick={() => navigate("/")}
            >
              Go back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="board-detail">
      <Header />
      <div className="board-detail-content">
        <button className="board-detail-back" onClick={() => navigate("/")}>
          ← Back to boards
        </button>

        <div className="board-detail-header">
          <div className="board-detail-info">
            <h1 className="board-detail-title">{board?.title}</h1>
            {board && (
              <p className="board-detail-meta">
                Created on {formatDate(board.createdAt)}
              </p>
            )}
          </div>
          <button
            className="board-detail-add-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span>+</span> Add Todo
          </button>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        {todos.length > 0 && (
          <p className="todos-count">
            {todos.length} todo{todos.length !== 1 ? "s" : ""}
          </p>
        )}

        {todos.length === 0 ? (
          <TodoEmpty />
        ) : (
          <div className="todos-list">
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onEdit={() => openEditModal(todo)}
                onDelete={() => openDeleteModal(todo)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetTodoForm();
        }}
        title="Create New Todo"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetTodoForm();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateTodo}
              disabled={isSubmitting || !todoTitle.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Todo"}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label" htmlFor="todo-title">
            Title
          </label>
          <input
            id="todo-title"
            type="text"
            className="form-input"
            placeholder="Enter todo title"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="todo-description">
            Description (optional)
          </label>
          <textarea
            id="todo-description"
            className="form-textarea"
            placeholder="Enter todo description"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTodo(null);
          resetTodoForm();
        }}
        title="Edit Todo"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedTodo(null);
                resetTodoForm();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleEditTodo}
              disabled={isSubmitting || !todoTitle.trim()}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label" htmlFor="edit-todo-title">
            Title
          </label>
          <input
            id="edit-todo-title"
            type="text"
            className="form-input"
            placeholder="Enter todo title"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="edit-todo-description">
            Description (optional)
          </label>
          <textarea
            id="edit-todo-description"
            className="form-textarea"
            placeholder="Enter todo description"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTodo(null);
        }}
        title="Delete Todo"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTodo(null);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeleteTodo}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Todo"}
            </button>
          </>
        }
      >
        <p className="delete-confirm-text">
          Are you sure you want to delete
          <span className="delete-confirm-name">"{selectedTodo?.title}"</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default BoardDetail;
