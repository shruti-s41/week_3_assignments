import { useEffect, useState } from "react";

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    console.log("stopwatch interval started");

    const intervalId = setInterval(() => {
      setElapsed((prev) => prev + 10);
    }, 10);

    return () => {
      console.log("stopwatch interval cleared");
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
  };

  return (
    <div className="timer-card">
      <h2>Stopwatch</h2>

      <div className="time-display">{formatTime(elapsed)}</div>

      <div className="controls">
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>

        <button onClick={handlePause} disabled={!isRunning}>
          Pause
        </button>

        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default Stopwatch;