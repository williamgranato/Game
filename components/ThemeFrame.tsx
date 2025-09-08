'use client';
import { motion } from 'framer-motion';
import WorldHeader from './WorldHeader';
import Image from 'next/image';
import React from 'react';

export default function ThemeFrame({children}:{children:React.ReactNode}){
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-stone-900 to-black text-zinc-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
              <WorldHeader/>

        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-4">{children}</div>
          <aside className="md:col-span-1 space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-3 text-sm">
              <p className="opacity-70">Dica: Envie missões ociosas e volte mais tarde para colher recompensas.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-3 text-sm">
              <p className="opacity-70">Skins de armadura lendária estão na forja da guilda.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
