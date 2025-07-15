import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="py-8 border-t border-border bg-background/80 backdrop-blur-md mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Ankit Prajapati. All rights reserved.</p>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm items-center">
        <Link to="/about" className="hover:text-primary">About</Link>
        <Link to="/certificates" className="hover:text-primary">Certificates</Link>
        <a href="https://github.com" className="hover:text-primary" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:me@ankkiyy.com" className="hover:text-primary">me@ankkiyy.com</a>
      </nav>
    </div>
  </footer>
);

export default Footer;
