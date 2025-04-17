import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !employeeId || !password || !confirmPassword) {
      return setError('All fields are required');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, employeeId, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.error || 'Signup failed');
      }

      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Employee Signup</h2>

        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Employee ID</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="E123"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary hover:bg-blue-600 transition-colors rounded text-white font-medium"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account? <a href="/login" className="text-primary underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
