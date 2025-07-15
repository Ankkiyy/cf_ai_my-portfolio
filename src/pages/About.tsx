import { about } from '../data/portfolio';
import CyberAnimation6 from '../components/CyberAnimation6';

const About = () => (
  <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
    <CyberAnimation6 />
    <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-red-500/5 pointer-events-none z-[1]" />
    <div className="fixed inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent pointer-events-none z-[1]" />

    <div className="pt-20 px-4 relative z-10 flex items-center justify-center">
      <div className="max-w-3xl space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
          About Me
        </h1>
        <p className="text-lg text-muted-foreground">{about.intro}</p>
        <p>{about.details}</p>
        <p>
          Contact me at{' '}
          <a href="mailto:me@ankkiyy.com" className="text-primary hover:underline">
            me@ankkiyy.com
          </a>
          .
        </p>
      </div>
    </div>
  </div>
);

export default About;
