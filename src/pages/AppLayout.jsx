import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const PAGE_TITLES = {
  '/': 'Dashboard Overview',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/help': 'Help Center',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          pageTitle={pageTitle}
        />

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
