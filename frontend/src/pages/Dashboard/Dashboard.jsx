import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import BoardCard, {
  CreateBoardCard,
} from "../../components/BoardCard/BoardCard";
import Modal from "../../components/Modal/Modal";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBoards();
    }
  }, [isAuthenticated]);

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const data = await getBoards();
      setBoards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch boards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!boardTitle.trim()) return;

    try {
      setIsSubmitting(true);
      const newBoard = await createBoard(boardTitle.trim());
      setBoards([...boards, newBoard]);
      setIsCreateModalOpen(false);
      setBoardTitle("");
    } catch (err) {
      setError(err ? err.message : "Failed to create board");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBoard = async () => {
    if (!boardTitle.trim() || !selectedBoard) return;

    try {
      setIsSubmitting(true);
      const updatedBoard = await updateBoard(
        selectedBoard._id,
        boardTitle.trim()
      );
      setBoards(
        boards.map((b) => (b._id === selectedBoard._id ? updatedBoard : b))
      );
      setIsEditModalOpen(false);
      setSelectedBoard(null);
      setBoardTitle("");
    } catch (err) {
      setError(err ? err.message : "Failed to update board");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoard) return;

    try {
      setIsSubmitting(true);
      await deleteBoard(selectedBoard._id);
      setBoards(boards.filter((b) => b._id !== selectedBoard._id));
      setIsDeleteModalOpen(false);
      setSelectedBoard(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete board");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (e, board) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setBoardTitle(board.title);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (e, board) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setIsDeleteModalOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="dashboard">
        <Header />
        <div className="dashboard-content">
          <div className="dashboard-loading">
            <div className="dashboard-loading-spinner" />
            <span>Loading your boards...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Boards</h1>
          <p className="dashboard-subtitle">
            Organize your tasks and todos across different boards
          </p>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        {boards.length === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">📋</div>
            <h2 className="dashboard-empty-title">No boards yet</h2>
            <p className="dashboard-empty-text">
              Create your first board to start organizing your tasks
            </p>
            <button
              className="dashboard-empty-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create your first board
            </button>
          </div>
        ) : (
          <div className="boards-grid">
            <CreateBoardCard onClick={() => setIsCreateModalOpen(true)} />
            {boards.map((board) => (
              <BoardCard
                key={board._id}
                board={board}
                onClick={() => navigate(`/board/${board._id}`)}
                onEdit={(e) => openEditModal(e, board)}
                onDelete={(e) => openDeleteModal(e, board)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setBoardTitle("");
        }}
        title="Create New Board"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setBoardTitle("");
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateBoard}
              disabled={isSubmitting || !boardTitle.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Board"}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label" htmlFor="board-title">
            Board Title
          </label>
          <input
            id="board-title"
            type="text"
            className="form-input"
            placeholder="Enter board title"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBoard(null);
          setBoardTitle("");
        }}
        title="Edit Board"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedBoard(null);
                setBoardTitle("");
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleEditBoard}
              disabled={isSubmitting || !boardTitle.trim()}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label" htmlFor="edit-board-title">
            Board Title
          </label>
          <input
            id="edit-board-title"
            type="text"
            className="form-input"
            placeholder="Enter board title"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBoard(null);
        }}
        title="Delete Board"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedBoard(null);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeleteBoard}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Board"}
            </button>
          </>
        }
      >
        <p className="delete-confirm-text">
          Are you sure you want to delete
          <span className="delete-confirm-name">"{selectedBoard?.title}"</span>?
          This action cannot be undone and all todos in this board will be lost.
        </p>
      </Modal>
    </div>
  );
};

export default Dashboard;
