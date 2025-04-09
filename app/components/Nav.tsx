"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  // Detectar scroll para cambiar estilo
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Proyectos", path: "/proyectos" },
    { name: "Sobre mí", path: "/sobre-mi" },
    { name: "Skills", path: "/skills" },
    { name: "Contacto", path: "/contacto" }
  ];
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <ul className="flex space-x-1 md:space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <li key={item.path} className="relative group">
                  <Link 
                    href={item.path}
                    className={`px-3 py-2 text-sm md:text-base relative transition-all duration-300 ${
                      isActive 
                        ? 'text-[#00a3c0] font-medium' 
                        : 'text-white hover:text-[#00a3c0]'
                    }`}
                  >
                    {item.name}
                    
                    {/* Línea de subrayado animada */}
                    <span 
                      className={`absolute bottom-0 left-0 w-0 h-0.5 bg-[#00a3c0] transition-all duration-300 group-hover:w-full ${
                        isActive ? 'w-full' : ''
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
