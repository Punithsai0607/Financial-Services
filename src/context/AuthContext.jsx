import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

// Mock user accounts
const MOCK_USERS = [
  { email: 'admin@zorvyn.com', password: 'admin123', name: 'Punit Kumar', initials: 'PK', role: 'Admin' },
  { email: 'viewer@zorvyn.com', password: 'viewer123', name: 'Jane Smith', initials: 'JS', role: 'Viewer' },
  { email: 'demo@zorvyn.com', password: 'demo123', name: 'Demo User', initials: 'DU', role: 'Admin' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ag_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const userData = { email: found.email, name: found.name, initials: found.initials, role: found.role };
      setUser(userData);
      localStorage.setItem('ag_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ag_user');
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
