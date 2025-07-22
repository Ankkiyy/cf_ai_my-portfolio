import { useState, useMemo } from "react";
import { certificates } from "../data/portfolio";

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");

  // Extract unique companies
  const companies = useMemo(() => {
    const allCompanies = certificates.flatMap((cert) => cert.company);
    return ["all", ...Array.from(new Set(allCompanies))];
  }, []);

  // Filter certificates based on search and company
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesSearch =
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.company.some((company) =>
          company.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCompany =
        selectedCompany === "all" || cert.company.includes(selectedCompany);

      return matchesSearch && matchesCompany;
    });
  }, [searchTerm, selectedCompany]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Professional Certifications
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
              My
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
              Certificates
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Professional certifications and training achievements in
            cybersecurity, cloud technologies, and software development.
          </p>
        </div>

        {/* Filter and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-card/50 border border-border rounded-lg focus:outline-none focus:border-primary/50 backdrop-blur-sm"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Company Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="px-3 py-2 bg-card/50 border border-border rounded-lg focus:outline-none focus:border-primary/50 backdrop-blur-sm"
              >
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company === "all" ? "All Companies" : company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredCertificates.length} of {certificates.length}{" "}
            certificates
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-1"
            >
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-lg">{cert.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer} &middot; {cert.date}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cert.company.join(", ")}
                </p>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline inline-block mt-2"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No certificates found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCompany("all");
              }}
              className="mt-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
