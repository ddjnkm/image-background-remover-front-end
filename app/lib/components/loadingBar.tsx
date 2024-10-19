import React, { useState, useEffect } from 'react';

const LoadingBar: React.FC = (timeout) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 3000) {
          clearInterval(interval); // Stop once we reach 100%
          return 3000;
        }
        return oldProgress + 0.7; // Increment progress
      });
    }, 100); // Adjust the speed of progress here

    return () => {
      clearInterval(interval); // Cleanup when component unmounts
    };
  }, []);

  return (
    <div className="w-full h-4 border-2 border-stone-950 rounded-md">
      <div
        className="bg-blue-900 h-full"
        style={{ width: `${progress}%` }}
      ></div>
      <div>
        Processing image...
      </div>
    </div>
  );
};

export default LoadingBar;