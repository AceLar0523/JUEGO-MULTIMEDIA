'use client';

interface ScoreBoardProps {
  score: number;
  timeLeft: number;
}

export default function ScoreBoard({ score, timeLeft }: ScoreBoardProps) {
  return (
    <div className="flex gap-4 mb-6 w-full max-w-2xl">
      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Puntuación</h2>
        <p className="text-5xl font-black text-zinc-900 dark:text-white mt-2">{score}</p>
      </div>
      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Tiempo (s)</h2>
        <p className={`text-5xl font-black mt-2 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-zinc-900 dark:text-white'}`}>
          {timeLeft}
        </p>
      </div>
    </div>
  );
}