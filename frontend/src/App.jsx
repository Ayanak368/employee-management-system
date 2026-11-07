<<<<<<< HEAD

=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

<<<<<<< HEAD
// Pages
=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
<<<<<<< HEAD
import Managers from "./pages/Managers";

// Layout
import Layout from "./components/Layout";


=======
import Layout from "./components/Layout";

>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  const navigate = useNavigate();

<<<<<<< HEAD
  // Handle login
=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

<<<<<<< HEAD
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

=======
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
<<<<<<< HEAD

      {/* Public Login Route */}
=======
      {/* Public route */}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

<<<<<<< HEAD
      {/* Protected Routes */}
=======
      {/* Protected layout */}
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
      <Route
        element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
<<<<<<< HEAD
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/employees"
          element={<Employees />}
        />

        <Route
          path="/departments"
          element={<Departments />}
        />

        <Route
          path="/managers"
          element={<Managers />}
        />
      </Route>

      {/* Default Route */}
=======
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/departments" element={<Departments />} />
      </Route>

>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
<<<<<<< HEAD

=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
    </Routes>
  );
}

<<<<<<< HEAD

=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
