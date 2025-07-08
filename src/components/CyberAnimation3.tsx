import { useEffect, useRef } from 'react';

const CyberAnimation3 = () => {
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

    // Neural network brain-inspired system
    const neurons = [];
    const synapses = [];
    const brainWaves = [];
    const mousePosition = { x: 0, y: 0 };
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Create neurons (brain cells) - reduced count for less brightness
    for (let i = 0; i < 50; i++) {
      neurons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        connections: [],
        activity: Math.random(),
        activitySpeed: Math.random() * 0.015 + 0.008,
        dendrites: [],
        type: Math.random() > 0.8 ? 'active' : 'dormant'
      });
    }

    // Create dendrites for each neuron - reduced count
    neurons.forEach(neuron => {
      const dendriteCount = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < dendriteCount; i++) {
        const angle = (i / dendriteCount) * Math.PI * 2 + Math.random() * 0.4;
        const length = Math.random() * 20 + 10;
        neuron.dendrites.push({
          angle,
          length,
          segments: Math.floor(Math.random() * 2) + 2,
          pulse: Math.random() * Math.PI * 2
        });
      }
    });

    // Create synaptic connections - reduced count
    neurons.forEach((neuron, index) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < connectionCount; i++) {
        const targetIndex = Math.floor(Math.random() * neurons.length);
        if (targetIndex !== index) {
          const target = neurons[targetIndex];
          const distance = Math.sqrt(
            (target.x - neuron.x) ** 2 + (target.y - neuron.y) ** 2
          );
          
          if (distance < 180) {
            neuron.connections.push({
              target: targetIndex,
              strength: Math.random() * 0.6 + 0.15,
              pulse: Math.random() * Math.PI * 2,
              pulseSpeed: Math.random() * 0.04 + 0.015,
              lastFired: 0
            });
          }
        }
      }
    });

    // Create brain wave patterns - reduced count and intensity
    for (let i = 0; i < 3; i++) {
      brainWaves.push({
        y: Math.random() * canvas.height,
        amplitude: Math.random() * 30 + 15,
        frequency: Math.random() * 0.015 + 0.008,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.3 + 0.15,
        alpha: Math.random() * 0.2 + 0.08
      });
    }

    let time = 0;
    let animationId: number;

    const animate = () => {
      // Dark background with slight red tint
      ctx.fillStyle = 'rgba(10, 5, 5, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Draw brain waves - reduced brightness
      brainWaves.forEach((wave, index) => {
        wave.phase += wave.frequency;
        
        ctx.strokeStyle = `rgba(180, ${60 + index * 15}, ${60 + index * 15}, ${wave.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 8) {
          const y = wave.y + Math.sin((x * 0.008) + wave.phase) * wave.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Update neurons
      neurons.forEach((neuron) => {
        neuron.pulse += neuron.pulseSpeed;
        neuron.activity += neuron.activitySpeed;
        
        // Mouse interaction - stimulate nearby neurons
        const mouseDistance = Math.sqrt(
          (mousePosition.x - neuron.x) ** 2 + (mousePosition.y - neuron.y) ** 2
        );
        const mouseInfluence = Math.max(0, 150 - mouseDistance) / 150;
        
        if (mouseInfluence > 0) {
          neuron.activity += mouseInfluence * 0.05;
          neuron.type = 'active';
        }

        // Clamp activity
        if (neuron.activity > Math.PI * 2) neuron.activity = 0;
      });

      // Draw synaptic connections
      neurons.forEach((neuron, neuronIndex) => {
        neuron.connections.forEach((connection) => {
          const target = neurons[connection.target];
          connection.pulse += connection.pulseSpeed;
          
          const activity = Math.sin(neuron.activity) * Math.sin(target.activity);
          const lineAlpha = connection.strength * 0.2 + activity * 0.25;
          
          if (lineAlpha > 0.08) {
            // Neural pathway - reduced brightness
            const gradient = ctx.createLinearGradient(
              neuron.x, neuron.y,
              target.x, target.y
            );
            gradient.addColorStop(0, `rgba(180, 60, 60, ${lineAlpha})`);
            gradient.addColorStop(0.5, `rgba(200, 80, 80, ${lineAlpha * 0.7})`);
            gradient.addColorStop(1, `rgba(180, 60, 60, ${lineAlpha})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = connection.strength * 1.5;
            ctx.lineCap = 'round';
            
            // Reduced glow
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#cc4444';
            
            ctx.beginPath();
            ctx.moveTo(neuron.x, neuron.y);
            
            // Create curved connection (more brain-like)
            const midX = (neuron.x + target.x) / 2 + Math.sin(connection.pulse) * 20;
            const midY = (neuron.y + target.y) / 2 + Math.cos(connection.pulse) * 20;
            ctx.quadraticCurveTo(midX, midY, target.x, target.y);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Synapse firing effect - reduced frequency and intensity
            if (activity > 0.6 && Math.random() < 0.015) {
              const synapseX = midX + (Math.random() - 0.5) * 8;
              const synapseY = midY + (Math.random() - 0.5) * 8;
              
              synapses.push({
                x: synapseX,
                y: synapseY,
                size: 0,
                maxSize: Math.random() * 10 + 6,
                alpha: 0.8,
                lifespan: 18
              });
            }
          }
        });
      });

      // Draw synaptic firing effects
      synapses.forEach((synapse, index) => {
        synapse.size += synapse.maxSize / synapse.lifespan;
        synapse.alpha -= 1 / synapse.lifespan;
        
        if (synapse.alpha <= 0) {
          synapses.splice(index, 1);
          return;
        }

        const gradient = ctx.createRadialGradient(
          synapse.x, synapse.y, 0,
          synapse.x, synapse.y, synapse.size
        );
        gradient.addColorStop(0, `rgba(200, 120, 120, ${synapse.alpha})`);
        gradient.addColorStop(0.5, `rgba(180, 80, 80, ${synapse.alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(160, 60, 60, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(synapse.x, synapse.y, synapse.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw neurons
      neurons.forEach((neuron) => {
        const pulseSize = neuron.size + Math.sin(neuron.pulse) * 1;
        const activity = Math.sin(neuron.activity);
        const activityAlpha = neuron.alpha + activity * 0.5;
        
        // Draw dendrites
        neuron.dendrites.forEach((dendrite) => {
          dendrite.pulse += 0.03;
          const dendriteActivity = activity * 0.5 + 0.5;
          
          ctx.strokeStyle = `rgba(180, 80, 80, ${dendriteActivity * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.lineCap = 'round';
          
          let currentX = neuron.x;
          let currentY = neuron.y;
          
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          
          for (let i = 0; i < dendrite.segments; i++) {
            const segmentLength = dendrite.length / dendrite.segments;
            const angle = dendrite.angle + Math.sin(dendrite.pulse + i) * 0.3;
            
            currentX += Math.cos(angle) * segmentLength;
            currentY += Math.sin(angle) * segmentLength;
            ctx.lineTo(currentX, currentY);
          }
          ctx.stroke();
        });

        // Neuron body glow - reduced intensity
        const glowGradient = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, pulseSize * 3
        );
        
        if (neuron.type === 'active') {
          glowGradient.addColorStop(0, `rgba(200, 100, 100, ${activityAlpha * 0.6})`);
          glowGradient.addColorStop(0.3, `rgba(180, 80, 80, ${activityAlpha * 0.4})`);
          glowGradient.addColorStop(0.7, `rgba(160, 60, 60, ${activityAlpha * 0.15})`);
        } else {
          glowGradient.addColorStop(0, `rgba(180, 70, 70, ${activityAlpha * 0.3})`);
          glowGradient.addColorStop(0.5, `rgba(150, 50, 50, ${activityAlpha * 0.15})`);
        }
        glowGradient.addColorStop(1, `rgba(120, 40, 40, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, pulseSize * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Neuron core - reduced brightness
        ctx.fillStyle = `rgba(180, ${100 + activity * 40}, ${100 + activity * 40}, ${activityAlpha})`;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Nucleus - reduced brightness
        if (neuron.type === 'active') {
          ctx.fillStyle = `rgba(220, 200, 200, ${activityAlpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, pulseSize * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      });

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

export default CyberAnimation3;
