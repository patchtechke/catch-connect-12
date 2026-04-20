import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TechnologySection from "@/components/TechnologySection";
import ImpactSection from "@/components/ImpactSection";
import TeamSection from "@/components/TeamSection";
import MarineLifeSection from "@/components/MarineLifeSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <TechnologySection />
      <ImpactSection />
      <TeamSection />
      <MarineLifeSection />
      <Footer />
    </div>
  );
};

export default Index;
