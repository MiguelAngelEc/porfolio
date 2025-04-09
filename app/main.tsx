"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Main() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const animationRef = useRef<{
    timeoutId: number | null;
    animationFrameId: number | null;
    currentIndex: number;
    currentCharIndex: number;
    targetText: string;
    lastTimestamp: number;
  }>({
    timeoutId: null,
    animationFrameId: null,
    currentIndex: 0,
    currentCharIndex: 0,
    targetText: "",
    lastTimestamp: 0,
  });

  const phrases = [
    "developer from Ecuador.",
    "I love to code, learn, and share what I build,",
    "Let's create something great together."
  ];
  
  // Optimized text writing function using requestAnimationFrame
  const writer = (textToWrite: string) => {
    // Clear any previous animation
    if (animationRef.current.animationFrameId) {
      cancelAnimationFrame(animationRef.current.animationFrameId);
    }
    
    // Update animation state
    animationRef.current.targetText = textToWrite;
    animationRef.current.currentCharIndex = 0;
    animationRef.current.lastTimestamp = 0;
    
    // Only start animation if page is active
    if (isActive) {
      const animate = (timestamp: number) => {
        if (!animationRef.current.lastTimestamp) {
          animationRef.current.lastTimestamp = timestamp;
        }
        
        const elapsed = timestamp - animationRef.current.lastTimestamp;
        
        // Update every 80ms
        if (elapsed > 80) {
          animationRef.current.lastTimestamp = timestamp;
          animationRef.current.currentCharIndex++;
          const newIndex = animationRef.current.currentCharIndex;
          
          if (newIndex <= textToWrite.length) {
            setText(textToWrite.substring(0, newIndex));
            animationRef.current.animationFrameId = requestAnimationFrame(animate);
          } else {
            animationRef.current.animationFrameId = null;
          }
        } else {
          animationRef.current.animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current.animationFrameId = requestAnimationFrame(animate);
    }
    
    // Return approximate duration
    return (textToWrite.length * 80) + 500;
  };
  
  const startTextAnimation = (currentIndex = 0) => {
    // Save current index
    animationRef.current.currentIndex = currentIndex;
    
    // Only proceed if page is active
    if (!isActive) return null;
    
    // Write current phrase
    const duration = writer(phrases[currentIndex]);
    
    // Calculate next index
    const nextIndex = (currentIndex + 1) % phrases.length;
    
    // Clear any previous timeout
    if (animationRef.current.timeoutId) {
      window.clearTimeout(animationRef.current.timeoutId);
    }
    
    // Schedule next phrase
    const timeoutId = window.setTimeout(() => {
      startTextAnimation(nextIndex);
    }, duration + 1000);
    
    animationRef.current.timeoutId = timeoutId;
    return timeoutId;
  };
  
  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isDocumentVisible = document.visibilityState === "visible";
      setIsActive(isDocumentVisible);
      
      // If page becomes visible again, resume from where we left off
      if (isDocumentVisible) {
        // Clear any pending animations
        if (animationRef.current.timeoutId) {
          window.clearTimeout(animationRef.current.timeoutId);
        }
        if (animationRef.current.animationFrameId) {
          cancelAnimationFrame(animationRef.current.animationFrameId);
        }
        
        // Resume animation from last known index
        startTextAnimation(animationRef.current.currentIndex);
      }
    };
    
    // Register visibility change event
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      if (animationRef.current.timeoutId) {
        window.clearTimeout(animationRef.current.timeoutId);
      }
      if (animationRef.current.animationFrameId) {
        cancelAnimationFrame(animationRef.current.animationFrameId);
      }
    };
  }, [isActive]);
  
  // Defer animation initialization until after initial render
  useEffect(() => {
    // Use requestIdleCallback or setTimeout to defer non-critical initialization
    const initAnimationId = window.setTimeout(() => {
      startTextAnimation(0);
    }, 0);
    
    return () => {
      window.clearTimeout(initAnimationId);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-left">
      <h1 className="text-6xl font-bold mb-4">Hi, I'm Miguel Angel</h1>
      <p className="text-2xl min-h-[2rem] text-[#00a3c0] text-left">{text}</p>
    </div>
  );
}
