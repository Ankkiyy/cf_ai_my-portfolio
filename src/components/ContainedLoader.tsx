
import { useEffect, useRef } from 'react';

const ContainedLoader = () => {
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
      { radius: baseRadius * 0.5, speed: 0.03, thickness: 4, alpha: 1, segments: 6, gap: Math.PI / 3 },
      { radius: baseRadius * 0.7, speed: -0.025, thickness: 3, alpha: 0.8, segments: 8, gap: Math.PI / 4 },
      { radius: baseRadius * 0.9, speed: 0.02, thickness: 5, alpha: 0.6, segments: 12, gap: Math.PI / 6 },
      { radius: baseRadius * 1.1, speed: -0.015, thickness: 2, alpha: 0.4, segments: 16, gap: Math.PI / 8 },
    ];

    // Orbiting particles
    const particles = [];
    for (let i = 0; i < 12; i++) {
      particles.push({
        angle: (i / 12) * Math.PI * 2,
        radius: baseRadius * (0.3 + (i % 3) * 0.15),
        speed: 0.02 + (i % 3) * 0.01,
        size: Math.random() * 2 + 1.5,
        alpha: Math.random() * 0.4 + 0.6,
        trail: []
      });
    }

    // Energy orbs
    const energyOrbs = [];
    for (let i = 0; i < 6; i++) {
      energyOrbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.3 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let rotation = 0;
    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(8, 8, 8, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotation += 0.008;
      time += 0.02;

      // Draw floating energy orbs
      energyOrbs.forEach((orb) => {
        orb.x += orb.speedX;
        orb.y += orb.speedY;
        orb.pulse += 0.05;

        // Bounce off edges
        if (orb.x < 0 || orb.x > canvas.width) orb.speedX *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.speedY *= -1;

        const pulsedRadius = orb.radius + Math.sin(orb.pulse) * 3;
        const pulsedAlpha = orb.alpha + Math.sin(orb.pulse) * 0.1;

        // Create energy orb gradient
        const orbGradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, pulsedRadius * 2
        );
        orbGradient.addColorStop(0, `rgba(220, 38, 38, ${pulsedAlpha})`);
        orbGradient.addColorStop(0.5, `rgba(220, 38, 38, ${pulsedAlpha * 0.3})`);
        orbGradient.addColorStop(1, `rgba(220, 38, 38, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulsedRadius, 0, Math.PI * 2);
        ctx.fillStyle = orbGradient;
        ctx.fill();
      });

      // Draw rotating rings
      rings.forEach((ring, index) => {
        const currentRotation = rotation * ring.speed + (index * Math.PI / 4);
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, ring.radius - 30,
          centerX, centerY, ring.radius + 30
        );
        gradient.addColorStop(0, `rgba(220, 38, 38, 0)`);
        gradient.addColorStop(0.3, `rgba(255, 60, 60, ${ring.alpha * 0.8})`);
        gradient.addColorStop(0.7, `rgba(220, 38, 38, ${ring.alpha})`);
        gradient.addColorStop(1, `rgba(160, 20, 20, 0)`);

        const breathe = Math.sin(time + index) * 0.1 + 1;
        const adjustedRadius = ring.radius * breathe;
        
        for (let i = 0; i < ring.segments; i++) {
          const startAngle = currentRotation + (i / ring.segments) * Math.PI * 2;
          const endAngle = startAngle + (Math.PI * 2 / ring.segments) - ring.gap;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness * breathe;
          ctx.strokeStyle = gradient;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Inner glow
          ctx.beginPath();
          ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness * 0.3;
          ctx.strokeStyle = `rgba(255, 100, 100, ${ring.alpha * 0.8})`;
          ctx.stroke();
        }
      });

      // Draw orbiting particles with trails
      particles.forEach((particle, index) => {
        particle.angle += particle.speed;
        
        const x = centerX + Math.cos(particle.angle) * particle.radius;
        const y = centerY + Math.sin(particle.angle) * particle.radius;
        
        particle.trail.push({ x, y });
        if (particle.trail.length > 8) {
          particle.trail.shift();
        }

        // Draw particle trail
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }
          ctx.strokeStyle = `rgba(220, 38, 38, ${particle.alpha * 0.3})`;
          ctx.lineWidth = particle.size * 0.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 4);
        glowGradient.addColorStop(0, `rgba(255, 80, 80, ${particle.alpha})`);
        glowGradient.addColorStop(0.3, `rgba(220, 38, 38, ${particle.alpha * 0.7})`);
        glowGradient.addColorStop(0.7, `rgba(220, 38, 38, ${particle.alpha * 0.3})`);
        glowGradient.addColorStop(1, `rgba(220, 38, 38, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        const pulseSize = particle.size + Math.sin(time * 3 + index) * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 120, 120, ${particle.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 200, ${particle.alpha})`;
        ctx.fill();
      });

      // Draw central core
      const pulseSize = 12 + Math.sin(time * 4) * 4;
      const secondaryPulse = 8 + Math.sin(time * 6) * 2;
      
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, pulseSize * 3
      );
      coreGradient.addColorStop(0, 'rgba(255, 150, 150, 1)');
      coreGradient.addColorStop(0.2, 'rgba(220, 38, 38, 0.9)');
      coreGradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.5)');
      coreGradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 100, 100, 0.9)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, secondaryPulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 200, 200, 1)`;
      ctx.fill();

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
      style={{ 
        background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.08) 0%, rgba(8, 8, 8, 0.95) 70%, rgba(0, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default ContainedLoader;
