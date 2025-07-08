import { useEffect, useRef } from 'react';

const ContainedLoader4 = () => {
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

    // Matrix Digital Rain Loader Configuration
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) / 4;
    
    // Matrix characters
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    
    // Digital rain streams
    const rainStreams = [];
    const numStreams = 8;
    for (let i = 0; i < numStreams; i++) {
      const angle = (i / numStreams) * Math.PI * 2;
      rainStreams.push({
        x: centerX + Math.cos(angle) * baseRadius * 0.8,
        y: centerY + Math.sin(angle) * baseRadius * 0.8,
        characters: [],
        speed: Math.random() * 0.5 + 0.3,
        angle: angle,
        radius: baseRadius * 0.8
      });
      
      // Initialize characters for each stream
      for (let j = 0; j < 12; j++) {
        rainStreams[i].characters.push({
          char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
          alpha: Math.random(),
          changeTime: Math.random() * 100
        });
      }
    }

    // Circular scan lines
    const scanLines = [
      { radius: baseRadius * 0.3, speed: 0.08, thickness: 2 },
      { radius: baseRadius * 0.5, speed: -0.06, thickness: 3 },
      { radius: baseRadius * 0.7, speed: 0.04, thickness: 4 },
      { radius: baseRadius * 0.9, speed: -0.03, thickness: 2 },
    ];

    // Glitch effects
    const glitches = [];
    for (let i = 0; i < 5; i++) {
      glitches.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 60 + 20,
        height: Math.random() * 4 + 2,
        alpha: 0,
        duration: 0,
        maxDuration: Math.random() * 20 + 10
      });
    }

    // CRT effect lines
    const crtLines = [];
    for (let i = 0; i < canvas.height; i += 4) {
      crtLines.push({
        y: i,
        alpha: Math.random() * 0.1 + 0.05
      });
    }

    let rotation = 0;
    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear with dark red digital background
      ctx.fillStyle = 'rgba(5, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotation += 0.015;
      time += 0.02;

      // Draw CRT scan lines
      crtLines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(0, line.y);
        ctx.lineTo(canvas.width, line.y);
        ctx.strokeStyle = `rgba(255, 0, 0, ${line.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw circular scan lines
      scanLines.forEach((scanLine, index) => {
        const currentRotation = rotation * scanLine.speed + (index * Math.PI / 2);
        const breathe = Math.sin(time + index) * 0.1 + 1;
        const adjustedRadius = scanLine.radius * breathe;
        
        // Rotating scan beam
        const startAngle = currentRotation;
        const endAngle = currentRotation + Math.PI / 6;
        
        const scanGradient = ctx.createRadialGradient(
          centerX, centerY, adjustedRadius - 10,
          centerX, centerY, adjustedRadius + 10
        );
        scanGradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
        scanGradient.addColorStop(0.5, `rgba(255, 100, 100, 0.6)`);
        scanGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
        ctx.lineWidth = scanLine.thickness * 2;
        ctx.strokeStyle = scanGradient;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright scan line
        ctx.beginPath();
        ctx.arc(centerX, centerY, adjustedRadius, startAngle, endAngle);
        ctx.lineWidth = scanLine.thickness;
        ctx.strokeStyle = `rgba(255, 150, 150, 0.9)`;
        ctx.stroke();
      });

      // Update and draw digital rain streams
      rainStreams.forEach((stream, streamIndex) => {
        stream.angle += stream.speed * 0.02;
        stream.x = centerX + Math.cos(stream.angle) * stream.radius;
        stream.y = centerY + Math.sin(stream.angle) * stream.radius;
        
        stream.characters.forEach((char, charIndex) => {
          char.changeTime--;
          if (char.changeTime <= 0) {
            char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            char.changeTime = Math.random() * 60 + 20;
          }
          
          const charX = stream.x + (charIndex - 6) * 8;
          const charY = stream.y + Math.sin(time + streamIndex + charIndex * 0.5) * 10;
          const distance = Math.sqrt((charX - centerX) ** 2 + (charY - centerY) ** 2);
          const alphaByDistance = Math.max(0, 1 - distance / (baseRadius * 1.2));
          
          char.alpha = Math.min(1, char.alpha + (Math.random() - 0.5) * 0.1);
          char.alpha = Math.max(0.2, char.alpha);
          
          const finalAlpha = char.alpha * alphaByDistance;
          
          // Character glow
          ctx.font = '14px monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(255, 100, 100, ${finalAlpha * 0.3})`;
          ctx.fillText(char.char, charX + 1, charY + 1);
          ctx.fillText(char.char, charX - 1, charY - 1);
          
          // Character core
          ctx.fillStyle = `rgba(255, 150, 150, ${finalAlpha})`;
          ctx.fillText(char.char, charX, charY);
        });
      });

      // Handle glitch effects
      glitches.forEach((glitch) => {
        glitch.duration++;
        
        if (glitch.duration >= glitch.maxDuration) {
          if (Math.random() < 0.08) { // Random glitch occurrence
            glitch.x = Math.random() * canvas.width;
            glitch.y = Math.random() * canvas.height;
            glitch.width = Math.random() * 60 + 20;
            glitch.height = Math.random() * 4 + 2;
            glitch.duration = 0;
            glitch.alpha = 0.8;
            glitch.maxDuration = Math.random() * 15 + 5;
          }
        } else {
          glitch.alpha = Math.max(0, 0.8 - (glitch.duration / glitch.maxDuration));
          
          if (glitch.alpha > 0) {
            // Draw glitch rectangles
            ctx.fillStyle = `rgba(255, 100, 100, ${glitch.alpha})`;
            ctx.fillRect(glitch.x, glitch.y, glitch.width, glitch.height);
            
            // Additional glitch offset rectangles
            ctx.fillStyle = `rgba(255, 150, 150, ${glitch.alpha * 0.5})`;
            ctx.fillRect(glitch.x + 2, glitch.y + 1, glitch.width, glitch.height);
            
            ctx.fillStyle = `rgba(200, 100, 100, ${glitch.alpha * 0.3})`;
            ctx.fillRect(glitch.x - 1, glitch.y - 1, glitch.width, glitch.height);
          }
        }
      });

      // Draw central matrix core
      const coreSize = 20 + Math.sin(time * 3) * 6;
      const corePulse = Math.sin(time * 4) * 0.3 + 0.7;
      
      // Matrix core with digital effect
      const matrixCoreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreSize * 2.5
      );
      matrixCoreGradient.addColorStop(0, `rgba(255, 200, 200, ${corePulse})`);
      matrixCoreGradient.addColorStop(0.3, `rgba(255, 100, 100, ${corePulse * 0.8})`);
      matrixCoreGradient.addColorStop(0.7, `rgba(180, 80, 80, ${corePulse * 0.4})`);
      matrixCoreGradient.addColorStop(1, `rgba(100, 50, 50, 0)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = matrixCoreGradient;
      ctx.fill();

      // Core segments
      for (let i = 0; i < 8; i++) {
        const segmentAngle = (i / 8) * Math.PI * 2 + time;
        const segmentX = centerX + Math.cos(segmentAngle) * coreSize * 0.7;
        const segmentY = centerY + Math.sin(segmentAngle) * coreSize * 0.7;
        
        ctx.beginPath();
        ctx.arc(segmentX, segmentY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 180, ${corePulse})`;
        ctx.fill();
      }

      // Central bright core
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${corePulse * 0.9})`;
      ctx.fill();

      // Draw matrix symbol in center
      ctx.font = `${coreSize * 0.8}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(0, 0, 0, ${corePulse * 0.8})`;
      const centerChar = matrixChars[Math.floor(time * 10) % matrixChars.length];
      ctx.fillText(centerChar, centerX, centerY);

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
        background: 'radial-gradient(circle at center, rgba(100, 0, 0, 0.08) 0%, rgba(10, 0, 0, 0.95) 70%, rgba(0, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default ContainedLoader4;
