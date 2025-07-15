import { about } from '../data/portfolio';

const About = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
    <div className="max-w-3xl space-y-6">
      <h1 className="text-4xl font-bold">About Me</h1>
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
);

export default About;
