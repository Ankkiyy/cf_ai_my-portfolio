import { useEffect, useRef } from 'react';

const CyberAnimation4 = () => {
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

    // Matrix-style digital rain with cyberpunk elements
    const columns = Math.floor(canvas.width / 40); // Reduce columns by half (was /20)
    const drops = [];
    const glitchLines = [];
    const scanLines = [];
    const mousePosition = { x: 0, y: 0 };
    
    // Characters for the matrix effect
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops.push({
        x: i * 40, // Update spacing to match new column width
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 0.5, // Slightly slower speed
        chars: [],
        length: Math.random() * 20 + 8, // Shorter trails (was 30 + 10)
        brightness: Math.random() * 0.4 + 0.3, // Dimmer overall
        glitchChance: Math.random() * 0.01 // Less glitching
      });
    }

    // Create scanning lines (reduce number)
    for (let i = 0; i < 2; i++) { // Reduced from 3
      scanLines.push({
        y: Math.random() * canvas.height,
        speed: Math.random() * 1.5 + 0.3, // Slower
        alpha: Math.random() * 0.2 + 0.05, // Dimmer
        thickness: Math.random() * 2 + 0.5 // Thinner
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Black background with slight red tint
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.03;

      // Draw scanning lines
      scanLines.forEach((line) => {
        line.y += line.speed;
        if (line.y > canvas.height + 50) {
          line.y = -50;
        }

        // Main scan line
        const gradient = ctx.createLinearGradient(0, line.y - 20, 0, line.y + 20);
        gradient.addColorStop(0, `rgba(255, 0, 0, 0)`);
        gradient.addColorStop(0.5, `rgba(255, 100, 100, ${line.alpha})`);
        gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, line.y - line.thickness, canvas.width, line.thickness * 2);

        // Flicker effect
        if (Math.random() < 0.1) {
          ctx.fillStyle = `rgba(255, 255, 255, ${line.alpha * 0.5})`;
          ctx.fillRect(0, line.y - 1, canvas.width, 2);
        }
      });

      // Create glitch effects (reduce frequency)
      if (Math.random() < 0.005) { // Reduced from 0.01
        glitchLines.push({
          y: Math.random() * canvas.height,
          width: Math.random() * 150 + 30, // Smaller glitch lines
          x: Math.random() * canvas.width,
          life: 3, // Shorter life
          maxLife: 3
        });
      }

      // Draw and update glitch effects
      glitchLines.forEach((glitch, index) => {
        glitch.life--;
        if (glitch.life <= 0) {
          glitchLines.splice(index, 1);
          return;
        }

        const alpha = glitch.life / glitch.maxLife;
        ctx.fillStyle = `rgba(255, 0, 100, ${alpha * 0.4})`; // Dimmer glitch
        ctx.fillRect(glitch.x, glitch.y, glitch.width, 2);
        
        // Reduce digital noise
        for (let i = 0; i < 5; i++) { // Reduced from 10
          const noiseX = glitch.x + Math.random() * glitch.width;
          const noiseY = glitch.y + (Math.random() - 0.5) * 10;
          ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${alpha * 0.5})`;
          ctx.fillRect(noiseX, noiseY, 2, 2);
        }
      });

      // Update and draw matrix drops
      drops.forEach((drop) => {
        // Mouse interaction - drops slow down near cursor
        const mouseDistance = Math.sqrt(
          (mousePosition.x - drop.x) ** 2 + (mousePosition.y - drop.y) ** 2
        );
        const mouseInfluence = Math.max(0, 100 - mouseDistance) / 100;
        const adjustedSpeed = drop.speed * (1 - mouseInfluence * 0.8);

        drop.y += adjustedSpeed;

        // Reset drop when it goes off screen
        if (drop.y > canvas.height + drop.length * 20) {
          drop.y = -drop.length * 20;
          drop.speed = Math.random() * 3 + 1;
          drop.chars = [];
          drop.length = Math.random() * 30 + 10;
          drop.brightness = Math.random() * 0.5 + 0.5;
        }

        // Generate characters for the drop
        while (drop.chars.length < drop.length) {
          drop.chars.push({
            char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
            age: 0
          });
        }

        // Draw the drop
        for (let i = 0; i < drop.chars.length; i++) {
          const char = drop.chars[i];
          const y = drop.y - i * 20;
          
          if (y > -20 && y < canvas.height + 20) {
            // Calculate alpha based on position in drop
            const headAlpha = i === 0 ? 1 : (drop.length - i) / drop.length;
            const finalAlpha = headAlpha * drop.brightness;
            
            // Leading character is brighter/white
            if (i === 0) {
              ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#ffffff';
            } else if (i < 3) {
              // Near head characters are bright red
              ctx.fillStyle = `rgba(255, 150, 150, ${finalAlpha})`;
              ctx.shadowBlur = 5;
              ctx.shadowColor = '#ff6464';
            } else {
              // Tail characters are darker red
              ctx.fillStyle = `rgba(255, 100, 100, ${finalAlpha * 0.7})`;
              ctx.shadowBlur = 0;
            }

            // Add glitch effect
            if (Math.random() < drop.glitchChance) {
              char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
              ctx.fillStyle = `rgba(255, 100, 100, ${finalAlpha})`;
            }

            ctx.font = '18px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(char.char, drop.x + 10, y);
            ctx.shadowBlur = 0;

            char.age++;
            
            // Occasionally change characters
            if (Math.random() < 0.05) {
              char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            }
          }
        }

        // Create wake effect behind mouse
        if (mouseInfluence > 0) {
          const wakeGradient = ctx.createRadialGradient(
            mousePosition.x, mousePosition.y, 0,
            mousePosition.x, mousePosition.y, 100
          );
          wakeGradient.addColorStop(0, `rgba(255, 100, 100, ${mouseInfluence * 0.3})`);
          wakeGradient.addColorStop(1, `rgba(255, 100, 100, 0)`);
          
          ctx.fillStyle = wakeGradient;
          ctx.beginPath();
          ctx.arc(mousePosition.x, mousePosition.y, 80, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Add occasional screen flicker
      if (Math.random() < 0.005) {
        ctx.fillStyle = `rgba(255, 100, 100, 0.1)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Add CRT screen curvature effect (subtle vignette)
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

export default CyberAnimation4;
