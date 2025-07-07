
import { caseStudies } from '../data/portfolio';
import { Clock, CheckCircle } from 'lucide-react';

const CaseStudies = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-world cybersecurity challenges and the strategic solutions that delivered measurable results.
          </p>
        </div>

        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <div 
              key={study.id}
              className={`bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold">{study.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {study.duration}
                    </div>
                  </div>
                  
                  <p className="text-primary font-medium mb-6">{study.client}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Challenge</h3>
                      <p className="text-muted-foreground">{study.challenge}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Solution</h3>
                      <p className="text-muted-foreground">{study.solution}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3 text-lg">Results</h3>
                      <ul className="space-y-2">
                        {study.results.map((result, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
