import { Shield, Lock, Eye, Zap, ArrowRight, Download, Github, Youtube, Twitter, Mail, Linkedin, Code2, BookOpen } from 'lucide-react';
import CyberAnimation6 from '../components/CyberAnimation6';
import ContainedLoader6 from '../components/ContainedLoader6';

const Home = () => {
  const SelectedAnimation = CyberAnimation6;
  const SelectedLoader = ContainedLoader6;

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
      
      <div className="pt-24 relative z-10">
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
          </div>
        </section>

        {/* Social Links & Creator Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                Connect with<br />
                <span className="bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent">Ankit Prajapati (Ankkiyy)</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Follow <a href="https://x.com/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Ankkiyy</a> across all platforms to connect with Ankit Prajapati and get cybersecurity insights, content, and industry expertise
              </p>
            </div>

            {/* Social Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
              {/* GitHub Card */}
              <a
                href="https://github.com/ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-primary/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Github className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">GitHub</h3>
                  <p className="text-sm text-muted-foreground mb-4">@ankkiyy - Open source projects & code</p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 gap-0 transition-all">
                    <span>Visit</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>

              {/* YouTube Card */}
              <a
                href="https://youtube.com/@ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-red-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-red-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Youtube className="w-12 h-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">YouTube</h3>
                  <p className="text-sm text-muted-foreground mb-4">@ankkiyy - Cybersecurity tutorials & content</p>
                  <div className="flex items-center text-red-500 text-sm font-medium group-hover:gap-2 gap-0 transition-all">
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>

              {/* X/Twitter Card */}
              <a
                href="https://x.com/ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-blue-400/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-400/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Twitter className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">X (Twitter)</h3>
                  <p className="text-sm text-muted-foreground mb-4">@ankkiyy - Security insights & updates</p>
                  <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 gap-0 transition-all">
                    <span>Follow</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:me@ankkiyy.com"
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-green-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-green-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Mail className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground mb-4">me@ankkiyy.com - Direct contact</p>
                  <div className="flex items-center text-green-500 text-sm font-medium group-hover:gap-2 gap-0 transition-all">
                    <span>Contact</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-sky-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Linkedin className="w-12 h-12 text-sky-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">LinkedIn</h3>
                  <p className="text-sm text-muted-foreground mb-4">@ankkiyy - Professional security updates</p>
                  <div className="flex items-center text-sky-500 text-sm font-medium group-hover:gap-2 gap-0 transition-all">
                    <span>Connect</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>

              {/* Dev.to Card */}
              <a
                href="https://dev.to/ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-orange-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-orange-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Code2 className="w-12 h-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Dev.to</h3>
                  <p className="text-sm text-muted-foreground mb-4">@ankkiyy - Practical cybersecurity writeups</p>
                  <div className="flex items-center text-orange-500 text-sm font-medium group-hover:gap-2 gap-0 transition-all">
                    <span>Read</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>

              {/* Medium Card */}
              <a
                href="https://medium.com/@ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 hover:border-zinc-400/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-zinc-400/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-400/10 to-zinc-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <BookOpen className="w-12 h-12 text-zinc-300 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2">Medium</h3>
                  <p className="text-sm text-muted-foreground mb-4">@ankkiyy - Long-form security insights</p>
                  <div className="flex items-center text-zinc-300 text-sm font-medium group-hover:gap-2 gap-0 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            </div>

            {/* Ankkiyy Branding Section */}
            <div className="bg-gradient-to-r from-primary/10 via-transparent to-red-500/10 border border-primary/20 rounded-2xl p-12 text-center">
              <p className="text-muted-foreground mb-4">
                <strong className="text-primary text-lg">Ankit Prajapati (Ankkiyy)</strong> is a recognized cybersecurity expert and digital creator dedicated to advancing security awareness and education
              </p>
              <p className="text-sm text-muted-foreground">
                Whether you're looking to follow <a href="https://youtube.com/@ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Ankkiyy on YouTube</a>, connect on <a href="https://x.com/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">X (Twitter)</a>, network on <a href="https://www.linkedin.com/in/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">LinkedIn</a>, read posts on <a href="https://dev.to/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Dev.to</a> and <a href="https://medium.com/@ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Medium</a>, check out <a href="https://github.com/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Ankkiyy's GitHub</a>, or collaborate directly via email, you're connecting with Ankit Prajapati, the creator behind the Ankkiyy identity.
              </p>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent" />
          
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to work with <span className="text-primary">Ankit Prajapati (Ankkiyy)</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join countless organizations that trust Ankit Prajapati, known as Ankkiyy, for their cybersecurity needs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://github.com/ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 cyber-glow flex items-center justify-center gap-3 font-medium transform hover:scale-105"
              >
                <Github className="w-5 h-5" />
                Follow Ankkiyy on GitHub
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://x.com/ankkiyy"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 border border-primary/30 text-primary rounded-xl hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-3 font-medium backdrop-blur-sm transform hover:scale-105"
              >
                <Twitter className="w-5 h-5" />
                Follow Ankkiyy on X
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;