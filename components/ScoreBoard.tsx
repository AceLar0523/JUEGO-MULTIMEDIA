'use client';

interface ScoreBoardProps {
    score: number;
    timeLeft: number;
    lives: number;
}

export default function ScoreBoard({ score, timeLeft, lives }: ScoreBoardProps) {
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
                <div className="flex gap-2 mt-2 h-[48px] items-center">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`text-4xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${i < lives
                                    ? 'text-red-500 drop-shadow-[0_10px_0_#7f1d1d] scale-100'
                                    : 'text-zinc-300 dark:text-zinc-700 drop-shadow-none scale-75 opacity-50 grayscale'
                                }`}
                        >
                            ❤️
                        </div>
                    ))}
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