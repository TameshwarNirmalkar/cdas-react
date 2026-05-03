import { Outlet, Link } from 'react-router-dom';

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div>
      {/* --- MASTER HEADER --- */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        
        <div className="text-2xl font-bold text-blue-600">
        CDAS
        </div>

        
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to="/dashboard" className="hover:text-blue-600 transition">Create Document</Link>
          <Link to="/dashboard/settings" className="hover:text-blue-600 transition">Settings</Link>
          <button onClick={onLogout} className="hover:text-blue-600 transition">Logout</button>
        </nav>        
      </header>
      {/* --- PAGE CONTENT (This changes based on the route) --- */}
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}