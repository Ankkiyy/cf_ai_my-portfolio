import { useEffect, useRef } from 'react';

const ContainedLoader2 = () => {
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

    // Stranger Things Loader Configuration
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) / 4;
    
    // Portal rings with Stranger Things colors
    const portalRings = [
      { radius: baseRadius * 0.4, speed: 0.04, thickness: 6, segments: 4, gap: Math.PI / 2, color: { r: 139, g: 0, b: 0 } },
      { radius: baseRadius * 0.6, speed: -0.03, thickness: 4, segments: 6, gap: Math.PI / 3, color: { r: 0, g: 100, b: 139 } },
      { radius: baseRadius * 0.8, speed: 0.025, thickness: 8, segments: 8, gap: Math.PI / 4, color: { r: 139, g: 0, b: 0 } },
    ];

    // Ash particles
    const ashParticles = [];
    for (let i = 0; i < 20; i++) {
      ashParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: Math.random() * 0.5 + 0.2,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        drift: Math.random() * Math.PI * 2
      });
    }

    // Lightning bolts
    const lightningBolts = [];
    for (let i = 0; i < 3; i++) {
      lightningBolts.push({
        points: [],
        alpha: 0,
        duration: 0,
        maxDuration: 30 + Math.random() * 20,
        color: Math.random() > 0.5 ? { r: 139, g: 0, b: 0 } : { r: 0, g: 100, b: 139 }
      });
    }

    let rotation = 0;
    let time = 0;
    let animationId: number;

    const generateLightning = (bolt) => {
      bolt.points = [];
      const segments = 8;
      const startX = centerX + (Math.random() - 0.5) * baseRadius;
      const startY = centerY + (Math.random() - 0.5) * baseRadius;
      const endX = centerX + (Math.random() - 0.5) * baseRadius * 1.5;
      const endY = centerY + (Math.random() - 0.5) * baseRadius * 1.5;

      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const x = startX + (endX - startX) * progress + (Math.random() - 0.5) * 20;
        const y = startY + (endY - startY) * progress + (Math.random() - 0.5) * 20;
        bolt.points.push({ x, y });
      }
      bolt.duration = 0;
      bolt.alpha = 1;
    };

    const animate = () => {
      // Clear with dark Stranger Things atmosphere
      ctx.fillStyle = 'rgba(5, 5, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotation += 0.01;
      time += 0.03;

      // Draw floating ash particles
      ashParticles.forEach((ash, index) => {
        ash.x += ash.speedX;
        ash.y += ash.speedY;
        ash.drift += 0.02;
        ash.x += Math.sin(ash.drift) * 0.3;

        // Reset particles that fall off screen
        if (ash.y > canvas.height + 10) {
          ash.y = -10;
          ash.x = Math.random() * canvas.width;
        }
        if (ash.x < -10 || ash.x > canvas.width + 10) {
          ash.x = Math.random() * canvas.width;
        }

        // Draw ash particle with glow
        const ashGlow = ctx.createRadialGradient(
          ash.x, ash.y, 0,
          ash.x, ash.y, ash.size * 4
        );
        ashGlow.addColorStop(0, `rgba(160, 160, 160, ${ash.alpha})`);
        ashGlow.addColorStop(0.5, `rgba(100, 100, 100, ${ash.alpha * 0.5})`);
        ashGlow.addColorStop(1, `rgba(80, 80, 80, 0)`);

        ctx.beginPath();
        ctx.arc(ash.x, ash.y, ash.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = ashGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ash.x, ash.y, ash.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 180, 180, ${ash.alpha})`;
        ctx.fill();
      });

      // Draw portal rings
      portalRings.forEach((ring, index) => {
        const currentRotation = rotation * ring.speed + (index * Math.PI / 3);
        const breathe = Math.sin(time + index * 0.5) * 0.15 + 1;
        const adjustedRadius = ring.radius * breathe;
        
        const ringGradient = ctx.createRadialGradient(
          centerX, centerY, adjustedRadius - 20,
          centerX, centerY, adjustedRadius + 20
        );
        ringGradient.addColorStop(0, `rgba(${ring.color.r}, ${ring.color.g}, ${ring.color.b}, 0)`);
        ringGradient.addColorStop(0.3, `rgba(${ring.color.r + 50}, ${ring.color.g + 50}, ${ring.color.b + 50}, 0.8)`);
        ringGradient.addColorStop(0.7, `rgba(${ring.color.r}, ${ring.color.g}, ${ring.color.b}, 0.9)`);
        ringGradient.addColorStop(1, `rgba(${ring.color.r - 50}, ${ring.color.g - 20}, ${ring.color.b - 20}, 0)`);
        
        for (let i = 0; i < ring.segments; i++) {
          const startAngle = currentRotation + (i / ring.segments) * Math.PI * 2;
          const endAngle = startAngle + (Math.PI * 2 / ring.segments) - ring.gap;
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness * 2;
          ctx.strokeStyle = ringGradient;
          ctx.lineCap = 'round';
          ctx.globalAlpha = 0.3;
          ctx.stroke();

          // Inner bright line
          ctx.beginPath();
          ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
          ctx.lineWidth = ring.thickness;
          ctx.strokeStyle = `rgba(${ring.color.r + 100}, ${ring.color.g + 100}, ${ring.color.b + 100}, 0.9)`;
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
      });

      // Handle lightning bolts
      lightningBolts.forEach((bolt) => {
        bolt.duration++;
        
        if (bolt.duration >= bolt.maxDuration) {
          if (Math.random() < 0.1) { // 10% chance to generate new lightning
            generateLightning(bolt);
          }
        } else if (bolt.points.length > 0) {
          bolt.alpha = Math.max(0, 1 - (bolt.duration / bolt.maxDuration));
          
          // Draw lightning bolt
          if (bolt.points.length > 1) {
            // Outer glow
            ctx.beginPath();
            ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
            for (let i = 1; i < bolt.points.length; i++) {
              ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
            }
            ctx.strokeStyle = `rgba(${bolt.color.r}, ${bolt.color.g}, ${bolt.color.b}, ${bolt.alpha * 0.3})`;
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Inner bright bolt
            ctx.beginPath();
            ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
            for (let i = 1; i < bolt.points.length; i++) {
              ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
            }
            ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.alpha * 0.9})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Draw central portal core
      const coreSize = 15 + Math.sin(time * 3) * 5;
      const secondarySize = 10 + Math.sin(time * 4.5) * 3;
      
      // Portal vortex effect
      const vortexGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreSize * 3
      );
      vortexGradient.addColorStop(0, 'rgba(20, 20, 40, 1)');
      vortexGradient.addColorStop(0.3, 'rgba(139, 0, 0, 0.8)');
      vortexGradient.addColorStop(0.6, 'rgba(0, 100, 139, 0.6)');
      vortexGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = vortexGradient;
      ctx.fill();

      // Core portal
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20, 20, 60, 0.9)`;
      ctx.fill();

      // Inner glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, secondarySize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 100, 200, 0.8)`;
      ctx.fill();

      // Center light
      ctx.beginPath();
      ctx.arc(centerX, centerY, secondarySize * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 255, 1)`;
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
        background: 'radial-gradient(circle at center, rgba(139, 0, 0, 0.05) 0%, rgba(5, 5, 15, 0.95) 70%, rgba(0, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default ContainedLoader2;
