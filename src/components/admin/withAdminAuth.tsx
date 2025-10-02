"use client";
import { useState, useEffect } from 'react';
import LoginScreen from '../../app/admin/LoginScreen'; // Sẽ tạo file này ngay sau đây

// Đây là một Higher-Order Component (HOC)
export default function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = sessionStorage.getItem('admin-auth-token');
      if (token === 'secret-admin-token') {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }, []);

    const handleLogin = () => {
      setIsAuthenticated(true);
    };

    if (loading) {
      return <div className="w-screen h-screen bg-gray-900 text-white flex items-center justify-center">Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      return <LoginScreen onLoginSuccess={handleLogin} />;
    }

    return <Component {...props} />;
  };
}