'use client';
import { OBSTACLE_TRAVEL_DISTANCE, OBSTACLE_TRAVEL_DURATION_MS } from '@/components/game/constants';

interface ObstacleProps {
  id: number;
  setRef: (el: HTMLDivElement | null, id: number) => void;
  top: string;
  delay: number;
}

export default function Obstacle({ id, setRef, top, delay }: ObstacleProps) {
  return (
    <div
      ref={(el) => setRef(el, id)}
      className="obstacle-runner absolute left-0 h-16 w-16 rounded-lg border-t-4 border-zinc-600 bg-zinc-800 shadow-[0_15px_0_#000,0_20px_20px_rgba(0,0,0,0.5)] z-40"
      style={{
        top,
        animationDelay: `${delay}ms`,
        animationDuration: `${OBSTACLE_TRAVEL_DURATION_MS}ms`,
        willChange: 'left',
        ['--obstacle-travel-distance' as string]: OBSTACLE_TRAVEL_DISTANCE,
      }}
    />
  );
}