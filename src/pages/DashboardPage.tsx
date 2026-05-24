import { Outlet, NavLink } from 'react-router-dom';

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div>
      {/* --- MASTER HEADER --- */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        
        <div className="text-2xl font-bold text-blue-600">
        CDAS
        </div>

        
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? 'text-blue-600' : 'hover:text-blue-600 transition'
            }
          >
            Create Document
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              isActive ? 'text-blue-600' : 'hover:text-blue-600 transition'
            }
          >
            Settings
          </NavLink>
          <button type="button" onClick={onLogout} className="hover:text-blue-600 transition">
            Logout
          </button>
        </nav>
      </header>
      <main>
        <Outlet context={{ onLogout }} />
      </main>
    </div>
  );
}