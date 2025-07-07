
import { useEffect, useRef } from 'react';

const CyberAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Free-floating particles across entire page
    const freeParticles = [];
    for (let i = 0; i < 25; i++) {
      freeParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        trail: []
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(8, 8, 8, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Draw free-floating particles
      freeParticles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += 0.03;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 6) {
          particle.trail.shift();
        }

        // Draw particle trail
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.strokeStyle = `rgba(220, 38, 38, ${particle.alpha * 0.2})`;
          ctx.lineWidth = particle.size * 0.3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.3;
        const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.1;

        // Create glowing effect
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, pulseSize * 3
        );
        glowGradient.addColorStop(0, `rgba(255, 80, 80, ${pulseAlpha})`);
        glowGradient.addColorStop(0.5, `rgba(220, 38, 38, ${pulseAlpha * 0.5})`);
        glowGradient.addColorStop(1, `rgba(220, 38, 38, 0)`);

        // Draw outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 120, 120, ${pulseAlpha})`;
        ctx.fill();
      });

      // Draw connection lines between nearby particles
      for (let i = 0; i < freeParticles.length; i++) {
        const particle1 = freeParticles[i];
        for (let j = i + 1; j < freeParticles.length; j++) {
          const particle2 = freeParticles[j];
          
          const distance = Math.sqrt(
            (particle2.x - particle1.x) ** 2 + (particle2.y - particle1.y) ** 2
          );
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: 'transparent'
      }}
    />
  );
};

export default CyberAnimation;
