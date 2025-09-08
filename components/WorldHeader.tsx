'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export default function WorldHeader(){
  const [message,setMessage] = useState('');
  const messages = [
    '🍺 O taverneiro esqueceu de diluir a cerveja… 90% de álcool confirmado.',
    '🐔 Galinha lendária foi vista atravessando a estrada. Motivo: desconhecido.',
    '⚔️ Aventureiro nível 1 tentou enfrentar um dragão… restam apenas suas botas.',
    '💰 Impostos da guilda aumentaram em 1% para financiar o churrasco anual.',
    '🐀 Guilda oferece recompensa dobrada por ratos gigantes esta semana.',
    '🎲 A sorte sorriu para alguns… e cuspiu na cara de outros.'
  ];

  // Dia do ano e estação
  const now = new Date();
  const start = new Date(now.getFullYear(),0,0);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const seasonNames = ['🌸 Primavera','☀️ Verão','🍂 Outono','❄️ Inverno'];
  const seasonIdx = Math.floor(((now.getMonth()+1) % 12) / 3);
  const season = seasonNames[seasonIdx];

  // Clima e temperatura pseudo-realista
  const climates = ['Ensolarado','Chuvoso','Nublado','Tempestuoso'];
  const [climate,setClimate] = useState(climates[Math.floor(Math.random()*climates.length)]);
  let tempRange = [15,25];
  if(seasonIdx===0) tempRange=[15,22]; // primavera
  if(seasonIdx===1) tempRange=[25,35]; // verao
  if(seasonIdx===2) tempRange=[10,20]; // outono
  if(seasonIdx===3) tempRange=[-2,10];  // inverno

  // Ajuste pela condição climática
  if(climate==='Chuvoso') tempRange=[tempRange[0]-2, tempRange[1]-3];
  if(climate==='Nublado') tempRange=[tempRange[0]-1, tempRange[1]-1];
  if(climate==='Tempestuoso') tempRange=[tempRange[0]-5, tempRange[1]-2];

  const [temp,setTemp] = useState(Math.floor(Math.random()*(tempRange[1]-tempRange[0])+tempRange[0]));

  // Mensagens com fade
  useEffect(()=>{
    function pickMessage(){
      const msg = messages[Math.floor(Math.random()*messages.length)];
      setMessage(msg);
    }
    pickMessage();
    const id = setInterval(pickMessage, 60000);
    return ()=>clearInterval(id);
  },[]);

  return (
    <header className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-amber-900/30 via-rose-900/20 to-emerald-900/20 p-4 mb-6 shadow-xl flex items-center justify-between">
      {/* Logo clicável */}
      <Link href="/">
        <Image src="/images/logo.png" width={48} height={48} alt="Logo" className="rounded-md border border-zinc-700 cursor-pointer hover:scale-105 transition"/>
      </Link>

      {/* Painel do mundo */}
      <div className="flex flex-col text-sm text-right gap-0.5">
        <span className="opacity-90">📅 Dia {day} · {season}</span>
        <span className="opacity-90">☁️ {climate} · 🌡️ {temp}°C</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.6 }}
            className="opacity-80"
          >
            {message}
          </motion.span>
        </AnimatePresence>
      </div>
    </header>
  );
}
