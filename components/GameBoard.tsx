'use client';
import { useState, useEffect, useRef } from 'react';
import ScoreBoard from './ScoreBoard';
import VIPBox from './VIPBox';
import Obstacle from './Obstacle';

export default function GameBoard() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  
  const vipRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<(HTMLDivElement | null)[]>([]);

  const setObstacleRef = (el: HTMLDivElement | null, index: number) => {
    obstaclesRef.current[index] = el;
  };

  // Temporizador de 30 segundos
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  // Game Loop para Detección de Colisiones
  useEffect(() => {
    let animationFrameId: number;

    const checkCollisions = () => {
      if (!vipRef.current || isGameOver || isInvulnerable) {
        animationFrameId = requestAnimationFrame(checkCollisions);
        return;
      }

      const vipRect = vipRef.current.getBoundingClientRect(); // Usando la pista del PDF

      for (let i = 0; i < obstaclesRef.current.length; i++) {
        const obs = obstaclesRef.current[i];
        if (obs) {
          const obsRect = obs.getBoundingClientRect();
          
          // Comparar los 4 lados
          if (
            vipRect.left < obsRect.right &&
            vipRect.right > obsRect.left &&
            vipRect.top < obsRect.bottom &&
            vipRect.bottom > obsRect.top
          ) {
            handleCollision();
            break;
          }
        }
      }
      animationFrameId = requestAnimationFrame(checkCollisions);
    };

    animationFrameId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isGameOver, isInvulnerable]);

  const handleCollision = () => {
    setScore((prev) => prev + 1);
    setIsInvulnerable(true);
    
    // Invulnerabilidad post-colisión
    setTimeout(() => {
      setIsInvulnerable(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-screen p-8">
      <ScoreBoard score={score} timeLeft={timeLeft} />
      
      <div className="relative flex-1 w-full bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl overflow-hidden border-4 border-dashed border-zinc-300 dark:border-zinc-800 shadow-inner">
        {isGameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50">
            <h1 className="text-6xl font-black text-white mb-4">¡TIEMPO!</h1>
            <p className="text-3xl text-blue-400 font-bold mb-8">Puntuación Final: {score}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform"
            >
              Jugar de nuevo
            </button>
          </div>
        ) : (
          <>
            <VIPBox targetRef={vipRef} isInvulnerable={isInvulnerable} />
            <Obstacle id={0} setRef={setObstacleRef} top="20%" delay={0} />
            <Obstacle id={1} setRef={setObstacleRef} top="40%" delay={500} />
            <Obstacle id={2} setRef={setObstacleRef} top="60%" delay={1000} />
          </>
        )}
      </div>
    </div>
  );
}