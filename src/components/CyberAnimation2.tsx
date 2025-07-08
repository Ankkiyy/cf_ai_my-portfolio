import { useEffect, useRef } from 'react';

const CyberAnimation2 = () => {
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

    // Stranger Things inspired particles and effects
    const floatingParticles = [];
    const lightningBolts = [];
    const portalRings = [];
    const mousePosition = { x: 0, y: 0 };
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Create floating ash-like particles
    for (let i = 0; i < 60; i++) {
      floatingParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8 - 0.2, // Slight upward drift
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        type: Math.random() > 0.8 ? 'glowing' : 'normal',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    // Create occasional lightning bolts
    const createLightningBolt = () => {
      const startX = Math.random() * canvas.width;
      const startY = -50;
      const segments = [];
      let currentX = startX;
      let currentY = startY;
      
      for (let i = 0; i < 15; i++) {
        const nextX = currentX + (Math.random() - 0.5) * 60;
        const nextY = currentY + Math.random() * 80 + 40;
        segments.push({ x: nextX, y: nextY });
        currentX = nextX;
        currentY = nextY;
        
        if (currentY > canvas.height + 50) break;
      }
      
      lightningBolts.push({
        segments,
        alpha: 1,
        thickness: Math.random() * 3 + 1,
        color: Math.random() > 0.7 ? 'red' : 'blue',
        lifespan: 30 + Math.random() * 20
      });
    };

    // Create portal-like rings
    for (let i = 0; i < 3; i++) {
      portalRings.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 50 + 30,
        maxRadius: Math.random() * 150 + 100,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.01
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Dark, eerie background with subtle red tint
      ctx.fillStyle = 'rgba(8, 5, 8, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Occasionally create lightning
      if (Math.random() < 0.005) {
        createLightningBolt();
      }

      // Draw lightning bolts
      lightningBolts.forEach((bolt, index) => {
        bolt.alpha -= 1 / bolt.lifespan;
        if (bolt.alpha <= 0) {
          lightningBolts.splice(index, 1);
          return;
        }

        ctx.strokeStyle = bolt.color === 'red' 
          ? `rgba(255, 100, 100, ${bolt.alpha})` 
          : `rgba(100, 150, 255, ${bolt.alpha})`;
        ctx.lineWidth = bolt.thickness;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = bolt.color === 'red' ? '#ff6464' : '#64a0ff';

        ctx.beginPath();
        if (bolt.segments.length > 0) {
          ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y - 50);
          bolt.segments.forEach(segment => {
            ctx.lineTo(segment.x, segment.y);
          });
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw portal rings
      portalRings.forEach((ring) => {
        ring.pulse += ring.pulseSpeed;
        ring.rotation += ring.rotationSpeed;
        
        const currentRadius = ring.radius + Math.sin(ring.pulse) * 20;
        const glowAlpha = 0.3 + Math.sin(ring.pulse) * 0.2;

        ctx.save();
        ctx.translate(ring.x, ring.y);
        ctx.rotate(ring.rotation);

        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, currentRadius * 0.8, 0, 0, currentRadius * 1.5);
        gradient.addColorStop(0, `rgba(255, 50, 50, 0)`);
        gradient.addColorStop(0.7, `rgba(255, 50, 50, ${glowAlpha * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 50, 50, 0)`);

        ctx.beginPath();
        ctx.arc(0, 0, currentRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Main ring
        ctx.strokeStyle = `rgba(255, 100, 100, ${glowAlpha})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff3232';
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner distortion lines
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + ring.rotation;
          const innerRadius = currentRadius * 0.3;
          const outerRadius = currentRadius * 0.8;
          
          ctx.strokeStyle = `rgba(200, 50, 50, ${glowAlpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
          ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Draw floating particles (ash-like)
      floatingParticles.forEach((particle) => {
        // Mouse interaction - particles flee from cursor
        const mouseDistance = Math.sqrt(
          (mousePosition.x - particle.x) ** 2 + (mousePosition.y - particle.y) ** 2
        );
        const mouseInfluence = Math.max(0, 80 - mouseDistance) / 80;
        
        if (mouseInfluence > 0) {
          const angle = Math.atan2(particle.y - mousePosition.y, particle.x - mousePosition.x);
          particle.speedX += Math.cos(angle) * mouseInfluence * 0.5;
          particle.speedY += Math.sin(angle) * mouseInfluence * 0.5;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += particle.pulseSpeed;
        particle.rotation += particle.rotationSpeed;

        // Wrap particles around screen
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;

        const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.2;
        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        if (particle.type === 'glowing') {
          // Glowing particles with red/blue tint
          const glowColor = Math.sin(time + particle.pulse) > 0 ? '255, 100, 100' : '100, 150, 255';
          
          // Outer glow
          const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize * 4);
          glowGradient.addColorStop(0, `rgba(${glowColor}, ${pulseAlpha * 0.8})`);
          glowGradient.addColorStop(0.5, `rgba(${glowColor}, ${pulseAlpha * 0.3})`);
          glowGradient.addColorStop(1, `rgba(${glowColor}, 0)`);

          ctx.beginPath();
          ctx.arc(0, 0, pulseSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${glowColor}, ${pulseAlpha})`;
          ctx.fill();
        } else {
          // Regular ash-like particles
          ctx.fillStyle = `rgba(150, 120, 130, ${pulseAlpha * 0.7})`;
          ctx.beginPath();
          // Draw irregular shape
          ctx.moveTo(pulseSize, 0);
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const radius = pulseSize * (0.7 + Math.random() * 0.6);
            ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      // Add atmospheric distortion effect
      if (Math.random() < 0.02) {
        const distortionX = Math.random() * canvas.width;
        const distortionY = Math.random() * canvas.height;
        const distortionSize = Math.random() * 100 + 50;
        
        const distortionGradient = ctx.createRadialGradient(
          distortionX, distortionY, 0,
          distortionX, distortionY, distortionSize
        );
        distortionGradient.addColorStop(0, 'rgba(255, 50, 50, 0.1)');
        distortionGradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
        
        ctx.fillStyle = distortionGradient;
        ctx.beginPath();
        ctx.arc(distortionX, distortionY, distortionSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
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

export default CyberAnimation2;
