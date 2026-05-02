import { Outlet, Link } from 'react-router-dom';

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* --- MASTER HEADER --- */}
      <header style={{ background: '#333', color: '#fff', padding: '1rem' }}>
        <nav>
          <Link to="/dashboard" style={{ color: 'white', marginRight: '15px' }}>Stats</Link>
          <Link to="/dashboard/settings" style={{ color: 'white', marginRight: '15px' }}>Settings</Link>
          <button onClick={onLogout}>Logout</button>
        </nav>
      </header>

      {/* --- PAGE CONTENT (This changes based on the route) --- */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> 
      </main>

      {/* --- MASTER FOOTER --- */}
      <footer style={{ background: '#eee', padding: '1rem', textAlign: 'center' }}>
        © 2024 Dashboard Inc.
      </footer>
    </div>
  );
}