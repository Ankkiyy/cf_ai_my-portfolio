import { useEffect, useRef } from 'react';

const ContainedLoader6 = () => {
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

    // Subtle red and black orbital system
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) / 8;
    
    // Central subtle orb
    const centralOrb = {
      x: centerX,
      y: centerY,
      radius: baseRadius,
      pulseSpeed: 0.01, // Slower pulse
      brightness: 0.3   // Much dimmer
    };
    
    // Orbital rings with small orbs
    const orbitalRings = [];
    const numRings = 2; // Fewer rings for less distraction
    
    for (let ring = 0; ring < numRings; ring++) {
      const ringRadius = baseRadius + (ring + 1) * 40;
      const numOrbs = 3 + ring; // Fewer orbs
      const ringData = {
        radius: ringRadius,
        orbs: [],
        speed: (0.008 - ring * 0.002) * (ring % 2 === 0 ? 1 : -1) // Much slower
      };
      
      for (let i = 0; i < numOrbs; i++) {
        ringData.orbs.push({
          angle: (i / numOrbs) * Math.PI * 2,
          size: 4 - ring, // Smaller orbs
          brightness: 0.2 - ring * 0.05, // Very dim
          trail: [],
          maxTrailLength: 6 - ring * 2, // Shorter trails
          blurIntensity: 3 - ring // Less blur
        });
      }
      
      orbitalRings.push(ringData);
    }
    
    // Minimal floating background orbs
    const backgroundOrbs = [];
    const numBackgroundOrbs = 4; // Much fewer
    
    for (let i = 0; i < numBackgroundOrbs; i++) {
      backgroundOrbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Very slow movement
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 6 + 3, // Smaller
        brightness: Math.random() * 0.1 + 0.05, // Very dim
        blurIntensity: Math.random() * 2 + 1 // Minimal blur
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear with pure black background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Slower fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01; // Slower time progression

      // Draw minimal background orbs
      backgroundOrbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        
        // Bounce off edges
        if (orb.x < 0 || orb.x > canvas.width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.vy *= -1;
        
        // Keep in bounds
        orb.x = Math.max(0, Math.min(canvas.width, orb.x));
        orb.y = Math.max(0, Math.min(canvas.height, orb.y));
        
        // Draw with subtle red glow
        const orbGradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius + orb.blurIntensity
        );
        orbGradient.addColorStop(0, `rgba(80, 20, 20, ${orb.brightness})`);
        orbGradient.addColorStop(0.7, `rgba(40, 10, 10, ${orb.brightness * 0.5})`);
        orbGradient.addColorStop(1, `rgba(20, 5, 5, 0)`);
        
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius + orb.blurIntensity, 0, Math.PI * 2);
        ctx.fillStyle = orbGradient;
        ctx.fill();
      });

      // Draw central orb with very subtle pulsing
      const pulse = Math.sin(time * centralOrb.pulseSpeed) * 0.1 + 1; // Smaller pulse
      const currentRadius = centralOrb.radius * pulse;
      
      // Very subtle glow layers
      for (let i = 0; i < 2; i++) { // Fewer layers
        const glowRadius = currentRadius + (i * 8);
        const alpha = (centralOrb.brightness / (i + 2)) * 0.3; // Much dimmer
        
        const gradient = ctx.createRadialGradient(
          centralOrb.x, centralOrb.y, 0,
          centralOrb.x, centralOrb.y, glowRadius
        );
        gradient.addColorStop(0, `rgba(120, 40, 40, ${alpha})`);
        gradient.addColorStop(0.7, `rgba(80, 20, 20, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(40, 10, 10, 0)`);
        
        ctx.beginPath();
        ctx.arc(centralOrb.x, centralOrb.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Core orb - subtle red
      const coreGradient = ctx.createRadialGradient(
        centralOrb.x - currentRadius * 0.3, centralOrb.y - currentRadius * 0.3, 0,
        centralOrb.x, centralOrb.y, currentRadius
      );
      coreGradient.addColorStop(0, `rgba(150, 50, 50, ${centralOrb.brightness})`);
      coreGradient.addColorStop(0.6, `rgba(100, 30, 30, ${centralOrb.brightness * 0.7})`);
      coreGradient.addColorStop(1, `rgba(60, 15, 15, ${centralOrb.brightness * 0.3})`);
      
      ctx.beginPath();
      ctx.arc(centralOrb.x, centralOrb.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Draw orbital rings - very subtle
      orbitalRings.forEach((ring) => {
        ring.orbs.forEach((orb) => {
          orb.angle += ring.speed;
          
          const x = centralOrb.x + Math.cos(orb.angle) * ring.radius;
          const y = centralOrb.y + Math.sin(orb.angle) * ring.radius;
          
          // Add to trail (shorter)
          orb.trail.push({ x, y, alpha: 1 });
          if (orb.trail.length > orb.maxTrailLength) {
            orb.trail.shift();
          }
          
          // Draw very subtle trail
          orb.trail.forEach((point, index) => {
            const trailAlpha = (index / orb.trail.length) * orb.brightness * 0.2; // Much dimmer trails
            const trailRadius = orb.size * (index / orb.trail.length) * 0.5;
            
            if (trailAlpha > 0.01) { // Only draw if visible enough
              const trailGradient = ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, trailRadius + orb.blurIntensity
              );
              trailGradient.addColorStop(0, `rgba(80, 25, 25, ${trailAlpha})`);
              trailGradient.addColorStop(1, `rgba(40, 12, 12, 0)`);
              
              ctx.beginPath();
              ctx.arc(point.x, point.y, trailRadius + orb.blurIntensity, 0, Math.PI * 2);
              ctx.fillStyle = trailGradient;
              ctx.fill();
            }
          });
          
          // Draw main orbital orb - very subtle
          const orbGradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, orb.size + orb.blurIntensity
          );
          orbGradient.addColorStop(0, `rgba(100, 35, 35, ${orb.brightness})`);
          orbGradient.addColorStop(0.6, `rgba(70, 20, 20, ${orb.brightness * 0.7})`);
          orbGradient.addColorStop(1, `rgba(35, 10, 10, 0)`);
          
          ctx.beginPath();
          ctx.arc(x, y, orb.size + orb.blurIntensity, 0, Math.PI * 2);
          ctx.fillStyle = orbGradient;
          ctx.fill();
        });
        
        // Draw very faint orbital path
        ctx.beginPath();
        ctx.arc(centralOrb.x, centralOrb.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(60, 20, 20, 0.05)`; // Extremely faint
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]); // Longer dashes, more space
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Very occasional subtle energy pulses
      if (Math.random() < 0.02) { // Much less frequent
        const pulseAngle = Math.random() * Math.PI * 2;
        const pulseDistance = centralOrb.radius + 15;
        const pulseX = centralOrb.x + Math.cos(pulseAngle) * pulseDistance;
        const pulseY = centralOrb.y + Math.sin(pulseAngle) * pulseDistance;
        
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 40, 40, ${Math.random() * 0.3 + 0.1})`; // Very dim
        ctx.fill();
      }

      // Minimal connecting lines (very rare)
      if (Math.random() < 0.01) { // Very rare
        orbitalRings.forEach((ring1, i) => {
          orbitalRings.forEach((ring2, j) => {
            if (i !== j && ring1.orbs.length > 0 && ring2.orbs.length > 0) {
              const orb1 = ring1.orbs[0]; // Just use first orbs
              const orb2 = ring2.orbs[0];
              
              const x1 = centralOrb.x + Math.cos(orb1.angle) * ring1.radius;
              const y1 = centralOrb.y + Math.sin(orb1.angle) * ring1.radius;
              const x2 = centralOrb.x + Math.cos(orb2.angle) * ring2.radius;
              const y2 = centralOrb.y + Math.sin(orb2.angle) * ring2.radius;
              
              const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
              
              if (distance < 60) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `rgba(60, 20, 20, 0.1)`; // Very faint
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          });
        });
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
      style={{ 
        background: 'radial-gradient(circle at center, rgba(20, 5, 5, 0.1) 0%, rgba(10, 2, 2, 0.3) 70%, rgba(0, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default ContainedLoader6;
