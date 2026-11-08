import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/hr/Dashboard";
import Employees from "./pages/hr/Employees";
import Departments from "./pages/hr/Departments";
import Managers from "./pages/hr/Managers";

import ManagerDashboard from "./pages/manager/Dashboard";
import MyEmployees from "./pages/manager/MyEmployees";
import AssignTask from "./pages/manager/AssignTask";
import Tasks from "./pages/manager/Tasks";

import MyTasks from "./pages/Employee/MyTasks";
import EmployeeDashboard from "./pages/Employee/Dashboard";
import Profile from "./pages/Employee/Profile";

// Layout
import Layout from "./components/Layout";

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token")),
  );

  const navigate = useNavigate();

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
      {/* Public Login Route */}
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

      {/* Protected Routes */}
      <Route
        element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route
          path="/dashboard"
          element={
            localStorage.getItem("role") === "HR" ? (
              <Dashboard />
            ) : localStorage.getItem("role") === "MANAGER" ? (
              <ManagerDashboard />
            ) : (
              <EmployeeDashboard />
            )
          }
        />

        <Route
          path="/my-employees"
          element={
            localStorage.getItem("role") === "MANAGER" ? (
              <MyEmployees />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/assign-task"
          element={
            localStorage.getItem("role") === "MANAGER" ? (
              <AssignTask />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/tasks"
          element={
            localStorage.getItem("role") === "MANAGER" ? (
              <Tasks />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/my-tasks"
          element={
            localStorage.getItem("role") === "EMPLOYEE" ? (
              <MyTasks />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            ["MANAGER", "EMPLOYEE"].includes(localStorage.getItem("role")) ? (
              <Profile />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route path="/employees" element={<Employees />} />

        <Route path="/departments" element={<Departments />} />

        <Route path="/managers" element={<Managers />} />
      </Route>

      {/* Default Route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
