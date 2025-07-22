import { about } from '../data/portfolio';
import CyberAnimation6 from '../components/CyberAnimation6';

const About = () => (
  <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
    <CyberAnimation6 />
    <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-red-500/5 pointer-events-none z-[1]" />
    <div className="fixed inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent pointer-events-none z-[1]" />

    <div className="pt-32 px-4 relative z-10 flex items-center justify-center min-h-screen">
      <div className="max-w-4xl space-y-8 text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-6">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Get to Know Me
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
          About Me
        </h1>
        
        <div className="space-y-6 text-lg md:text-xl leading-relaxed">
          <p className="text-primary font-semibold">{about.intro}</p>
          <p className="text-muted-foreground">{about.details}</p>
          <p className="text-muted-foreground">
            Contact me at{' '}
            <a href="mailto:me@ankkiyy.com" className="text-primary hover:underline font-semibold">
              me@ankkiyy.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
