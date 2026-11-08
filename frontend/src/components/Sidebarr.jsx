
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebarr({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = localStorage.getItem("role");

  const linkStyle = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-violet-100 text-violet-700"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  const closeMenu = () => setMenuOpen(false);

  const navigation = {
    HR: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Employees", path: "/employees" },
      { name: "Departments", path: "/departments" },
      { name: "Managers", path: "/managers" },
    ],

    MANAGER: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "My Employees", path: "/my-employees" },
      { name: "Tasks", path: "/tasks" },
      { name: "Assign Task", path: "/assign-task" },
      { name: "My Profile", path: "/profile" },
    ],

    EMPLOYEE: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "My Tasks", path: "/my-tasks" },
      { name: "My Profile", path: "/profile" },
    ],
  };

  const links = navigation[role] || [];

  const renderLinks = () =>
    links.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={linkStyle}
        onClick={closeMenu}
      >
        {link.name}
      </NavLink>
    ));

  return (
    <>
      {/* Mobile Navbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white p-4 md:hidden">
        <h1 className="text-2xl font-bold text-violet-600">
          Employify
        </h1>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg bg-slate-100 px-3 py-2 text-xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-white p-5 shadow-sm md:flex">
        <h1 className="mb-8 text-2xl font-bold text-violet-600">
          Employify
        </h1>

        <nav className="space-y-2">
          {renderLinks()}
        </nav>

        <button
          onClick={onLogout}
          className="mt-auto w-full rounded-lg bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </aside>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[65px] z-50 border-b bg-white p-5 shadow-lg md:hidden">
          <nav className="space-y-2">
            {renderLinks()}
          </nav>

          <button
            onClick={() => {
              closeMenu();
              onLogout();
            }}
            className="mt-6 w-full rounded-lg bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Sidebarr;
