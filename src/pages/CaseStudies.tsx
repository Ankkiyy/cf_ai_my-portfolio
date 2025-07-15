
import { caseStudies } from '../data/portfolio';
import { Clock, CheckCircle, ArrowRight, Target, Lightbulb, TrendingUp } from 'lucide-react';
import CyberAnimation6 from '../components/CyberAnimation6';

const CaseStudies = () => {
  const SelectedAnimation = CyberAnimation6;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background animation */}
      <SelectedAnimation />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-transparent pointer-events-none z-[1]" />
      
      <div className="pt-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Success Stories
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                Case
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Studies
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real-world cybersecurity challenges and the strategic solutions that delivered measurable results for our clients.
            </p>
          </div>

          {/* Enhanced Case Studies */}
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div 
                key={study.id}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Card background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Main card */}
                <div className={`relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="lg:flex">
                    {/* Enhanced Image Section */}
                    <div className="lg:w-1/2 relative group/image">
                      <img 
                        src={study.image} 
                        alt={study.title}
                        className="w-full h-80 lg:h-full object-cover group-hover/image:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Image overlays */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Duration badge */}
                      <div className="absolute top-6 left-6">
                        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">{study.duration}</span>
                        </div>
                      </div>

                      {/* Corner decorations */}
                      <div className="absolute bottom-6 right-6 w-3 h-3 border-r-2 border-b-2 border-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Enhanced Content Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 space-y-8">
                      {/* Header */}
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                          {study.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <p className="text-primary font-semibold text-lg">{study.client}</p>
                        </div>
                      </div>
                      
                      {/* Challenge Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <Target className="h-4 w-4 text-red-400" />
                          </div>
                          <h3 className="font-bold text-lg text-red-400">Challenge</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-11">
                          {study.challenge}
                        </p>
                      </div>
                      
                      {/* Solution Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Lightbulb className="h-4 w-4 text-blue-400" />
                          </div>
                          <h3 className="font-bold text-lg text-blue-400">Solution</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-11">
                          {study.solution}
                        </p>
                      </div>
                      
                      {/* Results Section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          </div>
                          <h3 className="font-bold text-lg text-green-400">Results</h3>
                        </div>
                        <ul className="space-y-3 pl-11">
                          {study.results.map((result, idx) => (
                            <li key={idx} className="flex items-start gap-3 group/item">
                              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200" />
                              <span className="text-muted-foreground group-hover/item:text-foreground/90 transition-colors duration-200">
                                {result}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* View Case Study Button */}
                      {study.view && Object.entries(study.view).map(([label, url]) => (
                        <div key={label} className="pt-4">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 font-medium backdrop-blur-sm"
                          >
                            <span>{label}</span>
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 border border-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-float" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 border border-blue-400/20 rounded-lg rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '200ms' }} />
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-32 pt-16 border-t border-border/50">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Impact Metrics</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Measurable results from our cybersecurity implementations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { value: caseStudies.length, label: "Case Studies", icon: "📊", color: "text-blue-400" },
                { value: "100%", label: "Success Rate", icon: "🎯", color: "text-green-400" },
                { value: "$2M+", label: "Losses Prevented", icon: "💰", color: "text-yellow-400" },
                { value: "24/7", label: "Protection", icon: "🛡️", color: "text-red-400" }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                    <div className={`text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
