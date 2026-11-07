<<<<<<< HEAD

=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

<<<<<<< HEAD
  const role = localStorage.getItem("role");

=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
  const linkStyle = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-violet-100 text-violet-700"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  const closeMenu = () => setMenuOpen(false);

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
          aria-label="Toggle menu"
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
          <NavLink to="/dashboard" className={linkStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/employees" className={linkStyle}>
            Employees
          </NavLink>

          <NavLink to="/departments" className={linkStyle}>
            Departments
          </NavLink>
<<<<<<< HEAD

          {role === "HR" && (
            <NavLink to="/managers" className={linkStyle}>
              Managers
            </NavLink>
          )}
=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
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
            <NavLink
              to="/dashboard"
              className={linkStyle}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/employees"
              className={linkStyle}
              onClick={closeMenu}
            >
              Employees
            </NavLink>

            <NavLink
              to="/departments"
              className={linkStyle}
              onClick={closeMenu}
            >
              Departments
            </NavLink>
<<<<<<< HEAD

            {role === "HR" && (
              <NavLink
                to="/managers"
                className={linkStyle}
                onClick={closeMenu}
              >
                Managers
              </NavLink>
            )}
=======
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
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

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> 9c0555efaad0b4cfde9da686f50cfb022a4f2e1c
