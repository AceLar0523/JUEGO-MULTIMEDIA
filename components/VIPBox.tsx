'use client';
import React, { type PointerEvent } from 'react';

interface VIPBoxProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  isInvulnerable: boolean;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
}

export default function VIPBox({ targetRef, isInvulnerable, onPointerDown }: VIPBoxProps) {
  return (
    <div
      ref={targetRef}
      onPointerDown={onPointerDown}
      className={`absolute left-0 top-0 flex h-20 w-20 select-none items-center justify-center rounded-2xl border-t-4 border-white/40 font-black text-2xl text-white z-50 will-change-transform ${
        isInvulnerable
          ? 'bg-red-500 shadow-[0_10px_0_#7f1d1d] scale-110 transition-transform duration-150'
          : 'bg-blue-600 shadow-[0_15px_0_#1e3a8a,0_25px_20px_rgba(0,0,0,0.4)]'
      }`}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      VIP
    </div>
  );
}