
import { Shield, Lock, Eye, Zap, ArrowRight, Download, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import CyberAnimation from '../components/CyberAnimation';
import CyberAnimation2 from '../components/CyberAnimation2';
import CyberAnimation3 from '../components/CyberAnimation3';
import CyberAnimation4 from '../components/CyberAnimation4';
import CyberAnimation5 from '../components/CyberAnimation5';
import CyberAnimation6 from '../components/CyberAnimation6';
import ContainedLoader from '../components/ContainedLoader';
import ContainedLoader2 from '../components/ContainedLoader2';
import ContainedLoader3 from '../components/ContainedLoader3';
import ContainedLoader4 from '../components/ContainedLoader4';
import ContainedLoader5 from '../components/ContainedLoader5';
import ContainedLoader6 from '../components/ContainedLoader6';

const Home = () => {
  // Randomly pick animation theme on component mount
  const [animationTheme, setAnimationTheme] = useState<number>(1);

  useEffect(() => {
    // Always generate a new random theme when Home page is visited
    const randomTheme = Math.floor(Math.random() * 6) + 1;
    console.log(`New Animation Theme selected: ${randomTheme}`);
    setAnimationTheme(randomTheme);
    
    // Save to localStorage for other pages to use
    localStorage.setItem('t', randomTheme.toString());
  }, []);

  // Component mapping for animations and loaders
  const animations = {
    1: CyberAnimation,
    2: CyberAnimation2,
    3: CyberAnimation3,
    4: CyberAnimation4,      // Keep CyberAnimation4 but will update to red colors
    5: CyberAnimation5,
    6: CyberAnimation6,
  };

  const loaders = {
    1: ContainedLoader,
    2: ContainedLoader2,
    3: ContainedLoader3,
    4: ContainedLoader4,     // Keep ContainedLoader4 but will update to red colors
    5: ContainedLoader5,
    6: ContainedLoader6,
  };

  const SelectedAnimation = animations[animationTheme as keyof typeof animations];
  const SelectedLoader = loaders[animationTheme as keyof typeof loaders];

  const features = [
    {
      icon: Shield,
      title: "Penetration Testing",
      description: "Comprehensive security assessments to identify vulnerabilities before attackers do.",
      gradient: "from-red-500/20 to-orange-500/20"
    },
    {
      icon: Lock,
      title: "Security Architecture",
      description: "Design and implement robust security frameworks for modern infrastructures.",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Eye,
      title: "Threat Hunting",
      description: "Proactive threat detection using advanced analytics and behavioral analysis.",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: Zap,
      title: "Incident Response",
      description: "Rapid response and forensic analysis to minimize damage and prevent future attacks.",
      gradient: "from-green-500/20 to-emerald-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Full page particle animation */}
      <SelectedAnimation />
      
      {/* Gradient overlays for depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-gradient-to-tl from-red-500/5 via-transparent to-transparent pointer-events-none z-[1]" />
      
      <div className="pt-16 relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary/60 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-1 h-1 bg-red-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left side - Content */}
              <div className="text-center lg:text-left space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Available for new projects
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                      Cybersecurity
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent">
                      Engineer
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                    Protecting digital assets through advanced security engineering, 
                    threat detection, and strategic defense implementations.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="https://github.com/ankkiyy"
                    target="_blank"
                    className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 cyber-glow flex items-center justify-center gap-3 font-medium transform hover:scale-105"
                  >
                    <Github className="w-5 h-5" />
                    View GitHub
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="/resume.pdf"
                    download="Ankit-Prajapati-Resume.pdf"
                    className="group px-8 py-4 border border-primary/30 text-primary rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-3 font-medium backdrop-blur-sm transform hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    Download Resume
                  </a>
                </div>
                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 gap-8 pt-8">
                  {[
                    { value: "5+", label: "Security Audits", icon: "🛡️" },
                    { value: "99.9%", label: "Uptime Achieved", icon: "⚡" },
                    { value: "$1M+", label: "Breaches Prevented", icon: "💰" },
                    { value: "24/7", label: "Threat Monitoring", icon: "👁️" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center lg:text-left group">
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                        <span className="text-2xl">{stat.icon}</span>
                        <div className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-110 transition-transform">
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Enhanced Animation Container */}
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-20 h-20 border border-primary/20 rounded-full animate-spin-slow" />
                <div className="absolute -bottom-10 -left-10 w-16 h-16 border border-red-400/20 rounded-lg rotate-45 animate-float" />
                
                <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl group hover:shadow-primary/20 transition-all duration-500">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-red-500/10 opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-red-400/20 p-[1px] group-hover:from-primary/40 group-hover:to-red-400/40 transition-all duration-500">
                    <div className="w-full h-full bg-card/50 rounded-2xl" />
                  </div>
                  
                  <SelectedLoader />
                  
                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-primary/60" />
                  <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-primary/60" />
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-primary/60" />
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-primary/60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Services Section */}
        <section className="py-32 px-4 relative">
          {/* Section background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          
          <div className="max-w-7xl mx-auto relative">
            {/* Section header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Core Expertise
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                Security Solutions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive cybersecurity services designed to protect and secure your digital infrastructure
              </p>
            </div>

            {/* Enhanced feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card background with gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Main card */}
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 group hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Hover arrow */}
                    <div className="mt-6 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium mr-2">Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '100ms' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-20">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm hover:bg-primary/20 transition-all duration-300 cursor-pointer group">
                <span className="text-primary font-medium">Ready to secure your infrastructure?</span>
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
