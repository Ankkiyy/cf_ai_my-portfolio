import { Link } from 'react-router-dom';
import { Github, Mail, Youtube, Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="py-8 border-t border-border bg-background/80 backdrop-blur-md mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Main content area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left side - Copyright and description */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} <span className="text-primary font-semibold">Ankkiyy</span>. All rights reserved.</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            <a href="https://youtube.com/@ankkiyy" target="_blank" rel="noopener" className="text-primary hover:underline">Ankkiyy</a> - Your trusted cybersecurity expert & digital creator
          </p>
        </div>

        {/* Middle - Navigation links */}
        <nav className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm items-start sm:items-center">
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/certificates" className="hover:text-primary transition-colors">Certificates</Link>
          <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <a href="mailto:me@ankkiyy.com" className="hover:text-primary transition-colors">Contact</a>
        </nav>
      </div>

      {/* Social links section */}
      <div className="border-t border-border/50 pt-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Follow <span className="text-primary">Ankkiyy</span></p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/ankkiyy" 
              target="_blank" 
              rel="noopener"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
              aria-label="GitHub @ankkiyy"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>GitHub</span>
            </a>
            <a
              href="https://x.com/ankkiyy" 
              target="_blank" 
              rel="noopener"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
              aria-label="Twitter/X @ankkiyy"
            >
              <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>X (Twitter)</span>
            </a>
            <a
              href="https://youtube.com/@ankkiyy" 
              target="_blank" 
              rel="noopener"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
              aria-label="YouTube @ankkiyy"
            >
              <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>YouTube</span>
            </a>
            <a
              href="mailto:me@ankkiyy.com" 
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
              aria-label="Email Ankkiyy"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom tagline with Ankkiyy branding */}
      <div className="border-t border-border/50 pt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Built by <a href="https://x.com/ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Ankkiyy</a> • 
          <a href="https://youtube.com/@ankkiyy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Cybersecurity Creator</a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
