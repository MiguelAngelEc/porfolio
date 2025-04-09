"use client";

import React from "react";
import { useTextAnimation } from "../hooks/useTextAnimation";

export default function Main() {
  const { text } = useTextAnimation();
  
  return (
    <div className="flex flex-col items-left">
      <h1 className="text-6xl font-bold mb-4">Hi, I'm Miguel Angel</h1>
      <p className="text-2xl min-h-[2rem] text-[#00a3c0] text-left">{text}</p>
    </div>
  );
}
