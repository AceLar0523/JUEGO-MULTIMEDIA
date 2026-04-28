'use client';

import { useEffect, useRef, useState } from 'react';
import { INITIAL_LIVES, INVULNERABILITY_MS } from '@/components/game/constants';

interface UseLifeSystemProps {
  disabled: boolean;
  initialLives?: number;
  invulnerabilityMs?: number;
  onDepleted: () => void;
}

export function useLifeSystem({
  disabled,
  initialLives = INITIAL_LIVES,
  invulnerabilityMs = INVULNERABILITY_MS,
  onDepleted,
}: UseLifeSystemProps) {
  const [lives, setLives] = useState(initialLives);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const onDepletedRef = useRef(onDepleted);
  const livesRef = useRef(initialLives);
  const isInvulnerableRef = useRef(false);
  const depletedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    onDepletedRef.current = onDepleted;
  }, [onDepleted]);

  useEffect(() => () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const registerHit = () => {
    if (disabled || isInvulnerableRef.current || depletedRef.current) {
      return false;
    }

    isInvulnerableRef.current = true;
    setIsInvulnerable(true);

    const nextLives = Math.max(livesRef.current - 1, 0);
    livesRef.current = nextLives;
    setLives(nextLives);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      isInvulnerableRef.current = false;
      setIsInvulnerable(false);
      timeoutRef.current = null;
    }, invulnerabilityMs);

    if (nextLives === 0) {
      depletedRef.current = true;
      onDepletedRef.current();
    }

    return true;
  };

  return {
    isInvulnerable,
    lives,
    registerHit,
  };
}
