import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import BoardDetail from "./pages/BoardDetail/BoardDetail";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/board/:boardId" element={<BoardDetail />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
