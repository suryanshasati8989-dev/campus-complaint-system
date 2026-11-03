import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@college.edu',
  password: 'admin123'
};

export const DEMO_STUDENTS = [
  {
    name: 'Aarav Patel',
    studentId: 'CS-2024-042',
    department: 'Computer Science & Engineering',
    email: 'aarav.cs24@college.edu',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Kavya Verma',
    studentId: 'EC-2024-089',
    department: 'Electronics & Communication',
    email: 'kavya.ec24@college.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
];

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
    // Default to null so user arrives at the clean Sign-In page first,
    // or can 1-click select Student vs Admin!
    return null;
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.userType === 'admin';
  const isStudent = user?.userType === 'student';

  const loginAsAdmin = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (
      (trimmedEmail === DEMO_ADMIN_CREDENTIALS.email.toLowerCase() || trimmedEmail === 'admin@campus.edu') &&
      password === DEMO_ADMIN_CREDENTIALS.password
    ) {
      const adminUser = {
        name: 'Dr. S. K. Raman',
        role: 'Chief Campus Administrator',
        userType: 'admin',
        email: DEMO_ADMIN_CREDENTIALS.email,
        department: 'Estate & Campus Operations',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      setUser(adminUser);
      localStorage.setItem('campuspulse_auth', JSON.stringify(adminUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials. Use admin@college.edu / admin123' };
  };

  const loginAsStudent = ({
    name = 'Aarav Patel',
    studentId = 'CS-2024-042',
    department = 'Computer Science & Engineering',
    email = ''
  } = {}) => {
    const studentUser = {
      name: name.trim() || 'Aarav Patel',
      role: 'Student (Complainant)',
      userType: 'student',
      studentId: studentId.trim() || 'CS-2024-042',
      department: department.trim() || 'Computer Science & Engineering',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@college.edu`,
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
      isAdmin,
      isStudent,
      loginAsAdmin,
      loginAsStudent,
      logout,
      demoAdminCredentials: DEMO_ADMIN_CREDENTIALS,
      demoStudents: DEMO_STUDENTS
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
