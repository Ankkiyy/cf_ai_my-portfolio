import { useEffect, useRef } from 'react';

const ContainedLoader3 = () => {
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

    // Brain/Neural Network Loader Configuration (All Red)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) / 4;
    
    // Neural network nodes - reduced count
    const neurons = [];
    const numNeurons = 8;
    for (let i = 0; i < numNeurons; i++) {
      const angle = (i / numNeurons) * Math.PI * 2;
      const radius = baseRadius * (0.6 + Math.random() * 0.3);
      neurons.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        baseX: centerX + Math.cos(angle) * radius,
        baseY: centerY + Math.sin(angle) * radius,
        size: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.025 + 0.008,
        alpha: Math.random() * 0.5 + 0.3,
        connections: [],
        activity: 0,
        lastActivity: 0
      });
    }

    // Create neural connections - reduced count
    neurons.forEach((neuron, i) => {
      const numConnections = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * neurons.length);
        if (targetIndex !== i && !neuron.connections.includes(targetIndex)) {
          neuron.connections.push(targetIndex);
        }
      }
    });

    // Synaptic impulses
    const impulses = [];
    
    // Brain waves - reduced intensity
    const brainWaves = [
      { radius: baseRadius * 0.3, speed: 0.02, phase: 0, intensity: 0.7 },
      { radius: baseRadius * 0.5, speed: 0.015, phase: Math.PI, intensity: 0.5 },
    ];

    let time = 0;
    let animationId: number;

    const createImpulse = (fromIndex, toIndex) => {
      const from = neurons[fromIndex];
      const to = neurons[toIndex];
      impulses.push({
        fromX: from.x,
        fromY: from.y,
        toX: to.x,
        toY: to.y,
        progress: 0,
        speed: 0.015 + Math.random() * 0.015,
        alpha: 0.8,
        size: Math.random() * 1.5 + 0.8
      });
    };

    const animate = () => {
      // Clear with dark red neural background
      ctx.fillStyle = 'rgba(15, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Draw brain waves - reduced brightness
      brainWaves.forEach((wave, index) => {
        wave.phase += wave.speed;
        const waveIntensity = Math.sin(wave.phase) * wave.intensity;
        
        for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
          const waveRadius = wave.radius + Math.sin(angle * 4 + wave.phase) * 6;
          const x = centerX + Math.cos(angle) * waveRadius;
          const y = centerY + Math.sin(angle) * waveRadius;
          
          const waveAlpha = Math.abs(waveIntensity) * 0.2;
          
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160, 30, 30, ${waveAlpha})`;
          ctx.fill();
        }
      });

      // Update neural activity - reduced frequency
      if (Math.random() < 0.03) {
        const activeNeuron = Math.floor(Math.random() * neurons.length);
        neurons[activeNeuron].activity = 80;
        neurons[activeNeuron].lastActivity = time;
        
        // Create impulses to connected neurons
        neurons[activeNeuron].connections.forEach(connectionIndex => {
          createImpulse(activeNeuron, connectionIndex);
        });
      }

      // Update and draw synaptic impulses
      for (let i = impulses.length - 1; i >= 0; i--) {
        const impulse = impulses[i];
        impulse.progress += impulse.speed;
        impulse.alpha = Math.max(0, 1 - impulse.progress);
        
        if (impulse.progress >= 1) {
          // Impulse reached target, activate target neuron
          const targetNeuron = neurons.find(n => 
            Math.abs(n.x - impulse.toX) < 5 && Math.abs(n.y - impulse.toY) < 5
          );
          if (targetNeuron) {
            targetNeuron.activity = Math.min(80, targetNeuron.activity + 25);
            targetNeuron.lastActivity = time;
          }
          impulses.splice(i, 1);
          continue;
        }
        
        const currentX = impulse.fromX + (impulse.toX - impulse.fromX) * impulse.progress;
        const currentY = impulse.fromY + (impulse.toY - impulse.fromY) * impulse.progress;
        
        // Draw impulse with trail - reduced brightness
        const trailLength = 6;
        for (let t = 0; t < trailLength; t++) {
          const trailProgress = Math.max(0, impulse.progress - (t * 0.025));
          const trailX = impulse.fromX + (impulse.toX - impulse.fromX) * trailProgress;
          const trailY = impulse.fromY + (impulse.toY - impulse.fromY) * trailProgress;
          const trailAlpha = impulse.alpha * (1 - t / trailLength) * 0.6;
          const trailSize = impulse.size * (1 - t / trailLength);
          
          if (trailProgress > 0) {
            ctx.beginPath();
            ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 60, 60, ${trailAlpha})`;
            ctx.fill();
          }
        }
        
        // Draw main impulse - reduced brightness
        const impulseGlow = ctx.createRadialGradient(
          currentX, currentY, 0,
          currentX, currentY, impulse.size * 3
        );
        impulseGlow.addColorStop(0, `rgba(200, 100, 100, ${impulse.alpha})`);
        impulseGlow.addColorStop(0.5, `rgba(160, 30, 30, ${impulse.alpha * 0.6})`);
        impulseGlow.addColorStop(1, `rgba(120, 15, 15, 0)`);
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, impulse.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = impulseGlow;
        ctx.fill();
      }

      // Draw neural connections
      neurons.forEach((neuron, i) => {
        neuron.connections.forEach(connectionIndex => {
          const target = neurons[connectionIndex];
          const distance = Math.sqrt(
            (target.x - neuron.x) ** 2 + (target.y - neuron.y) ** 2
          );
          
          const baseAlpha = 0.15;
          const activityAlpha = (neuron.activity + target.activity) / 200 * 0.3;
          const totalAlpha = Math.min(0.6, baseAlpha + activityAlpha);
          
          // Draw synaptic connection - reduced brightness
          const gradient = ctx.createLinearGradient(
            neuron.x, neuron.y, target.x, target.y
          );
          gradient.addColorStop(0, `rgba(160, 30, 30, ${totalAlpha})`);
          gradient.addColorStop(0.5, `rgba(180, 50, 50, ${totalAlpha * 0.7})`);
          gradient.addColorStop(1, `rgba(160, 30, 30, ${totalAlpha})`);
          
          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.8 + activityAlpha * 1.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
      });

      // Update and draw neurons
      neurons.forEach((neuron, index) => {
        neuron.pulse += neuron.pulseSpeed;
        neuron.activity = Math.max(0, neuron.activity - 1);
        
        // Slight movement for organic feel
        neuron.x = neuron.baseX + Math.sin(time + index) * 2;
        neuron.y = neuron.baseY + Math.cos(time + index * 0.7) * 2;
        
        const activityLevel = neuron.activity / 100;
        const pulseSize = neuron.size + Math.sin(neuron.pulse) * 0.6 + activityLevel * 1.5;
        const pulseAlpha = neuron.alpha + Math.sin(neuron.pulse) * 0.15 + activityLevel * 0.4;
        
        // Neuron glow based on activity - reduced intensity
        const neuronGlow = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, pulseSize * 4
        );
        neuronGlow.addColorStop(0, `rgba(180, ${70 + activityLevel * 70}, ${70 + activityLevel * 70}, ${pulseAlpha})`);
        neuronGlow.addColorStop(0.3, `rgba(160, 30, 30, ${pulseAlpha * 0.6})`);
        neuronGlow.addColorStop(0.7, `rgba(120, 15, 15, ${pulseAlpha * 0.3})`);
        neuronGlow.addColorStop(1, `rgba(80, 8, 8, 0)`);
        
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = neuronGlow;
        ctx.fill();
        
        // Neuron body - reduced brightness
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, ${90 + activityLevel * 60}, ${90 + activityLevel * 60}, ${pulseAlpha})`;
        ctx.fill();
        
        // Neuron core - reduced brightness
        if (activityLevel > 0.25) {
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, pulseSize * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 150, 150, ${pulseAlpha})`;
          ctx.fill();
        }
      });

      // Draw central brain core - reduced brightness
      const coreSize = 15 + Math.sin(time * 1.8) * 4;
      const corePulse = Math.sin(time * 2.5) * 0.25 + 0.6;
      
      const brainCoreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreSize * 1.8
      );
      brainCoreGradient.addColorStop(0, `rgba(200, 120, 120, ${corePulse})`);
      brainCoreGradient.addColorStop(0.4, `rgba(160, 30, 30, ${corePulse * 0.7})`);
      brainCoreGradient.addColorStop(0.8, `rgba(120, 15, 15, ${corePulse * 0.3})`);
      brainCoreGradient.addColorStop(1, `rgba(80, 8, 8, 0)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = brainCoreGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 100, 100, ${corePulse})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 150, 150, 0.9)`;
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
        background: 'radial-gradient(circle at center, rgba(120, 15, 15, 0.06) 0%, rgba(10, 3, 3, 0.9) 70%, rgba(5, 0, 0, 1) 100%)' 
      }}
    />
  );
};

export default ContainedLoader3;
