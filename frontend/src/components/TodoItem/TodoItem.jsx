import "./TodoItem.css";
import { FiEdit, FiTrash2, FiFileText } from "react-icons/fi";

const TodoItem = ({ todo, onEdit, onDelete }) => {
  return (
    <div className="todo-item">
      <div className="todo-item-header">
        <div className="todo-item-content">
          <h4 className="todo-item-title">{todo.title}</h4>
          {todo.description && (
            <p className="todo-item-description">{todo.description}</p>
          )}
        </div>
        <div className="todo-item-actions">
          <button
            className="todo-item-action-btn edit"
            onClick={onEdit}
            title="Edit todo"
          >
            <FiEdit size={16} />
          </button>
          <button
            className="todo-item-action-btn delete"
            onClick={onDelete}
            title="Delete todo"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TodoEmpty = () => {
  return (
    <div className="todo-empty">
      <div className="todo-empty-icon">
        <FiFileText size={32} />
      </div>
      <h3 className="todo-empty-title">No todos yet</h3>
      <p className="todo-empty-text">
        Create your first todo to get started with this board.
      </p>
    </div>
  );
};

export default TodoItem;
