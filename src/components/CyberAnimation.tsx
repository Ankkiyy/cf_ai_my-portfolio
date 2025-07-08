
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

    // Enhanced particles system
    const freeParticles = [];
    const mousePosition = { x: 0, y: 0 };
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Create more sophisticated particle system
    for (let i = 0; i < 40; i++) {
      freeParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 1.2,
        baseSpeedX: (Math.random() - 0.5) * 1.2,
        baseSpeedY: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        trail: [],
        color: {
          r: 220 + Math.random() * 35,
          g: 38 + Math.random() * 42,
          b: 38 + Math.random() * 42
        },
        type: Math.random() > 0.7 ? 'special' : 'normal'
      });
    }

    // Create static network nodes for background depth
    const networkNodes = [];
    for (let i = 0; i < 15; i++) {
      networkNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.01 + 0.005
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear canvas with subtle fade effect
      ctx.fillStyle = 'rgba(8, 8, 8, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Draw background network nodes first
      networkNodes.forEach((node) => {
        node.pulse += node.pulseSpeed;
        const pulseAlpha = node.alpha + Math.sin(node.pulse) * 0.1;
        
        // Static glow effect
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 8
        );
        glowGradient.addColorStop(0, `rgba(180, 180, 180, ${pulseAlpha * 0.3})`);
        glowGradient.addColorStop(1, `rgba(180, 180, 180, 0)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      });

      // Draw network connections between static nodes
      for (let i = 0; i < networkNodes.length; i++) {
        const node1 = networkNodes[i];
        for (let j = i + 1; j < networkNodes.length; j++) {
          const node2 = networkNodes[j];
          
          const distance = Math.sqrt(
            (node2.x - node1.x) ** 2 + (node2.y - node1.y) ** 2
          );
          const maxDistance = 300;
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.05;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(120, 120, 120, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw enhanced free-floating particles
      freeParticles.forEach((particle) => {
        // Mouse interaction effect
        const mouseDistance = Math.sqrt(
          (mousePosition.x - particle.x) ** 2 + (mousePosition.y - particle.y) ** 2
        );
        const mouseInfluence = Math.max(0, 100 - mouseDistance) / 100;
        
        // Apply mouse influence to movement
        if (mouseInfluence > 0) {
          const angle = Math.atan2(particle.y - mousePosition.y, particle.x - mousePosition.x);
          particle.speedX = particle.baseSpeedX + Math.cos(angle) * mouseInfluence * 2;
          particle.speedY = particle.baseSpeedY + Math.sin(angle) * mouseInfluence * 2;
        } else {
          // Gradually return to base speed
          particle.speedX += (particle.baseSpeedX - particle.speedX) * 0.02;
          particle.speedY += (particle.baseSpeedY - particle.speedY) * 0.02;
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += particle.pulseSpeed;

        // Smooth edge wrapping instead of bouncing
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;

        // Update trail with improved smoothing
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 8) {
          particle.trail.shift();
        }

        // Draw enhanced particle trail
        if (particle.trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
          
          // Use quadratic curves for smoother trails
          for (let i = 1; i < particle.trail.length - 1; i++) {
            const cp1x = (particle.trail[i].x + particle.trail[i + 1].x) / 2;
            const cp1y = (particle.trail[i].y + particle.trail[i + 1].y) / 2;
            ctx.quadraticCurveTo(particle.trail[i].x, particle.trail[i].y, cp1x, cp1y);
          }
          
          const trailAlpha = particle.alpha * 0.4 * (1 + mouseInfluence * 0.5);
          ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${trailAlpha})`;
          ctx.lineWidth = particle.size * 0.4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        const pulseSize = particle.size + Math.sin(particle.pulse) * 0.4;
        const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.15 + mouseInfluence * 0.3;

        // Enhanced glowing effect with better gradients
        const glowSize = particle.type === 'special' ? pulseSize * 4 : pulseSize * 3;
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        if (particle.type === 'special') {
          glowGradient.addColorStop(0, `rgba(${particle.color.r + 35}, ${particle.color.g + 20}, ${particle.color.b + 60}, ${pulseAlpha * 0.8})`);
          glowGradient.addColorStop(0.3, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b + 40}, ${pulseAlpha * 0.5})`);
          glowGradient.addColorStop(0.7, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha * 0.2})`);
        } else {
          glowGradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g + 40}, ${particle.color.b + 40}, ${pulseAlpha * 0.7})`);
          glowGradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${pulseAlpha * 0.4})`);
        }
        glowGradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);

        // Draw outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw core particle with enhanced brightness
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        const coreAlpha = pulseAlpha * (particle.type === 'special' ? 1.2 : 0.9);
        ctx.fillStyle = `rgba(${Math.min(255, particle.color.r + 50)}, ${Math.min(255, particle.color.g + 80)}, ${Math.min(255, particle.color.b + 80)}, ${coreAlpha})`;
        ctx.fill();

        // Add inner bright core for special particles
        if (particle.type === 'special') {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseSize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha * 0.6})`;
          ctx.fill();
        }
      });

      // Draw dynamic connection lines between moving particles
      for (let i = 0; i < freeParticles.length; i++) {
        const particle1 = freeParticles[i];
        for (let j = i + 1; j < freeParticles.length; j++) {
          const particle2 = freeParticles[j];
          
          const distance = Math.sqrt(
            (particle2.x - particle1.x) ** 2 + (particle2.y - particle1.y) ** 2
          );
          const maxDistance = 120;
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            const lineWidth = (1 - distance / maxDistance) * 1.2;
            
            // Create gradient line
            const gradient = ctx.createLinearGradient(
              particle1.x, particle1.y,
              particle2.x, particle2.y
            );
            gradient.addColorStop(0, `rgba(${particle1.color.r}, ${particle1.color.g}, ${particle1.color.b}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${particle2.color.r}, ${particle2.color.g}, ${particle2.color.b}, ${opacity})`);
            
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
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

export default CyberAnimation;
