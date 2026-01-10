import "./BoardCard.css";
import { FiGrid, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const BoardCard = ({ board, onClick, onEdit, onDelete }) => {
  console.log("example", board);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="board-card" onClick={onClick}>
      <div className="board-card-icon">
        <FiGrid size={22} />
      </div>
      <div className="board-card-header">
        <h3 className="board-card-title">{board.title}</h3>
        <div className="board-card-actions">
          <button
            className="board-card-action-btn edit"
            onClick={onEdit}
            title="Edit board"
          >
            <FiEdit size={16} />
          </button>
          <button
            className="board-card-action-btn delete"
            onClick={onDelete}
            title="Delete board"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      <div className="board-card-meta">
        <span>Created {formatDate(board.createdAt)}</span>
      </div>
    </div>
  );
};

export const CreateBoardCard = ({ onClick }) => {
  return (
    <div className="board-card board-card-create" onClick={onClick}>
      <div className="board-card-create-icon">+</div>
      <span className="board-card-create-text">Create new board</span>
    </div>
  );
};

export default BoardCard;
