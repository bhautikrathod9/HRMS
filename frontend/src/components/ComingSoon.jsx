import React from 'react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-500">🚧 Coming Soon</h1>
        <p className="text-lg md:text-xl text-gray-300">
          Under construction. We'll be live soon!
        </p>
        <div className="animate-pulse text-blue-400 text-sm">Stay tuned...</div>
      </div>
    </div>
  );
};

export default ComingSoon;
