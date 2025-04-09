import { useState, useEffect, useRef } from "react";

// Tipos
export interface AnimationRef {
  timeoutId: number | null;
  animationFrameId: number | null;
  currentIndex: number;
  currentCharIndex: number;
  targetText: string;
  lastTimestamp: number;
  isAnimating: boolean;
}

// Datos
export const phrases = [
  "developer from Ecuador.",
  "I love to code, learn, and share what I build,",
  "Let's create something great together."
];

// Hook personalizado para la animación de texto
export function useTextAnimation() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(document.visibilityState === "visible");
  const animationRef = useRef<AnimationRef>({
    timeoutId: null,
    animationFrameId: null,
    currentIndex: 0,
    currentCharIndex: 0,
    targetText: "",
    lastTimestamp: 0,
    isAnimating: false
  });

  // Función optimizada para escribir texto usando requestAnimationFrame
  const writer = (textToWrite: string) => {
    // Limpiar cualquier animación previa
    if (animationRef.current.animationFrameId) {
      cancelAnimationFrame(animationRef.current.animationFrameId);
      animationRef.current.animationFrameId = null;
    }
    
    // Actualizar el estado de la animación
    animationRef.current.targetText = textToWrite;
    animationRef.current.currentCharIndex = 0;
    animationRef.current.lastTimestamp = 0;
    animationRef.current.isAnimating = true;
    
    // Solo iniciar la animación si la página está activa
    if (isActive) {
      const animate = (timestamp: number) => {
        if (!animationRef.current.lastTimestamp) {
          animationRef.current.lastTimestamp = timestamp;
        }
        
        const elapsed = timestamp - animationRef.current.lastTimestamp;
        
        // Actualizar cada 80ms
        if (elapsed > 80) {
          animationRef.current.lastTimestamp = timestamp;
          animationRef.current.currentCharIndex++;
          const newIndex = animationRef.current.currentCharIndex;
          
          if (newIndex <= textToWrite.length) {
            setText(textToWrite.substring(0, newIndex));
            animationRef.current.animationFrameId = requestAnimationFrame(animate);
          } else {
            animationRef.current.animationFrameId = null;
            animationRef.current.isAnimating = false;
          }
        } else {
          animationRef.current.animationFrameId = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current.animationFrameId = requestAnimationFrame(animate);
    }
    
    // Devolver duración aproximada
    return (textToWrite.length * 80) + 500;
  };
  
  const startTextAnimation = (currentIndex = 0) => {
    // Guardar índice actual
    animationRef.current.currentIndex = currentIndex;
    
    // Solo proceder si la página está activa
    if (!isActive) return null;
    
    // Escribir frase actual
    const duration = writer(phrases[currentIndex]);
    
    // Calcular siguiente índice
    const nextIndex = (currentIndex + 1) % phrases.length;
    
    // Limpiar cualquier timeout anterior
    if (animationRef.current.timeoutId) {
      window.clearTimeout(animationRef.current.timeoutId);
      animationRef.current.timeoutId = null;
    }
    
    // Programar siguiente frase
    const timeoutId = window.setTimeout(() => {
      startTextAnimation(nextIndex);
    }, duration + 1000);
    
    animationRef.current.timeoutId = timeoutId;
    return timeoutId;
  };

  // Manejar cambios de visibilidad
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isDocumentVisible = document.visibilityState === "visible";
      setIsActive(isDocumentVisible);
    };
    
    // Registrar evento de cambio de visibilidad
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Limpieza al desmontar
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  // Efecto para manejar la animación basado en el estado de visibilidad
  useEffect(() => {
    if (isActive) {
      // Si la página está activa y no hay animación en curso, iniciar o reanudar
      if (!animationRef.current.isAnimating) {
        // Limpiar cualquier animación pendiente
        if (animationRef.current.timeoutId) {
          window.clearTimeout(animationRef.current.timeoutId);
          animationRef.current.timeoutId = null;
        }
        if (animationRef.current.animationFrameId) {
          cancelAnimationFrame(animationRef.current.animationFrameId);
          animationRef.current.animationFrameId = null;
        }
        
        // Reanudar la animación desde el último índice conocido
        startTextAnimation(animationRef.current.currentIndex);
      }
    } else {
      // Si la página no está activa, detener todas las animaciones
      if (animationRef.current.timeoutId) {
        window.clearTimeout(animationRef.current.timeoutId);
        animationRef.current.timeoutId = null;
      }
      if (animationRef.current.animationFrameId) {
        cancelAnimationFrame(animationRef.current.animationFrameId);
        animationRef.current.animationFrameId = null;
      }
      animationRef.current.isAnimating = false;
    }
    
    // Limpieza al desmontar o cuando cambia isActive
    return () => {
      if (animationRef.current.timeoutId) {
        window.clearTimeout(animationRef.current.timeoutId);
        animationRef.current.timeoutId = null;
      }
      if (animationRef.current.animationFrameId) {
        cancelAnimationFrame(animationRef.current.animationFrameId);
        animationRef.current.animationFrameId = null;
      }
    };
  }, [isActive]);
  
  // Diferir la inicialización de la animación hasta después del renderizado inicial
  useEffect(() => {
    // Usar setTimeout para diferir la inicialización no crítica
    const initAnimationId = window.setTimeout(() => {
      if (isActive) {
        startTextAnimation(0);
      }
    }, 0);
    
    return () => {
      window.clearTimeout(initAnimationId);
    };
  }, []);

  return { text };
}
