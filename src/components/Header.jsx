import { Menu, Bell } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ onToggleSidebar, pageTitle }) {
  const { userRole, setRole } = useTransactions();
  const { user } = useAuth();

  return (
    <header className="top-header">
      <div className="top-header-left">
        <button
          className="burger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          id="burger-menu-btn"
        >
          <Menu size={22} />
        </button>
        <h2>{pageTitle || 'Dashboard Overview'}</h2>
      </div>

      <div className="top-header-right">
        {/* Role Toggle */}
        <div className="role-toggle" id="role-toggle">
          <button
            className={`role-btn ${userRole === 'Admin' ? 'active' : ''}`}
            onClick={() => setRole('Admin')}
            id="role-admin-btn"
          >
            Admin
          </button>
          <button
            className={`role-btn ${userRole === 'Viewer' ? 'active' : ''}`}
            onClick={() => setRole('Viewer')}
            id="role-viewer-btn"
          >
            Viewer
          </button>
        </div>

        {/* Notifications */}
        <button className="notification-btn" id="notification-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {/* Avatar */}
        <div className="avatar" id="user-avatar">
          {user?.initials || 'PK'}
        </div>
      </div>
    </header>
  );
}
