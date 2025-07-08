import { useEffect, useRef } from 'react';

const CyberAnimation6 = () => {
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

    // Subtle red and black orbital system - much less distracting
    const bigOrbs = [];
    const numBigOrbs = 3; // Fewer orbs
    
    // Create big stationary orbs with reduced intensity
    for (let i = 0; i < numBigOrbs; i++) {
      bigOrbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 50 + 40, // Smaller orbs
        pulseSpeed: Math.random() * 0.01 + 0.005, // Slower pulse
        brightness: Math.random() * 0.15 + 0.1, // Much dimmer
        satellites: []
      });
    }
    
    // Create fewer, smaller satellite orbs
    bigOrbs.forEach((bigOrb) => {
      const numSatellites = Math.floor(Math.random() * 3) + 2; // Fewer satellites
      
      for (let i = 0; i < numSatellites; i++) {
        bigOrb.satellites.push({
          angle: (i / numSatellites) * Math.PI * 2,
          distance: bigOrb.radius + 30 + Math.random() * 60, // Closer orbits
          speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1), // Slower
          radius: Math.random() * 8 + 4, // Smaller
          brightness: Math.random() * 0.2 + 0.1, // Much dimmer
          trail: [],
          maxTrailLength: 8, // Shorter trails
          blurIntensity: Math.random() * 4 + 2 // Less blur
        });
      }
    });
    
    // Minimal free-floating orbs
    const freeOrbs = [];
    const numFreeOrbs = 8; // Much fewer
    
    for (let i = 0; i < numFreeOrbs; i++) {
      freeOrbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8, // Slower movement
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 12 + 6, // Smaller
        brightness: Math.random() * 0.15 + 0.05, // Much dimmer
        blurIntensity: Math.random() * 3 + 1 // Less blur
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear with very dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Slower fade for less visual noise
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01; // Slower time progression

      // Draw big stationary orbs - much more subtle
      bigOrbs.forEach((bigOrb) => {
        const pulse = Math.sin(time * bigOrb.pulseSpeed) * 0.1 + 1; // Smaller pulse
        const currentRadius = bigOrb.radius * pulse;
        
        // Create very subtle glow effect
        for (let i = 0; i < 2; i++) { // Fewer glow layers
          const glowRadius = currentRadius + (i * 12);
          const alpha = (bigOrb.brightness / (i + 2)) * 0.2; // Much dimmer
          
          const gradient = ctx.createRadialGradient(
            bigOrb.x, bigOrb.y, 0,
            bigOrb.x, bigOrb.y, glowRadius
          );
          gradient.addColorStop(0, `rgba(80, 25, 25, ${alpha})`);
          gradient.addColorStop(0.7, `rgba(50, 15, 15, ${alpha * 0.5})`);
          gradient.addColorStop(1, `rgba(25, 8, 8, 0)`);
          
          ctx.beginPath();
          ctx.arc(bigOrb.x, bigOrb.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        // Core orb - subtle red
        const coreGradient = ctx.createRadialGradient(
          bigOrb.x - currentRadius * 0.3, bigOrb.y - currentRadius * 0.3, 0,
          bigOrb.x, bigOrb.y, currentRadius
        );
        coreGradient.addColorStop(0, `rgba(120, 40, 40, ${bigOrb.brightness})`);
        coreGradient.addColorStop(0.6, `rgba(80, 25, 25, ${bigOrb.brightness * 0.7})`);
        coreGradient.addColorStop(1, `rgba(40, 12, 12, ${bigOrb.brightness * 0.3})`);
        
        ctx.beginPath();
        ctx.arc(bigOrb.x, bigOrb.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
      });

      // Update and draw satellite orbs - much more subtle
      bigOrbs.forEach((bigOrb) => {
        bigOrb.satellites.forEach((satellite) => {
          satellite.angle += satellite.speed;
          
          const x = bigOrb.x + Math.cos(satellite.angle) * satellite.distance;
          const y = bigOrb.y + Math.sin(satellite.angle) * satellite.distance;
          
          // Add to trail
          satellite.trail.push({ x, y, alpha: 1 });
          if (satellite.trail.length > satellite.maxTrailLength) {
            satellite.trail.shift();
          }
          
          // Draw very subtle trail
          satellite.trail.forEach((point, index) => {
            const trailAlpha = (index / satellite.trail.length) * satellite.brightness * 0.15; // Much dimmer
            const trailRadius = satellite.radius * (index / satellite.trail.length) * 0.6;
            
            if (trailAlpha > 0.01) { // Only draw if visible enough
              const trailGradient = ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, trailRadius + satellite.blurIntensity
              );
              trailGradient.addColorStop(0, `rgba(70, 25, 25, ${trailAlpha})`);
              trailGradient.addColorStop(0.5, `rgba(50, 18, 18, ${trailAlpha * 0.6})`);
              trailGradient.addColorStop(1, `rgba(30, 10, 10, 0)`);
              
              ctx.beginPath();
              ctx.arc(point.x, point.y, trailRadius + satellite.blurIntensity, 0, Math.PI * 2);
              ctx.fillStyle = trailGradient;
              ctx.fill();
            }
          });
          
          // Draw main satellite - very subtle
          const satelliteGradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, satellite.radius + satellite.blurIntensity
          );
          satelliteGradient.addColorStop(0, `rgba(100, 35, 35, ${satellite.brightness})`);
          satelliteGradient.addColorStop(0.4, `rgba(70, 25, 25, ${satellite.brightness * 0.7})`);
          satelliteGradient.addColorStop(1, `rgba(35, 12, 12, 0)`);
          
          ctx.beginPath();
          ctx.arc(x, y, satellite.radius + satellite.blurIntensity, 0, Math.PI * 2);
          ctx.fillStyle = satelliteGradient;
          ctx.fill();
        });
      });

      // Update and draw free-floating orbs - very subtle
      freeOrbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        
        // Bounce off edges
        if (orb.x < 0 || orb.x > canvas.width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.vy *= -1;
        
        // Keep in bounds
        orb.x = Math.max(0, Math.min(canvas.width, orb.x));
        orb.y = Math.max(0, Math.min(canvas.height, orb.y));
        
        // Draw with minimal effect
        const orbGradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius + orb.blurIntensity
        );
        orbGradient.addColorStop(0, `rgba(80, 30, 30, ${orb.brightness})`);
        orbGradient.addColorStop(0.5, `rgba(50, 18, 18, ${orb.brightness * 0.6})`);
        orbGradient.addColorStop(1, `rgba(25, 8, 8, 0)`);
        
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius + orb.blurIntensity, 0, Math.PI * 2);
        ctx.fillStyle = orbGradient;
        ctx.fill();
      });

      // Very rare connecting lines
      if (Math.random() < 0.02) { // Much less frequent
        const allOrbs = [...freeOrbs];
        bigOrbs.forEach(bigOrb => {
          bigOrb.satellites.forEach(sat => {
            allOrbs.push({
              x: bigOrb.x + Math.cos(sat.angle) * sat.distance,
              y: bigOrb.y + Math.sin(sat.angle) * sat.distance,
              radius: sat.radius,
              brightness: sat.brightness
            });
          });
        });
        
        for (let i = 0; i < allOrbs.length && i < 5; i++) { // Limit connections
          for (let j = i + 1; j < allOrbs.length && j < 5; j++) {
            const dx = allOrbs[i].x - allOrbs[j].x;
            const dy = allOrbs[i].y - allOrbs[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100 && Math.random() < 0.1) {
              const alpha = (100 - distance) / 100 * 0.05; // Very faint
              ctx.beginPath();
              ctx.moveTo(allOrbs[i].x, allOrbs[j].y);
              ctx.lineTo(allOrbs[j].x, allOrbs[j].y);
              ctx.strokeStyle = `rgba(60, 20, 20, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
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
        background: 'radial-gradient(circle at center, rgba(15, 5, 5, 0.3) 0%, rgba(5, 2, 2, 0.7) 70%, rgba(0, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default CyberAnimation6;
