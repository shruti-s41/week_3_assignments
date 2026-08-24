import { useEffect, useState } from "react";

function Pomodoro() {
  const [phase, setPhase] = useState("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    console.log("pomodoro interval started");

    const intervalId = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        if (phase === "focus") {
          setPhase("break");
          return 5 * 60;
        }

        setPhase("focus");
        setCycles((prevCycles) => prevCycles + 1);

        return 25 * 60;
      });
    }, 1000);

    return () => {
      console.log("pomodoro interval cleared");
      clearInterval(intervalId);
    };
  }, [isRunning, phase]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase("focus");
    setRemaining(25 * 60);
    setCycles(0);
  };

  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, totalSeconds);

    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="timer-card">
      <h2>Pomodoro</h2>

      <p className="phase">
        {phase === "focus" ? "Focus Time" : "Break Time"}
      </p>

      <div className="time-display">{formatTime(remaining)}</div>

      <p className="cycle-count">Completed cycles: {cycles}</p>

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

export default Pomodoro;