import { useEffect, useState } from "react";

function Timer() {
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) {
      return;
    }

    console.log("countdown interval started");

    const intervalId = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setHasFinished(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log("countdown interval cleared");
      clearInterval(intervalId);
    };
  }, [isRunning, remaining]);

  const handleStart = () => {
    if (isRunning) {
      return;
    }

    if (remaining === 0) {
      const minuteValue = Math.max(0, Number(minutes) || 0);
      const secondValue = Math.min(
        59,
        Math.max(0, Number(seconds) || 0)
      );

      const totalSeconds = minuteValue * 60 + secondValue;

      if (totalSeconds === 0) {
        return;
      }

      setRemaining(totalSeconds);
    }

    setHasFinished(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(0);
    setHasFinished(false);
  };

  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, totalSeconds);

    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="timer-card">
      <h2>Countdown Timer</h2>

      <div className="inputs">
        <label>
          Minutes
          <input
            type="number"
            min="0"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            disabled={isRunning}
          />
        </label>

        <label>
          Seconds
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            disabled={isRunning}
          />
        </label>
      </div>

      <div className="time-display">{formatTime(remaining)}</div>

      {hasFinished && (
        <p className="finished-message">Time&apos;s up!</p>
      )}

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

export default Timer;