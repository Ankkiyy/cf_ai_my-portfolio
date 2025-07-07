
import { useEffect, useRef } from 'react';

const CyberAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Loader Configuration
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) / 4;
    
    // Multiple rotating rings
    const rings = [
      { radius: baseRadius * 0.6, speed: 0.02, thickness: 3, alpha: 0.8 },
      { radius: baseRadius * 0.8, speed: -0.015, thickness: 2, alpha: 0.6 },
      { radius: baseRadius * 1.0, speed: 0.01, thickness: 4, alpha: 0.4 },
    ];

    // Orbiting particles
    const particles = [];
    for (let i = 0; i < 12; i++) {
      particles.push({
        angle: (i / 12) * Math.PI * 2,
        radius: baseRadius * 0.5,
        speed: 0.03,
        size: Math.random() * 3 + 2,
        alpha: Math.random() * 0.5 + 0.5
      });
    }

    let rotation = 0;
    let animationId: number;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(12, 12, 12, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotation += 0.005;

      // Draw rotating rings
      rings.forEach((ring, index) => {
        const currentRotation = rotation * ring.speed;
        
        // Create gradient for 3D effect
        const gradient = ctx.createRadialGradient(
          centerX, centerY, ring.radius - 20,
          centerX, centerY, ring.radius + 20
        );
        gradient.addColorStop(0, `rgba(220, 38, 38, 0)`);
        gradient.addColorStop(0.5, `rgba(220, 38, 38, ${ring.alpha})`);
        gradient.addColorStop(1, `rgba(220, 38, 38, 0)`);

        // Draw ring segments to create loading effect
        for (let i = 0; i < 8; i++) {
          const startAngle = currentRotation + (i / 8) * Math.PI * 2;
          const endAngle = startAngle + Math.PI / 6;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, ring.radius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness;
          ctx.strokeStyle = gradient;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      });

      // Draw orbiting particles
      particles.forEach((particle, index) => {
        particle.angle += particle.speed;
        
        const x = centerX + Math.cos(particle.angle) * particle.radius;
        const y = centerY + Math.sin(particle.angle) * particle.radius;
        
        // Create glowing effect
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 3);
        glowGradient.addColorStop(0, `rgba(220, 38, 38, ${particle.alpha})`);
        glowGradient.addColorStop(0.5, `rgba(220, 38, 38, ${particle.alpha * 0.5})`);
        glowGradient.addColorStop(1, `rgba(220, 38, 38, 0)`);
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        // Draw core particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${particle.alpha})`;
        ctx.fill();
      });

      // Draw central core with pulsing effect
      const pulseSize = 8 + Math.sin(rotation * 5) * 3;
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, pulseSize * 2
      );
      coreGradient.addColorStop(0, 'rgba(220, 38, 38, 1)');
      coreGradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.6)');
      coreGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Draw connection lines between particles
      for (let i = 0; i < particles.length; i++) {
        const particle1 = particles[i];
        const particle2 = particles[(i + 1) % particles.length];
        
        const x1 = centerX + Math.cos(particle1.angle) * particle1.radius;
        const y1 = centerY + Math.sin(particle1.angle) * particle1.radius;
        const x2 = centerX + Math.cos(particle2.angle) * particle2.radius;
        const y2 = centerY + Math.sin(particle2.angle) * particle2.radius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(220, 38, 38, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();
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
      className="absolute inset-0 w-full h-full"
      style={{ background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.05) 0%, rgba(12, 12, 12, 0.9) 100%)' }}
    />
  );
};

export default CyberAnimation;
