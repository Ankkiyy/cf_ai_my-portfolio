
import { projects } from '../data/portfolio';
import { ExternalLink, Github, ArrowRight, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import CyberAnimation6 from '../components/CyberAnimation6';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const SelectedAnimation = CyberAnimation6;

  // Get unique categories
  const categories = ['All', ...new Set(projects.map(project => project.category))];

  // Filter projects based on category and search term
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background animation */}
      <SelectedAnimation />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-red-500/5 pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent pointer-events-none z-[1]" />
      
      <div className="pt-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Portfolio Showcase
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                Featured
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Innovative cybersecurity solutions and tools developed to address modern security challenges and protect digital infrastructures.
            </p>
          </div>

          {/* Enhanced Filters and Search */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'bg-card/50 border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Main card */}
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                  {/* Enhanced Project Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 text-primary-foreground px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm border border-primary/30">
                        {project.category}
                      </span>
                    </div>
                    
                    {/* Project links overlay */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-primary/80 hover:border-primary transition-all duration-300 transform hover:scale-110"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-primary/80 hover:border-primary transition-all duration-300 transform hover:scale-110"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Bottom gradient for title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Enhanced Card Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {project.description}
                    </p>
                    
                    {/* Technologies with enhanced styling */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={tech}
                          className="bg-muted/50 text-muted-foreground px-3 py-1.5 text-xs font-medium rounded-lg border border-border/30 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 transform hover:scale-105"
                          style={{ animationDelay: `${techIndex * 0.05}s` }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {/* Enhanced Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 font-medium"
                        >
                          <Github className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                          Code
                          <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 font-medium backdrop-blur-sm"
                        >
                          <ExternalLink className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                          Demo
                          <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-6 right-6 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '100ms' }} />
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-primary/50" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-muted-foreground">No projects found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search terms or category filters to find what you're looking for.
              </p>
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-24 pt-16 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: projects.length, label: "Total Projects", icon: "🚀" },
                { value: new Set(projects.flatMap(p => p.technologies)).size, label: "Technologies", icon: "⚡" },
                { value: categories.length - 1, label: "Categories", icon: "📂" },
                { value: "100%", label: "Open Source", icon: "💝" }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-center gap-2 mb-2">
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
        </div>
      </div>
    </div>
  );
};

export default Projects;
