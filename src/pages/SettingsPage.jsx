import { useState } from 'react';
import {
  User, Bell, Shield, Palette, Globe, Save, Check,
  Moon, Sun, CreditCard, Eye, EyeOff, Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { userRole } = useTransactions();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Punit Kumar',
    email: user?.email || 'admin@zorvyn.com',
    phone: '+91 98765 43210',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactions: true,
    budget: false,
    weekly: true,
    marketing: false,
  });
  const [theme, setTheme] = useState('dark');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Personal Information</h3>
              <p>Update your personal details and preferences</p>
            </div>
            <div className="settings-form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="settings-name">Full Name</label>
                <input
                  id="settings-name"
                  className="form-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="settings-email">Email</label>
                <input
                  id="settings-email"
                  className="form-input"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="settings-phone">Phone Number</label>
                <input
                  id="settings-phone"
                  className="form-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="settings-timezone">Timezone</label>
                <select
                  id="settings-timezone"
                  className="form-select"
                  value={profileForm.timezone}
                  onChange={(e) => setProfileForm((f) => ({ ...f, timezone: e.target.value }))}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="settings-currency">Default Currency</label>
                <select
                  id="settings-currency"
                  className="form-select"
                  value={profileForm.currency}
                  onChange={(e) => setProfileForm((f) => ({ ...f, currency: e.target.value }))}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <div className="settings-role-display glass-card">
              <Shield size={18} style={{ color: 'var(--accent-purple)' }} />
              <div>
                <div className="settings-role-label">Current Role</div>
                <div className="settings-role-value">{userRole}</div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Notification Preferences</h3>
              <p>Choose how you want to be notified</p>
            </div>
            <div className="settings-toggle-list">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'transactions', label: 'Transaction Alerts', desc: 'Get notified on every transaction' },
                { key: 'budget', label: 'Budget Warnings', desc: 'Alert when nearing budget limits' },
                { key: 'weekly', label: 'Weekly Summary', desc: 'Receive a weekly financial summary' },
                { key: 'marketing', label: 'Product Updates', desc: 'News and feature announcements' },
              ].map((item) => (
                <div key={item.key} className="settings-toggle-item glass-card">
                  <div>
                    <div className="settings-toggle-label">{item.label}</div>
                    <div className="settings-toggle-desc">{item.desc}</div>
                  </div>
                  <button
                    className={`toggle-switch ${notifications[item.key] ? 'active' : ''}`}
                    onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
                    id={`toggle-${item.key}`}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <div className="toggle-knob" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Security Settings</h3>
              <p>Manage your account security</p>
            </div>
            <div className="settings-security-cards">
              <div className="glass-card settings-security-card">
                <div className="settings-security-icon">
                  <Lock size={20} />
                </div>
                <div>
                  <h4>Change Password</h4>
                  <p>Update your password regularly to keep your account secure</p>
                </div>
                <button className="btn-outline" id="change-password-btn">Change</button>
              </div>
              <div className="glass-card settings-security-card">
                <div className="settings-security-icon">
                  <Shield size={20} />
                </div>
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="btn-outline" id="enable-2fa-btn">Enable</button>
              </div>
              <div className="glass-card settings-security-card">
                <div className="settings-security-icon" style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--crimson-400)' }}>
                  <Eye size={20} />
                </div>
                <div>
                  <h4>Active Sessions</h4>
                  <p>View and manage your active sessions</p>
                </div>
                <button className="btn-outline" id="view-sessions-btn">View</button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Appearance</h3>
              <p>Customize how Anti-Gravity looks</p>
            </div>
            <div className="settings-theme-grid">
              <button
                className={`settings-theme-card glass-card ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                id="theme-dark-btn"
              >
                <Moon size={24} />
                <span>Dark Mode</span>
                {theme === 'dark' && <Check size={16} className="theme-check" />}
              </button>
              <button
                className={`settings-theme-card glass-card ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                id="theme-light-btn"
              >
                <Sun size={24} />
                <span>Light Mode</span>
                {theme === 'light' && <Check size={16} className="theme-check" />}
              </button>
              <button
                className={`settings-theme-card glass-card ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
                id="theme-system-btn"
              >
                <Globe size={24} />
                <span>System</span>
                {theme === 'system' && <Check size={16} className="theme-check" />}
              </button>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="settings-section">
            <div className="settings-section-header">
              <h3>Billing & Plan</h3>
              <p>Manage your subscription and payment methods</p>
            </div>
            <div className="glass-card settings-plan-card">
              <div className="settings-plan-badge">PRO</div>
              <div>
                <h4>Anti-Gravity Pro</h4>
                <p style={{ color: 'var(--slate-400)', fontSize: 13 }}>
                  Unlimited transactions, advanced analytics, priority support
                </p>
              </div>
              <div className="settings-plan-price">
                <span className="settings-plan-amount">$19</span>
                <span className="settings-plan-period">/month</span>
              </div>
            </div>
            <div className="settings-billing-info glass-card">
              <div className="settings-billing-row">
                <span>Next billing date</span>
                <span style={{ color: 'var(--slate-200)' }}>May 1, 2026</span>
              </div>
              <div className="settings-billing-row">
                <span>Payment method</span>
                <span style={{ color: 'var(--slate-200)' }}>•••• •••• •••• 4242</span>
              </div>
              <div className="settings-billing-row">
                <span>Billing email</span>
                <span style={{ color: 'var(--slate-200)' }}>{profileForm.email}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-content animate-fade-in-up" style={{ opacity: 0 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
        <button
          className={`add-btn ${saved ? 'saved-state' : ''}`}
          onClick={handleSave}
          id="save-settings-btn"
        >
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div className="settings-layout">
        {/* Settings Sidebar */}
        <div className="settings-tabs glass-card">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`settings-tab-${tab.id}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
