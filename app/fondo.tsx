"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const Fondo = () => {
    const ballRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const ball = ballRef.current;
        if (!ball) return;

        // Add overflow hidden to body to prevent scrollbars
        document.body.style.overflow = "hidden";

        const updateBoundaries = () => {
            // Subtract element width/height to keep fully within viewport
            const width = window.innerWidth - ball.width;
            const height = window.innerHeight - ball.height;
            return { width, height };
        };

        let { width, height } = updateBoundaries();

        // Ensure starting position is within boundaries
        let x = Math.min(Math.random() * width, width);
        let y = Math.min(Math.random() * height, height);
        let speedX = 4;
        let speedY = 4;

        // Handle window resize
        const handleResize = () => {
            const newBoundaries = updateBoundaries();
            width = newBoundaries.width;
            height = newBoundaries.height;
            
            // Keep ball in bounds after resize
            x = Math.min(x, width);
            y = Math.min(y, height);
        };

        window.addEventListener('resize', handleResize);

        const animate = () => {
            x += speedX;
            y += speedY;

            // Ensure the ball stays completely within the viewport
            if (x >= width || x <= 0) {
                speedX *= -1;
                // Keep ball within boundaries
                x = Math.max(0, Math.min(x, width));
            }
            
            if (y >= height || y <= 0) {
                speedY *= -1;
                // Keep ball within boundaries
                y = Math.max(0, Math.min(y, height));
            }

            ball.style.left = `${x}px`;
            ball.style.top = `${y}px`;

            requestAnimationFrame(animate);
        };

        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <Image
            ref={ballRef}
            src="/ImgFondo/javascript.png"
            alt="File icon"
            width={50}
            height={50}
            className="rounded-full absolute object-cover"
        />
    );
};

export default Fondo;