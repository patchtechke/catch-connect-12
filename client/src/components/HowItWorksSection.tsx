import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Database, Handshake, CreditCard, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Fisher Logs Catch",
      description: "Fishers record catch details (species, location, quality) in real-time via our mobile app.",
      color: "from-primary/20 to-primary/5"
    },
    {
      number: "02", 
      icon: <Database className="h-8 w-8 text-accent" />,
      title: "Blockchain Recording",
      description: "Data is securely stored on a blockchain, ensuring an immutable record. ",
      color: "from-accent/20 to-accent/5"
    },
    {
      number: "03",
      icon: <Handshake className="h-8 w-8 text-secondary" />,
      title: "Buyer Connection",
      description: "Verified buyers view catches, certifications, and place orders directly. ",
      color: "from-secondary/20 to-secondary/5"
    },
    {
      number: "04",
      icon: <CreditCard className="h-8 w-8 text-success" />,
      title: "Secure Payment",
      description: "Smart contracts enable instant, transparent payments upon delivery.",
      color: "from-success/20 to-success/5"
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            How MarineCatch Africa Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform simplifies the seafood supply chain into four transparent, 
            technology-driven steps for all stakeholders.

          </p>
        </div>

        <div className="relative">
          {/* Desktop Flow */}
          <div className="hidden md:block">
            <div className="grid md:grid-cols-4 gap-10 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="h-full shadow-2 hover:shadow-4 transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8 text-center h-full flex flex-col">
                      <div className={`w-18 h-18 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-2 hover:shadow-3 transition-all duration-300 hover:scale-105`}>
                        <div className="h-10 w-10">{step.icon}</div>
                      </div>
                      <div className="text-4xl font-bold text-muted-foreground/20 mb-3">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4 uppercase tracking-wide">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground flex-grow tracking-wide">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-3 hover:shadow-4 transition-all duration-300 hover:scale-110">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="md:hidden space-y-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="shadow-2 hover:shadow-4 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-5">
                      <div className={`w-18 h-18 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-2 hover:shadow-3 transition-all duration-300 hover:scale-105`}>
                        <div className="h-10 w-10">{step.icon}</div>
                      </div>
                      <div className="flex-grow">
                        <div className="text-2xl font-bold text-muted-foreground/20 mb-2">
                          {step.number}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 uppercase tracking-wide">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground tracking-wide">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-2 hover:shadow-3 transition-all duration-300 hover:scale-110">
                      <ArrowRight className="h-5 w-5 text-white rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-ocean rounded-2xl p-10 text-white shadow-3 hover:shadow-4 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 tracking-tight uppercase">Ready to Transform Your Seafood Business?</h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of fishers and buyers who are already benefiting from our transparent, 
              technology-driven platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold uppercase tracking-wide shadow-2 hover:shadow-3 hover:bg-white/90 transition-all duration-300">
                For Fishers
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold uppercase tracking-wide shadow-1 hover:shadow-2 hover:bg-white/10 transition-all duration-300">
                For Buyers
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;