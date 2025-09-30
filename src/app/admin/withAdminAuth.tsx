"use client";
import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';

// Đây là một Higher-Order Component (HOC)
export default function withAdminAuth(Component: React.ComponentType) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function AuthenticatedComponent(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Kiểm tra "vé thông hành" trong sessionStorage
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