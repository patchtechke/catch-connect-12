import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import heroImage from "@/assets/hero-fisher-tech.jpg";
import WaitlistDialog from "./WaitlistDialog";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/buyer-fish.webm" type="video/webm" />
          <img 
            src={heroImage} 
            alt="African fisher using technology on boat" 
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Connecting African
            <span className="block text-secondary">Fishers</span>
            <span className="block">with Technology</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed">
            We connect small-scale fishers to buyers using blockchain, IoT, and embedded finance, fostering fair pricing, 
            transparency, and sustainable growth across Africa’s 32 coastal nations and 6 island states. Our initial pilots 
            in Eastern Africa aim to engage 1,500+ fishers, scaling to transform the continent’s seafood supply chain.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <WaitlistDialog 
              trigger={
                <Button 
                  variant="logo" 
                  size="lg" 
                  className="shadow-3 hover:shadow-4 text-lg px-8 py-6"
                  data-testid="button-hero-waitlist"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Join the Waitlist
                </Button>
              }
            />
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6"
              onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-learn-more"
            >
              <Play className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-md">
            <div className="text-center bg-white/10 backdrop-blur-sm p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-white">1,500+</div>
              <div className="text-white/90 text-sm mt-2">Active Fishers</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-white">$3M+</div>
              <div className="text-white/90 text-sm mt-2 whitespace-nowrap">Fair Trade Value</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-bold text-white">38</div>
              <div className="text-white/90 text-sm mt-1">Nations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-10 h-14 flex justify-center rounded-full shadow-md bg-white/5 backdrop-blur-sm">
          <div className="w-2 h-4 bg-white/70 mt-3 animate-pulse rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;