'use client';

interface ScoreBoardProps {
    score: number;
    timeLeft: number;
    lives: number;
    maxLives: number;
}

export default function ScoreBoard({ score, timeLeft, lives, maxLives }: ScoreBoardProps) {
    const livesPercentage = (lives / maxLives) * 100;

    return (
        <div className="flex gap-4 mb-6 w-full max-w-3xl">
            {/* Bloque de Puntuación */}
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform transition-transform hover:-translate-y-1">
                <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Puntuación</h2>
                <p className="text-5xl font-black text-zinc-900 dark:text-white mt-2">{score}</p>
            </div>

            {/* Bloque de Vidas */}
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform transition-transform hover:-translate-y-1">
                <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Vidas</h2>
                <div className="mt-3 flex items-center gap-3">
                    <div className="text-4xl text-red-500 drop-shadow-[0_10px_0_#7f1d1d]">❤️</div>
                    <div>
                        <p className="text-4xl font-black text-zinc-900 dark:text-white leading-none">{lives}</p>
                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mt-1">de {maxLives}</p>
                    </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-300/60 dark:bg-zinc-800">
                    <div
                        className="h-full rounded-full bg-red-500 transition-[width] duration-300"
                        style={{ width: `${livesPercentage}%` }}
                    />
                </div>
            </div>

            {/* Bloque de Tiempo */}
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform transition-transform hover:-translate-y-1">
                <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Tiempo (s)</h2>
                <p className={`text-5xl font-black mt-2 transition-colors ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-zinc-900 dark:text-white'}`}>
                    {timeLeft}
                </p>
            </div>
        </div>
    );
}