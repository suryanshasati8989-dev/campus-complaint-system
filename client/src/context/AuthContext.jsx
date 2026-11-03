import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_CREDENTIALS = {
  email: 'admin@college.edu',
  password: 'admin123'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campuspulse_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to admin user for seamless demo evaluation, or null if logged out
    return {
      name: 'Dr. S. K. Raman',
      role: 'Chief Campus Administrator',
      email: DEMO_CREDENTIALS.email,
      department: 'Estate & Campus Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  });

  const isAuthenticated = !!user;

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (
      (trimmedEmail === DEMO_CREDENTIALS.email.toLowerCase() || trimmedEmail === 'admin@campus.edu') &&
      password === DEMO_CREDENTIALS.password
    ) {
      const newUser = {
        name: 'Dr. S. K. Raman',
        role: 'Chief Campus Administrator',
        email: DEMO_CREDENTIALS.email,
        department: 'Estate & Campus Operations',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      setUser(newUser);
      localStorage.setItem('campuspulse_auth', JSON.stringify(newUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Please use demo credentials.' };
  };

  const loginAsStudent = (name = 'Kavya Verma', dept = 'Computer Science') => {
    const studentUser = {
      name,
      role: 'Student Representative',
      email: 'student@college.edu',
      department: dept,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    setUser(studentUser);
    localStorage.setItem('campuspulse_auth', JSON.stringify(studentUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campuspulse_auth');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      loginAsStudent,
      logout,
      demoCredentials: DEMO_CREDENTIALS
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
