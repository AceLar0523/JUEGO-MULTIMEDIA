'use client';
import { useState, useEffect, useRef } from 'react';
import ScoreBoard from './ScoreBoard';
import VIPBox from './VIPBox';
import Obstacle from './Obstacle';

export default function GameBoard() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'time' | 'lives' | null>(null);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  
  const vipRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<(HTMLDivElement | null)[]>([]);

  const setObstacleRef = (el: HTMLDivElement | null, index: number) => {
    obstaclesRef.current[index] = el;
  };

  // Temporizador y control de tiempo
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isGameOver) {
      setIsGameOver(true);
      setGameOverReason('time');
    }
  }, [timeLeft, isGameOver]);

  // Aumento de puntuación por sobrevivir (1 punto cada segundo)
  useEffect(() => {
    if (!isGameOver && timeLeft > 0) {
      const scoreTimer = setTimeout(() => setScore(s => s + 10), 1000);
      return () => clearTimeout(scoreTimer);
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

      const vipRect = vipRef.current.getBoundingClientRect();

      for (let i = 0; i < obstaclesRef.current.length; i++) {
        const obs = obstaclesRef.current[i];
        if (obs) {
          const obsRect = obs.getBoundingClientRect();
          
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
    setIsInvulnerable(true);
    
    setLives((prevLives) => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        setIsGameOver(true);
        setGameOverReason('lives');
      }
      return newLives;
    });
    
    // Invulnerabilidad post-colisión con efecto visual
    setTimeout(() => {
      setIsInvulnerable(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto h-screen p-8">
      <ScoreBoard score={score} timeLeft={timeLeft} lives={lives} />
      
      <div className="relative flex-1 w-full bg-zinc-100 dark:bg-zinc-900/50 rounded-3xl overflow-hidden border-4 border-dashed border-zinc-300 dark:border-zinc-800 shadow-inner perspective-1000">
        {isGameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 backdrop-blur-sm">
            <h1 className="text-6xl font-black text-white mb-2 drop-shadow-[0_10px_0_rgba(255,255,255,0.2)]">
              {gameOverReason === 'lives' ? '¡ELIMINADO!' : '¡TIEMPO!'}
            </h1>
            <p className="text-xl text-zinc-400 mb-8 font-medium">
              {gameOverReason === 'lives' ? 'Te has quedado sin vidas.' : 'Has sobrevivido la misión.'}
            </p>
            <div className="bg-white/10 p-8 rounded-3xl border border-white/20 mb-8 transform hover:scale-105 transition-transform">
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest text-center mb-2">Puntuación Final</p>
              <p className="text-7xl text-blue-400 font-black text-center">{score}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-5 bg-white text-black rounded-full font-black text-xl hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 active:scale-95"
            >
              Jugar de nuevo
            </button>
          </div>
        ) : (
          <>
            <VIPBox targetRef={vipRef} isInvulnerable={isInvulnerable} />
            <Obstacle id={0} setRef={setObstacleRef} top="15%" delay={0} />
            <Obstacle id={1} setRef={setObstacleRef} top="40%" delay={700} />
            <Obstacle id={2} setRef={setObstacleRef} top="65%" delay={1200} />
            <Obstacle id={3} setRef={setObstacleRef} top="85%" delay={400} /> {/* Un obstáculo extra para mayor dificultad */}
          </>
        )}
      </div>
    </div>
  );
}