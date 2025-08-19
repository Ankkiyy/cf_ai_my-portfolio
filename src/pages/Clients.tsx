import { clients, testimonials } from "../data/portfolio";
import {
  Building,
  Users,
  Star,
  ArrowRight,
  Award,
  Handshake,
  Globe,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import CyberAnimation6 from "../components/CyberAnimation6";

const Clients = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const SelectedAnimation = CyberAnimation6;

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonialData = testimonials[currentTestimonial];
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background animation */}
      <SelectedAnimation />

      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-transparent pointer-events-none z-[1]" />

      <div className="pt-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Trusted Partners
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                My
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent">
                Clients
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Trusted by leading organizations across various industries to
              secure their digital infrastructure and protect their most
              valuable assets.
            </p>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Building,
                value: "5+",
                label: "Industries Served",
                description: "Diverse sectors protected",
                color: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-blue-400",
              },
              {
                icon: Users,
                value: "50+",
                label: "Projects Completed",
                description: "Successful implementations",
                color: "from-green-500/20 to-emerald-500/20",
                iconColor: "text-green-400",
              },
              {
                icon: Star,
                value: "100%",
                label: "Client Satisfaction",
                description: "Perfect track record",
                color: "from-yellow-500/20 to-orange-500/20",
                iconColor: "text-yellow-400",
              },
            ].map((stat, index) => (
              <div key={index} className="group relative">
                {/* Card background with gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative text-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <stat.icon
                      className={`h-8 w-8 ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div
                    className={`text-4xl font-bold mb-2 group-hover:scale-110 transition-transform ${stat.iconColor}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Client Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {clients.map((client, index) => (
              <div
                key={client.id}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                  {/* Client Header */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                        {client.logo}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {client.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-4 w-4 text-primary" />
                        <p className="text-primary font-semibold">
                          {client.industry}
                        </p>
                      </div>
                      <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        {client.description}
                      </p>
                    </div>
                  </div>

                  {/* Services Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg">Services Provided:</h4>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-11">
                      {client.services.map((service, serviceIndex) => (
                        <span
                          key={service}
                          className="bg-primary/10 text-primary px-4 py-2 text-sm font-medium rounded-lg border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105"
                          style={{ animationDelay: `${serviceIndex * 0.05}s` }}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-6 right-6 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    className="absolute bottom-6 left-6 w-1 h-1 bg-green-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ transitionDelay: "100ms" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Testimonial Section */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl" />

            <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-12 lg:p-16">
              <div className="text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium backdrop-blur-sm mb-8">
                  <Handshake className="w-4 h-4" />
                  Client Testimonials
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                  What My Clients Say
                </h2>

                {/* Testimonial Carousel */}
                <div className="relative">
                  {/* Navigation Buttons */}
                  <button
                    onClick={prevTestimonial}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group z-10"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group z-10"
                  >
                    <ChevronRight className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </button>

                  <div className="relative overflow-hidden">
                    {/* Quote decoration */}
                    <div className="absolute -top-6 -left-6 text-6xl text-primary/20 font-serif">
                      <Quote className="w-16 h-16" />
                    </div>

                    {/* Testimonial Content */}
                    <div
                      key={currentTestimonial}
                      className="animate-fade-in-up"
                    >
                      {/* Star Rating */}
                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(currentTestimonialData.rating)].map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-yellow-400"
                            />
                          )
                        )}
                      </div>

                      <blockquote className="text-xl md:text-2xl italic text-muted-foreground mb-8 leading-relaxed relative z-10">
                        "{currentTestimonialData.quote}"
                      </blockquote>

                      {/* Client Information */}
                      <div className="flex items-center justify-center gap-6">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                          {currentTestimonialData.avatar}
                        </div>
                        <div className="text-left">
                          <cite className="text-primary font-bold text-xl block">
                            {currentTestimonialData.clientName}
                          </cite>
                          <div className="text-muted-foreground text-sm">
                            {currentTestimonialData.clientTitle}
                          </div>
                          <div className="text-muted-foreground text-sm font-medium">
                            {currentTestimonialData.clientCompany}
                          </div>
                          <div className="text-primary text-xs font-medium mt-1">
                            {currentTestimonialData.industry} •{" "}
                            {currentTestimonialData.projectType}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Indicators */}
                  <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? "bg-primary scale-125"
                            : "bg-primary/20 hover:bg-primary/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Additional Testimonials Preview */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.slice(0, 3).map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`p-6 bg-card/20 backdrop-blur-sm border border-border/30 rounded-2xl transition-all duration-300 hover:border-primary/30 cursor-pointer ${
                        index === currentTestimonial
                          ? "ring-2 ring-primary/30"
                          : ""
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                          {testimonial.avatar}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-sm">
                            {testimonial.clientName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.clientCompany}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Partnership CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm hover:bg-primary/20 transition-all duration-300 cursor-pointer group transform hover:scale-105">
              <Handshake className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
              <span className="text-primary font-medium text-lg">
                Ready to join my trusted clients?
              </span>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
