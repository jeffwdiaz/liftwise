import React, { useState, useEffect } from 'react';

interface WorkoutTimerProps {
  duration: number; // in minutes
  onComplete?: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && onComplete) {
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
      <button
        onClick={toggleTimer}
        className="px-4 py-2 bg-swiss-red text-white rounded-md hover:bg-swiss-red/90 transition-colors"
      >
        {isActive ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};

export default WorkoutTimer; 