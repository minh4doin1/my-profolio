"use client";
import { useState } from 'react';

type LoginScreenProps = {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem('admin-auth-token', data.token);
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
        <div className="space-y-4">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full p-3 bg-gray-700 text-white rounded" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 bg-gray-700 text-white rounded" required />
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <button type="submit" disabled={loading} className="w-full mt-6 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}