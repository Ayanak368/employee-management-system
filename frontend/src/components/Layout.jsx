import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebarr";

function Layout({ onLogout }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main content */}
      <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;