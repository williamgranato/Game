'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export default function ThemeFrame({children}:{children:React.ReactNode}){
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-stone-900 to-black text-zinc-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.header
          className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-amber-900/30 via-rose-900/20 to-emerald-900/20 p-4 mb-6 shadow-xl"
          initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} transition={{duration:0.4}}
        >
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" width={48} height={48} alt="Logo" className="rounded-md border border-zinc-700"/>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide">Aldoria Guilds</h1>
              <p className="text-zinc-300/80 text-sm">Fantasia sombria inspirada em Mushoku Tensei, Gladiatus, Melvor e The Witcher.</p>
            </div>
          </div>
        </motion.header>
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
