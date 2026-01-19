import { Outlet, Link, useLocation } from 'react-router-dom';
import { Wrench, ExternalLink } from 'lucide-react';
import CyberAnimation6 from '../components/CyberAnimation6';
import { TOOL_ROUTES } from '../components/Tools/Constants';

const Tools = () => {
  const location = useLocation();
  const isToolsHome = location.pathname === '/tools';

  const tools = TOOL_ROUTES.map((tool) => ({
    id: tool.path,
    name: tool.name,
    description: tool.description,
    path: `/tools/${tool.path}`,
    icon: tool.icon
  }));

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background animation */}
      <CyberAnimation6 />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-transparent pointer-events-none z-[1]" />
      
      <div className="pt-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isToolsHome ? (
            <>
              {/* Header */}
              <div className="text-center mb-20 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-6">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Security Tools
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                    Security
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                    Tools
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Professional cybersecurity tools and utilities for penetration testing, security analysis, and threat detection.
                </p>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Wrench className="h-4 w-4" />
                      <span>Open Tool</span>
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;
