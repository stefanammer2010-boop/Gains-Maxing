import { useEffect, useState } from "react";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hours,
    minutes,
    secs,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function WorkoutTimer({ startedAt }) {
  const [elapsed, setElapsed] = useState(
    Math.floor((Date.now() - startedAt) / 1000)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(
        Math.floor((Date.now() - startedAt) / 1000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt]);

  return (
    <div className="workout-timer">
      <span>TRAINING TIME</span>

      <strong>
        {formatTime(elapsed)}
      </strong>
    </div>
  );
}