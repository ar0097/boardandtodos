import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as apiLogin, register as apiRegister } from "../../services/api";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await apiLogin(email, password);
        login(response.token, response.user);
        navigate("/");
      } else {
        if (!name.trim()) {
          setError("Please enter your name");
          setIsLoading(false);
          return;
        }
        const response = await apiRegister(name, email, password);
        login(response.token, response.user);
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      setError(err ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-icon">B</div>
              <span className="auth-logo-text">Boards</span>
            </div>
            <h1 className="auth-title">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="auth-subtitle">
              {isLogin
                ? "Sign in to access your boards and todos"
                : "Get started with your task management"}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="auth-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button className="auth-switch-btn" onClick={toggleMode}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
