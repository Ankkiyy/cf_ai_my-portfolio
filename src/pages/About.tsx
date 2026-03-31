import { about } from '../data/portfolio';
import CyberAnimation6 from '../components/CyberAnimation6';
import { Github, Youtube, Twitter, ExternalLink, ArrowRight } from 'lucide-react';

const About = () => (
  <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
    <CyberAnimation6 />
    <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-red-500/5 pointer-events-none z-[1]" />
    <div className="fixed inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent pointer-events-none z-[1]" />

    <div className="pt-32 px-4 relative z-10">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Meet Ankkiyy
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
            About <span className="text-primary">Ankkiyy</span>
          </h1>
          
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p className="text-primary font-semibold text-2xl">{about.intro}</p>
            <p className="text-muted-foreground max-w-3xl mx-auto">{about.details}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main narrative */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story Section */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500">
              <h2 className="text-2xl font-bold mb-4">Who is Ankkiyy?</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-primary">Ankkiyy</strong> is a passionate cybersecurity engineer with a mission to protect digital assets and elevate security awareness. With years of experience in penetration testing, threat hunting, and security architecture, Ankkiyy brings a unique blend of technical expertise and creative problem-solving to every challenge.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Beyond the traditional security consulting, Ankkiyy is also a digital creator committed to democratizing cybersecurity education. Through content on <a href="https://youtube.com/@ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">YouTube</a> and <a href="https://x.com/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">social media</a>, Ankkiyy shares insights, tutorials, and industry expertise with a growing audience of security enthusiasts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The journey as a creator and educator started with a simple goal: make cybersecurity knowledge accessible to everyone. Whether it's through code on <a href="https://github.com/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">GitHub</a>, videos on <a href="https://youtube.com/@ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Ankkiyy's YouTube channel</a>, or discussions on <a href="https://x.com/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">X</a>, Ankkiyy continues to make an impact in the security community.
              </p>
            </div>

            {/* Why Ankkiyy Section */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500">
              <h2 className="text-2xl font-bold mb-6">Why Choose Ankkiyy?</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Deep Technical Expertise",
                    desc: "Years of hands-on cybersecurity experience with a proven track record"
                  },
                  {
                    title: "Education-First Approach",
                    desc: "Believer in making security knowledge accessible through clear, practical content"
                  },
                  {
                    title: "Open Source Contributor",
                    desc: "Active on GitHub, sharing tools and code with the security community"
                  },
                  {
                    title: "Community Engagement",
                    desc: "Regular content creator on YouTube and active on social media platforms"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-border/30 last:border-b-0">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-primary/10 to-red-500/10 border border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Get in Touch with Ankkiyy</h2>
              <p className="text-muted-foreground mb-6">
                Whether you need security consulting, collaboration, or just want to discuss cybersecurity topics, Ankkiyy is here to help.
              </p>
              <a 
                href="mailto:me@ankkiyy.com"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
              >
                <span>Contact Ankkiyy</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Social Links Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sticky top-32 hover:border-primary/30 transition-all duration-500">
              <h3 className="font-bold mb-6 text-lg">Follow Ankkiyy</h3>
              
              <div className="space-y-4">
                <a
                  href="https://github.com/ankkiyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-primary" />
                    <span className="font-medium">GitHub</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="https://youtube.com/@ankkiyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span className="font-medium">YouTube</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="https://x.com/ankkiyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">X/Twitter</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-border/30">
                <p className="text-xs text-muted-foreground text-center">
                  Connect with <strong className="text-primary">Ankkiyy</strong> on all platforms for the latest security insights
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h3 className="font-bold mb-6 text-lg">Quick Facts</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Specialization</p>
                  <p className="font-semibold">Cybersecurity & Threat Detection</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Location</p>
                  <p className="font-semibold">Digital World</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Platform</p>
                  <p className="font-semibold">Known as <span className="text-primary">Ankkiyy</span></p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Email</p>
                  <a href="mailto:me@ankkiyy.com" className="font-semibold text-primary hover:underline">me@ankkiyy.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/5 to-red-500/5 border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work with Ankkiyy?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's collaborate on your next security project or discuss how <strong className="text-primary">Ankkiyy</strong> can help secure your digital infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:me@ankkiyy.com"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium"
            >
              Email Ankkiyy
            </a>
            <a
              href="https://x.com/ankkiyy"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-all font-medium"
            >
              Message on X
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
