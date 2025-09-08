'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const Main = dynamic(()=>import('../components/Main'), { ssr:false });

export default function Page(){
  return <Main/>;
}
