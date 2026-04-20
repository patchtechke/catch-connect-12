import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Banknote, Satellite } from "lucide-react";
import blockchainImage from "@/assets/blockchain-ocean.jpg";

const TechnologySection = () => {
  const technologies = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Blockchain Technology",
      description: "Immutable ledger ensuring complete transparency and traceability from ocean to plate",
      features: ["End-to-end traceability", "Fraud prevention", "Quality verification", "Smart contracts"]
    },
    {
      icon: <Satellite className="h-8 w-8 text-accent" />,
      title: "IoT Integration", 
      description: "Real-time data collection through sensors and mobile devices for accurate tracking",
      features: ["GPS location tracking", "Temperature monitoring", "Catch weight verification", "Quality sensors"]
    },
    {
      icon: <Banknote className="h-8 w-8 text-secondary" />,
      title: "Embedded Finance",
      description: "Comprehensive financial services designed specifically for fishing communities",
      features: ["Microloans", "Digital wallets", "Insurance products", "Savings accounts"]
    },
    {
      icon: <Zap className="h-8 w-8 text-success" />,
      title: "AI & Analytics",
      description: "Advanced algorithms providing insights for better decision making and optimization",
      features: ["Price predictions", "Market trends", "Demand forecasting", "Risk assessment"]
    }
  ];

  return (
    <section id="technology" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Cutting-Edge Technology Stack
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We combine the latest innovations in blockchain, IoT, and fintech to create 
            a comprehensive platform that transforms the seafood supply chain.
          </p>
        </div>

        {/* Hero Technology Image */}
        <div className="relative mb-20 rounded-2xl overflow-hidden shadow-3 hover:shadow-4 transition-all duration-300">
          <img 
            src={blockchainImage} 
            alt="Blockchain technology visualization" 
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
                From Ocean to Blockchain
              </h3>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                Every fish caught is immediately recorded on an immutable blockchain, 
                creating a permanent, transparent record of its journey.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {technologies.map((tech, index) => (
            <Card key={index} className="h-full shadow-2 hover:shadow-4 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-10">
                <div className="flex items-center space-x-5 mb-8">
                  <div className="w-18 h-18 bg-gradient-logo rounded-xl flex items-center justify-center shadow-2 hover:shadow-3 transition-all duration-300 hover:scale-105">
                    <div className="h-10 w-10">{tech.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight uppercase">
                      {tech.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-8 text-lg">
                  {tech.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {tech.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full shadow-1"></div>
                      <span className="text-sm text-muted-foreground tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fish Journey Visualization */}
        <div className="bg-card rounded-2xl p-10 shadow-3 hover:shadow-4 transition-all duration-300">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-10 tracking-tight uppercase">
            The Journey of a Single Fish
          </h3>
          
          <div className="grid md:grid-cols-5 gap-4 items-center">
            {[
              { step: "Catch", desc: "GPS location, time, species", icon: "🎣" },
              { step: "Quality Check", desc: "IoT sensors verify freshness", icon: "🔍" },
              { step: "Blockchain Record", desc: "Immutable data storage", icon: "⛓️" },
              { step: "Buyer Match", desc: "AI connects with buyers", icon: "🤝" },
              { step: "Delivery", desc: "Smart contract payment", icon: "📦" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-3 transform hover:scale-110 transition-all duration-300">{item.icon}</div>
                <h4 className="font-semibold text-foreground mb-2 uppercase tracking-wide">{item.step}</h4>
                <p className="text-sm text-muted-foreground tracking-wide">{item.desc}</p>
                {index < 4 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
                    <div className="w-6 h-0.5 bg-primary shadow-1"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;