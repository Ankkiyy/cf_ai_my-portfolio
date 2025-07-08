import { useEffect, useRef } from 'react';

const ContainedLoader5 = () => {
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

    // Cyberpunk Neon Loader Configuration
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) / 4;
    
    // Neon circuit rings with cyberpunk colors
    const neonRings = [
      { radius: baseRadius * 0.4, speed: 0.05, thickness: 6, segments: 3, gap: Math.PI / 1.5, color: { r: 0, g: 191, b: 255 } },
      { radius: baseRadius * 0.6, speed: -0.04, thickness: 4, segments: 4, gap: Math.PI / 2, color: { r: 138, g: 43, b: 226 } },
      { radius: baseRadius * 0.8, speed: 0.03, thickness: 8, segments: 6, gap: Math.PI / 3, color: { r: 255, g: 20, b: 147 } },
    ];

    // Energy particles orbiting the center
    const energyParticles = [];
    for (let i = 0; i < 8; i++) {
      const colorType = Math.random();
      let color;
      if (colorType < 0.4) {
        color = { r: 0, g: 191, b: 255 }; // Electric blue
      } else if (colorType < 0.7) {
        color = { r: 138, g: 43, b: 226 }; // Neon purple
      } else {
        color = { r: 255, g: 20, b: 147 }; // Hot pink
      }

      energyParticles.push({
        angle: (i / 8) * Math.PI * 2,
        radius: baseRadius * (0.3 + (i % 3) * 0.15),
        speed: 0.03 + (i % 3) * 0.01,
        size: Math.random() * 2.5 + 1.5,
        alpha: Math.random() * 0.6 + 0.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        color: color,
        trail: [],
        energy: Math.random() * 100
      });
    }

    // Circuit board traces
    const circuitTraces = [];
    for (let i = 0; i < 6; i++) {
      const startAngle = (i / 6) * Math.PI * 2;
      const endAngle = startAngle + Math.PI / 3;
      circuitTraces.push({
        startAngle: startAngle,
        endAngle: endAngle,
        radius: baseRadius * 0.9,
        width: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? { r: 0, g: 255, b: 255 } : { r: 255, g: 0, b: 255 }
      });
    }

    // Neon pulses expanding outward
    const neonPulses = [];
    for (let i = 0; i < 2; i++) {
      neonPulses.push({
        radius: 0,
        maxRadius: baseRadius * 1.5,
        speed: 2,
        alpha: 0.8,
        color: i === 0 ? { r: 0, g: 191, b: 255 } : { r: 138, g: 43, b: 226 },
        delay: i * 60
      });
    }

    let rotation = 0;
    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear with dark cyberpunk background
      ctx.fillStyle = 'rgba(5, 5, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotation += 0.02;
      time += 0.03;

      // Draw neon pulses
      neonPulses.forEach((pulse, index) => {
        pulse.radius += pulse.speed;
        pulse.alpha -= 0.008;

        if (pulse.radius > pulse.maxRadius || pulse.alpha <= 0) {
          pulse.radius = 0;
          pulse.alpha = 0.8;
        }

        if (pulse.radius > 0 && pulse.alpha > 0) {
          // Outer glow ring
          const pulseGlow = ctx.createRadialGradient(
            centerX, centerY, pulse.radius * 0.9,
            centerX, centerY, pulse.radius
          );
          pulseGlow.addColorStop(0, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, 0)`);
          pulseGlow.addColorStop(1, `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulse.alpha * 0.4})`);

          ctx.beginPath();
          ctx.arc(centerX, centerY, pulse.radius, 0, Math.PI * 2);
          ctx.strokeStyle = pulseGlow;
          ctx.lineWidth = 4;
          ctx.stroke();

          // Inner bright ring
          ctx.beginPath();
          ctx.arc(centerX, centerY, pulse.radius * 0.95, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulse.alpha * 0.7})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw circuit board traces
      circuitTraces.forEach((trace) => {
        trace.pulse += 0.05;
        const tracePulse = Math.sin(trace.pulse) * 0.4 + 0.6;
        
        // Main trace line
        const traceGradient = ctx.createRadialGradient(
          centerX, centerY, trace.radius - 15,
          centerX, centerY, trace.radius + 15
        );
        traceGradient.addColorStop(0, `rgba(${trace.color.r}, ${trace.color.g}, ${trace.color.b}, 0)`);
        traceGradient.addColorStop(0.5, `rgba(${trace.color.r}, ${trace.color.g}, ${trace.color.b}, ${trace.alpha * tracePulse})`);
        traceGradient.addColorStop(1, `rgba(${trace.color.r}, ${trace.color.g}, ${trace.color.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, trace.radius, trace.startAngle, trace.endAngle);
        ctx.lineWidth = trace.width * 3;
        ctx.strokeStyle = traceGradient;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright inner trace
        ctx.beginPath();
        ctx.arc(centerX, centerY, trace.radius, trace.startAngle, trace.endAngle);
        ctx.lineWidth = trace.width;
        ctx.strokeStyle = `rgba(${trace.color.r + 100}, ${trace.color.g + 100}, ${trace.color.b + 100}, ${trace.alpha * tracePulse})`;
        ctx.stroke();
      });

      // Draw neon rings
      neonRings.forEach((ring, index) => {
        const currentRotation = rotation * ring.speed + (index * Math.PI / 3);
        const breathe = Math.sin(time + index * 0.8) * 0.15 + 1;
        const adjustedRadius = ring.radius * breathe;
        
        const ringGradient = ctx.createRadialGradient(
          centerX, centerY, adjustedRadius - 25,
          centerX, centerY, adjustedRadius + 25
        );
        ringGradient.addColorStop(0, `rgba(${ring.color.r}, ${ring.color.g}, ${ring.color.b}, 0)`);
        ringGradient.addColorStop(0.3, `rgba(${ring.color.r + 100}, ${ring.color.g + 100}, ${ring.color.b + 100}, 0.9)`);
        ringGradient.addColorStop(0.7, `rgba(${ring.color.r}, ${ring.color.g}, ${ring.color.b}, 0.8)`);
        ringGradient.addColorStop(1, `rgba(${ring.color.r - 50}, ${ring.color.g - 20}, ${ring.color.b - 20}, 0)`);
        
        for (let i = 0; i < ring.segments; i++) {
          const startAngle = currentRotation + (i / ring.segments) * Math.PI * 2;
          const endAngle = startAngle + (Math.PI * 2 / ring.segments) - ring.gap;
          
          // Outer neon glow
          ctx.beginPath();
          ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness * 3;
          ctx.strokeStyle = ringGradient;
          ctx.lineCap = 'round';
          ctx.globalAlpha = 0.4;
          ctx.stroke();

          // Inner bright neon
          ctx.beginPath();
          ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness;
          ctx.strokeStyle = `rgba(255, 255, 255, 0.9)`;
          ctx.globalAlpha = 1;
          ctx.stroke();

          // Core neon color
          ctx.beginPath();
          ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness * 0.6;
          ctx.strokeStyle = `rgba(${ring.color.r}, ${ring.color.g}, ${ring.color.b}, 1)`;
          ctx.stroke();
        }
      });

      // Update and draw energy particles
      energyParticles.forEach((particle, index) => {
        particle.angle += particle.speed;
        particle.pulse += particle.pulseSpeed;
        particle.energy = Math.max(0, particle.energy - 0.5);
        
        const x = centerX + Math.cos(particle.angle) * particle.radius;
        const y = centerY + Math.sin(particle.angle) * particle.radius;
        
        particle.trail.push({ x, y });
        if (particle.trail.length > 10) {
          particle.trail.shift();
        }

        // Draw particle trail
        if (particle.trail.length > 2) {
          for (let i = 1; i < particle.trail.length; i++) {
            const trailAlpha = (i / particle.trail.length) * particle.alpha * 0.5;
            const trailSize = (i / particle.trail.length) * particle.size * 0.8;
            
            const trailGlow = ctx.createRadialGradient(
              particle.trail[i].x, particle.trail[i].y, 0,
              particle.trail[i].x, particle.trail[i].y, trailSize * 3
            );
            trailGlow.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${trailAlpha})`);
            trailGlow.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);

            ctx.beginPath();
            ctx.arc(particle.trail[i].x, particle.trail[i].y, trailSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = trailGlow;
            ctx.fill();
          }
        }
        
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.8;
        const energyBoost = particle.energy / 100;
        const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.3 + energyBoost * 0.4;

        // Outer neon glow
        const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, pulseSize * 6);
        outerGlow.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha})`);
        outerGlow.addColorStop(0.3, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha * 0.6})`);
        outerGlow.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Inner bright glow
        const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, pulseSize * 2);
        innerGlow.addColorStop(0, `rgba(255, 255, 255, ${pulseAlpha})`);
        innerGlow.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha * 0.8})`);
        innerGlow.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.fill();
      });

      // Draw central cyberpunk core
      const coreSize = 22 + Math.sin(time * 2.5) * 8;
      const corePulse = Math.sin(time * 4) * 0.4 + 0.6;
      
      // Multi-layer core effect
      const cyberpunkCoreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreSize * 3
      );
      cyberpunkCoreGradient.addColorStop(0, `rgba(255, 255, 255, ${corePulse})`);
      cyberpunkCoreGradient.addColorStop(0.2, `rgba(0, 191, 255, ${corePulse * 0.9})`);
      cyberpunkCoreGradient.addColorStop(0.5, `rgba(138, 43, 226, ${corePulse * 0.7})`);
      cyberpunkCoreGradient.addColorStop(0.8, `rgba(255, 20, 147, ${corePulse * 0.4})`);
      cyberpunkCoreGradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = cyberpunkCoreGradient;
      ctx.fill();

      // Core ring segments
      for (let i = 0; i < 6; i++) {
        const segmentAngle = (i / 6) * Math.PI * 2 + time * 2;
        const segmentRadius = coreSize * 1.2;
        const segmentX = centerX + Math.cos(segmentAngle) * segmentRadius;
        const segmentY = centerY + Math.sin(segmentAngle) * segmentRadius;
        
        ctx.beginPath();
        ctx.arc(segmentX, segmentY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${corePulse})`;
        ctx.fill();
      }

      // Central bright core
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 200, 255, ${corePulse})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
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
        background: 'radial-gradient(circle at center, rgba(0, 100, 200, 0.06) 0%, rgba(5, 5, 15, 0.95) 70%, rgba(0, 0, 5, 1) 100%)' 
      }}
    />
  );
};

export default ContainedLoader5;
