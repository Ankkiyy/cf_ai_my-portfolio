
import { Shield, Lock, Eye, Zap } from 'lucide-react';
import CyberAnimation from '../components/CyberAnimation';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Penetration Testing",
      description: "Comprehensive security assessments to identify vulnerabilities before attackers do."
    },
    {
      icon: Lock,
      title: "Security Architecture",
      description: "Design and implement robust security frameworks for modern infrastructures."
    },
    {
      icon: Eye,
      title: "Threat Hunting",
      description: "Proactive threat detection using advanced analytics and behavioral analysis."
    },
    {
      icon: Zap,
      title: "Incident Response",
      description: "Rapid response and forensic analysis to minimize damage and prevent future attacks."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-16">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent">
                  Cybersecurity Engineer
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Protecting digital assets through advanced security engineering, 
                  threat detection, and strategic defense implementations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cyber-glow">
                    View Projects
                  </button>
                  <button className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                    Download Resume
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Security Audits</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime Achieved</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-primary mb-2">$50M+</div>
                    <div className="text-sm text-muted-foreground">Breaches Prevented</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Threat Monitoring</div>
                  </div>
                </div>
              </div>

              {/* Right side - Animation */}
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden border border-border bg-card">
                <CyberAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Core Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
                >
                  <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:animate-float" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
