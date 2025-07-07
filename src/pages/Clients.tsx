
import { clients } from '../data/portfolio';
import { Building, Users, Star } from 'lucide-react';

const Clients = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Clients</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by leading organizations across various industries to secure their digital infrastructure.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-card border border-border rounded-lg p-6">
            <Building className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold text-primary mb-2">5</div>
            <div className="text-muted-foreground">Industries Served</div>
          </div>
          <div className="text-center bg-card border border-border rounded-lg p-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center bg-card border border-border rounded-lg p-6">
            <Star className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {clients.map((client) => (
            <div 
              key={client.id}
              className="bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{client.logo}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-2">{client.industry}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {client.description}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Services Provided:</h4>
                <div className="flex flex-wrap gap-2">
                  {client.services.map((service) => (
                    <span 
                      key={service}
                      className="bg-primary/10 text-primary px-3 py-1 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-12">What Clients Say</h2>
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-xl italic text-muted-foreground mb-6">
              "The cybersecurity expertise demonstrated was exceptional. Our security posture improved dramatically, 
              and we now have complete confidence in our digital infrastructure protection."
            </blockquote>
            <cite className="text-primary font-semibold">— CTO, SecureBank Corp</cite>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
