import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics' },
];

const systemItems = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', label: 'Help Center', icon: HelpCircle, path: '/help' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">AG</div>
          <div>
            <h1>Anti-Gravity</h1>
            <div className="logo-subtitle">Finance Hub</div>
          </div>
          {/* Close button on mobile */}
          <button
            className="burger-btn"
            onClick={onClose}
            style={{ marginLeft: 'auto' }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              id={`nav-${item.id}`}
              onClick={() => handleNav(item.path)}
            >
              <item.icon size={18} className="nav-icon" />
              {item.label}
            </button>
          ))}

          <div className="nav-section-label">System</div>
          {systemItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              id={`nav-${item.id}`}
              onClick={() => handleNav(item.path)}
            >
              <item.icon size={18} className="nav-icon" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="nav-item" id="nav-logout" onClick={handleLogout}>
            <LogOut size={18} className="nav-icon" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
