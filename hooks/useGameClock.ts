'use client';

import { useEffect, useRef, useState } from 'react';
import { GAME_DURATION_SECONDS } from '@/components/game/constants';

interface UseGameClockProps {
  disabled: boolean;
  duration?: number;
  onTimeElapsed: () => void;
}

export function useGameClock({
  disabled,
  duration = GAME_DURATION_SECONDS,
  onTimeElapsed,
}: UseGameClockProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const onTimeElapsedRef = useRef(onTimeElapsed);

  useEffect(() => {
    onTimeElapsedRef.current = onTimeElapsed;
  }, [onTimeElapsed]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      let shouldAwardScore = false;
      let shouldFinishGame = false;

      setTimeLeft((currentTimeLeft) => {
        if (currentTimeLeft <= 0) {
          return 0;
        }

        shouldAwardScore = true;

        const nextTimeLeft = Math.max(currentTimeLeft - 1, 0);
        shouldFinishGame = nextTimeLeft === 0;

        return nextTimeLeft;
      });

      if (shouldAwardScore) {
        setScore((currentScore) => currentScore + 10);
      }

      if (shouldFinishGame) {
        onTimeElapsedRef.current();
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [disabled]);

  return {
    score,
    timeLeft,
  };
}
