import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to Employee Dashboard 🎉</h1>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        className="text-red-400 mt-6"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
