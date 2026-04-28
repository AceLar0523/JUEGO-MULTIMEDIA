'use client';
import React from 'react';
import Moveable from 'react-moveable';

interface VIPBoxProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  isInvulnerable: boolean;
}

export default function VIPBox({ targetRef, isInvulnerable }: VIPBoxProps) {
  return (
    <>
      <div
        ref={targetRef}
        className={`absolute w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white z-50 border-t-4 border-white/40 transition-all duration-300 ${
          isInvulnerable 
            ? 'bg-red-500 shadow-[0_10px_0_#7f1d1d] scale-110' 
            : 'bg-blue-600 shadow-[0_15px_0_#1e3a8a,0_25px_20px_rgba(0,0,0,0.4)]'
        }`}
        style={{ left: '50%', top: '80%', cursor: 'grab' }}
      >
        VIP
      </div>
      <Moveable
        target={targetRef}
        draggable={true}
        onDrag={(e) => {
          // Solución de la pista rápida del documento
          e.target.style.left = `${e.left}px`;
          e.target.style.top = `${e.top}px`;
        }}
      />
    </>
  );
}