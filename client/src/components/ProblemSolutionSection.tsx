import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProblemSolutionSection = () => {
  const problems = [
    {
      icon: <TrendingDown className="h-8 w-8 text-destructive" />,
      title: "Unfair Pricing",
      description: "Fishers often earn 20-30% of the final market value due to intermediaries (UNCTAD, 2020). "
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-destructive" />,
      title: "Limited Traceability",
      description: "Lack of supply chain transparency increases risks of fraud and quality issues (FAO, 2023). "
    },
    {
      icon: <Users className="h-8 w-8 text-destructive" />,
      title: "Financial Exclusion",
      description: "Approximately 70% of small-scale fishers lack access to formal financial services (World Bank, 2022)."
    }
  ];

  const solutions = [
    {
      title: "Direct Market Access",
      description: "Connects fishers to buyers, reducing intermediaries and boosting profits by up to 30%"
    },
    {
      title: "Blockchain Traceability",
      description: "Tracks seafood from ocean to plate with immutable records for quality and authenticity"
    },
    {
      title: "Embedded Finance",
      description: "Provides microloans, digital wallets, and insurance tailored for fishing communities"
    }
  ];

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Problem Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            The Challenge Facing African Fisheries
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Africa’s 38 coastal and island nations are rich in marine resources, 
            yet small-scale fishers face barriers that limit economic opportunities 
            while their seafood reaches global markets.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {problems.map((problem, index) => (
            <Card key={index} className="border-none shadow-2 hover:shadow-3 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center shadow-1">
                    {problem.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 uppercase tracking-wide">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-base">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Solution Section */}
        <div className="relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Our Technology-Driven Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              MarineCatch Africa harnesses blockchain, IoT, and fintech to streamline the seafood 
              supply chain, delivering value to fishers, buyers, and communities while prioritizing sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-card shadow-2 hover:shadow-4 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-ocean rounded-full mb-6 shadow-2">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 uppercase tracking-wide">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground text-base">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="hero" size="lg" className="shadow-3 hover:shadow-4 transition-all duration-300 uppercase tracking-wider px-10 py-6 h-auto text-base">
              Learn More About Our Solutions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;