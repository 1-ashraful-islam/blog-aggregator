import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import APIListPage from "./pages/APIListPage";
import { ToastContainer } from "react-toastify";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./components/AuthContext";
import SignUpPage from "./pages/SignUpPage";

function Navigation() {
  const { isLoggedIn, handleLogout } = useAuth();
  return (
    <nav>
      <ul className="App-nav">
        <div className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <Link to="/discover">Discover</Link>
            </li>
          ) : null}
          <li>
            <Link to="/api">API Reference</Link>
          </li>
        </div>
        <div className="auth-links">
          {!isLoggedIn ? (
            <li>
              <Link to="/login">Login / Sign Up</Link>
            </li>
          ) : (
            <li>
              <Link to="#" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigation />
          <ToastContainer />
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/discover" element={<ExplorePage />} />
            <Route path="/api" element={<APIListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
