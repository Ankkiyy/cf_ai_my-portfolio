import { certificates } from '../data/portfolio';

const Certificates = () => (
  <div className="min-h-screen bg-background text-foreground py-16 px-4">
    <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {certificates.map(cert => (
        <div key={cert.id} className="border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <img src={cert.image} alt={cert.title} className="w-full h-40 object-cover" />
          <div className="p-4 space-y-2">
            <h2 className="font-semibold text-lg">{cert.title}</h2>
            <p className="text-sm text-muted-foreground">{cert.issuer} &middot; {cert.date}</p>
            {cert.url && (
              <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">View</a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Certificates;
