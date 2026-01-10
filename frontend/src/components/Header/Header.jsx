import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/")}>
        <div className="header-logo-icon">B</div>
        <span>Boards</span>
      </div>

      <nav className="header-nav">
        <div className="header-user">
          <span className="header-user-name">{user?.name}</span>
          <div className="header-user-avatar">
            {user?.name ? getInitials(user.name) : "U"}
          </div>
        </div>
        <button className="header-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
