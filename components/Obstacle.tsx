'use client';
import { useSpring, animated } from 'react-spring';

interface ObstacleProps {
  id: number;
  setRef: (el: HTMLDivElement | null, id: number) => void;
  top: string;
  delay: number;
}

export default function Obstacle({ id, setRef, top, delay }: ObstacleProps) {
  // Animación de movimiento horizontal usando react-spring
  const styles = useSpring({
    from: { left: '0%' },
    to: { left: '80%' },
    loop: { reverse: true },
    config: { duration: 2500 },
    delay: delay,
  });

  return (
    <animated.div
      ref={(el) => setRef(el, id)}
      className="absolute w-16 h-16 bg-zinc-800 rounded-lg border-t-4 border-zinc-600 shadow-[0_15px_0_#000,0_20px_20px_rgba(0,0,0,0.5)] z-40"
      style={{ top, ...styles }}
    />
  );
}