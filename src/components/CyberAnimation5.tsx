import { useEffect, useRef } from 'react';

const CyberAnimation5 = () => {
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

    // Cyberpunk Neon City theme
    const neonParticles = [];
    const circuitNodes = [];
    const energyWaves = [];
    const mousePosition = { x: 0, y: 0 };
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Create neon particles with cyberpunk colors
    for (let i = 0; i < 35; i++) {
      const colorType = Math.random();
      let color;
      if (colorType < 0.4) {
        // Electric blue
        color = { r: 0, g: 191, b: 255 };
      } else if (colorType < 0.7) {
        // Neon purple
        color = { r: 138, g: 43, b: 226 };
      } else {
        // Hot pink
        color = { r: 255, g: 20, b: 147 };
      }

      neonParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: color,
        type: Math.random() > 0.8 ? 'core' : 'normal',
        trail: [],
        energy: Math.random() * 100
      });
    }

    // Create circuit board nodes
    for (let i = 0; i < 20; i++) {
      circuitNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.5 ? { r: 0, g: 255, b: 255 } : { r: 255, g: 0, b: 255 },
        connections: []
      });
    }

    // Create energy waves
    for (let i = 0; i < 3; i++) {
      energyWaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: 150 + Math.random() * 100,
        speed: Math.random() * 2 + 1,
        alpha: 0.8,
        color: Math.random() > 0.5 ? { r: 0, g: 191, b: 255 } : { r: 138, g: 43, b: 226 },
        pulseDelay: Math.random() * 200
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear with dark cyberpunk background
      ctx.fillStyle = 'rgba(5, 5, 15, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Draw energy waves
      energyWaves.forEach((wave, index) => {
        wave.radius += wave.speed;
        wave.alpha -= 0.005;

        if (wave.radius > wave.maxRadius || wave.alpha <= 0) {
          wave.radius = 0;
          wave.alpha = 0.8;
          wave.x = Math.random() * canvas.width;
          wave.y = Math.random() * canvas.height;
        }

        if (wave.radius > 0) {
          // Outer glow
          const glowGradient = ctx.createRadialGradient(
            wave.x, wave.y, wave.radius * 0.8,
            wave.x, wave.y, wave.radius
          );
          glowGradient.addColorStop(0, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, 0)`);
          glowGradient.addColorStop(1, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.alpha * 0.3})`);

          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = glowGradient;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Inner bright ring
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius * 0.9, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw circuit board pattern
      circuitNodes.forEach((node, i) => {
        node.pulse += node.pulseSpeed;
        const pulseAlpha = node.alpha + Math.sin(node.pulse) * 0.3;

        // Draw circuit connections
        if (i % 3 === 0) {
          const targetIndex = (i + 3) % circuitNodes.length;
          const target = circuitNodes[targetIndex];
          
          const distance = Math.sqrt(
            (target.x - node.x) ** 2 + (target.y - node.y) ** 2
          );
          
          if (distance < 200) {
            // Draw circuit trace with segments
            const segments = 8;
            const segmentLength = distance / segments;
            
            for (let s = 0; s < segments; s++) {
              const progress = s / segments;
              const x1 = node.x + (target.x - node.x) * progress;
              const y1 = node.y + (target.y - node.y) * progress;
              const x2 = node.x + (target.x - node.x) * (progress + 0.8 / segments);
              const y2 = node.y + (target.y - node.y) * (progress + 0.8 / segments);
              
              const segmentAlpha = pulseAlpha * (1 - progress * 0.5) * 0.4;
              
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.strokeStyle = `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${segmentAlpha})`;
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Add glow to circuit traces
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.strokeStyle = `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${segmentAlpha * 0.3})`;
              ctx.lineWidth = 6;
              ctx.stroke();
            }
          }
        }

        // Draw circuit node
        const nodeGlow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 6
        );
        nodeGlow.addColorStop(0, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${pulseAlpha})`);
        nodeGlow.addColorStop(0.5, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${pulseAlpha * 0.5})`);
        nodeGlow.addColorStop(1, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = nodeGlow;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha * 0.8})`;
        ctx.fill();
      });

      // Draw neon particles
      neonParticles.forEach((particle) => {
        // Mouse interaction
        const mouseDistance = Math.sqrt(
          (mousePosition.x - particle.x) ** 2 + (mousePosition.y - particle.y) ** 2
        );
        const mouseInfluence = Math.max(0, 120 - mouseDistance) / 120;
        
        if (mouseInfluence > 0) {
          const angle = Math.atan2(particle.y - mousePosition.y, particle.x - mousePosition.x);
          particle.speedX += Math.cos(angle) * mouseInfluence * 0.5;
          particle.speedY += Math.sin(angle) * mouseInfluence * 0.5;
          particle.energy = Math.min(100, particle.energy + mouseInfluence * 20);
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += particle.pulseSpeed;
        particle.energy = Math.max(0, particle.energy - 0.5);

        // Boundary wrapping
        if (particle.x < -30) particle.x = canvas.width + 30;
        if (particle.x > canvas.width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = canvas.height + 30;
        if (particle.y > canvas.height + 30) particle.y = -30;

        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 12) {
          particle.trail.shift();
        }

        // Draw neon trail
        if (particle.trail.length > 2) {
          for (let i = 1; i < particle.trail.length; i++) {
            const trailAlpha = (i / particle.trail.length) * particle.alpha * 0.6;
            const trailSize = (i / particle.trail.length) * particle.size * 0.8;
            
            // Outer glow
            const trailGlow = ctx.createRadialGradient(
              particle.trail[i].x, particle.trail[i].y, 0,
              particle.trail[i].x, particle.trail[i].y, trailSize * 4
            );
            trailGlow.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${trailAlpha})`);
            trailGlow.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);

            ctx.beginPath();
            ctx.arc(particle.trail[i].x, particle.trail[i].y, trailSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = trailGlow;
            ctx.fill();
          }
        }

        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.6;
        const energyBoost = particle.energy / 100;
        const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.2 + energyBoost * 0.4;

        // Outer neon glow
        const outerGlow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, pulseSize * 8
        );
        outerGlow.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha * 0.8})`);
        outerGlow.addColorStop(0.3, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha * 0.4})`);
        outerGlow.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Inner bright glow
        const innerGlow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, pulseSize * 2
        );
        innerGlow.addColorStop(0, `rgba(255, 255, 255, ${pulseAlpha * 0.9})`);
        innerGlow.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha * 0.7})`);
        innerGlow.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();

        // Core particle
        if (particle.type === 'core') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseSize * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha * 1.2})`;
          ctx.fill();
        }
      });

      // Draw neon connections between particles
      for (let i = 0; i < neonParticles.length; i++) {
        const particle1 = neonParticles[i];
        for (let j = i + 1; j < neonParticles.length; j++) {
          const particle2 = neonParticles[j];
          
          const distance = Math.sqrt(
            (particle2.x - particle1.x) ** 2 + (particle2.y - particle1.y) ** 2
          );
          const maxDistance = 100;
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;
            const lineWidth = (1 - distance / maxDistance) * 2;
            
            // Create electric connection
            const gradient = ctx.createLinearGradient(
              particle1.x, particle1.y,
              particle2.x, particle2.y
            );
            gradient.addColorStop(0, `rgba(${particle1.color.r}, ${particle1.color.g}, ${particle1.color.b}, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(${particle2.color.r}, ${particle2.color.g}, ${particle2.color.b}, ${opacity})`);
            
            // Outer glow
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth * 3;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.3;
            ctx.stroke();
            
            // Inner bright line
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
        }
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

export default CyberAnimation5;
