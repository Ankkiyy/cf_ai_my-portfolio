import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const location = useLocation();

  const mainNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Certificates', path: '/certificates' },
  ];

  const moreNavItems = [
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Clients', path: '/clients' },
    { name: 'Tools', path: '/tools' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isMoreSectionActive = () => {
    return moreNavItems.some(item => isActive(item.path));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Shield className="h-8 w-8 text-primary group-hover:animate-cyber-pulse" />
            <span className="text-xl font-semibold">Ankit Prajapati</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  isMoreSectionActive()
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              >
                More
                <ChevronDown className={`h-4 w-4 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-48 bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-lg overflow-hidden"
                  onMouseLeave={() => setIsMoreDropdownOpen(false)}
                >
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-4 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                        isActive(item.path)
                          ? 'text-primary bg-primary/5'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsMoreDropdownOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile More Section */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                More
              </div>
              {moreNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-2 pl-4 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
