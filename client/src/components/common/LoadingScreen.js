import React from 'react';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="jeevo-loader bg-red-700">
      <div className="jeevo-loader-inner">
        <div className="jeevo-logo text-white" aria-label="Jeevo">
          JEEVO
        </div>

        <span className="sr-only " aria-live="polite">
          {message}
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
