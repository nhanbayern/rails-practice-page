import { useState, useEffect } from 'react';
import { useQuizState } from './useQuizContext';

export function useQuizTimer(timeLimitSeconds: number, onTimeUp: () => void) {
  const { state, dispatch } = useQuizState();
  const [timeLeft, setTimeLeft] = useState(Math.max(0, timeLimitSeconds - state.timeSpent));

  useEffect(() => {
    if (state.isSubmitted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
      // Periodically sync time spent to state (every 5 seconds)
      if (timeLeft % 5 === 0) {
        dispatch({ type: 'SET_TIME_SPENT', time: timeLimitSeconds - timeLeft });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, state.isSubmitted, onTimeUp, dispatch, timeLimitSeconds]);

  return {
    timeLeft,
    timeSpent: timeLimitSeconds - timeLeft,
    isWarning: timeLeft < timeLimitSeconds * 0.2, // Last 20%
    isDanger: timeLeft < timeLimitSeconds * 0.05, // Last 5%
  };
}
