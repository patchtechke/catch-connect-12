import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@/assets/hero-fisher-tech.jpg";
import { useEffect, useState } from "react";

const FAQ = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="w-full h-[50vh] relative -z-10">
        <img 
          src={heroImage} 
          alt="Fisherman with technology" 
          className="w-full h-full object-cover absolute top-0 left-0"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      <main className="flex-grow container mx-auto px-4 py-12 relative -mt-16">
        <div className="max-w-4xl mx-auto">

          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-300 mb-8 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">Find answers to commonly asked questions about our services, marine conservation efforts, and more.</p>
            
            <div className="space-y-8">
              {/* Marine Conservation */}
              <div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Marine Conservation</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">What is marine conservation and why is it important?</h3>
                    <p>
                      Marine conservation refers to the protection and preservation of marine ecosystems, habitats, and species. It's crucial because oceans regulate our climate, provide food security, support biodiversity, and contribute to the global economy. With increasing threats from pollution, overfishing, and climate change, conservation efforts are essential to maintain healthy oceans for future generations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">How does MarineCatch Africa contribute to ocean conservation?</h3>
                    <p>
                      We implement sustainable fishing practices, support marine protected areas, conduct research on marine ecosystems, and engage in community education programs. Our business model is designed to balance economic benefits with environmental stewardship, ensuring that marine resources are harvested responsibly while preserving biodiversity.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">What are the biggest threats to marine ecosystems in Africa?</h3>
                    <p>
                      The major threats include overfishing, illegal fishing practices, plastic pollution, coastal development, climate change impacts (such as ocean acidification and rising temperatures), and habitat destruction. These challenges are often compounded by limited resources for enforcement and monitoring in many African coastal nations.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Our Services */}
              <div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Our Services</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">What products and services does MarineCatch Africa offer?</h3>
                    <p>
                      We offer sustainably sourced seafood products, marine conservation consulting services, educational programs about ocean ecosystems, and partnerships with local fishing communities. Our product range includes various seafood species harvested using environmentally responsible methods, with full traceability from ocean to plate.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">How do you ensure your seafood is sustainably sourced?</h3>
                    <p>
                      We adhere to strict sustainability standards, including selective harvesting methods, respecting seasonal restrictions, avoiding endangered species, and working with certified fisheries. Our traceability system tracks each product from harvest to distribution, and we regularly assess fish stocks to prevent overfishing. We also collaborate with marine scientists to continuously improve our practices.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">Do you offer consulting services for marine conservation projects?</h3>
                    <p>
                      Yes, we provide consulting services for organizations interested in marine conservation, sustainable fishing practices, and ocean-friendly business models. Our team includes experts in marine biology, sustainable fisheries management, and conservation policy who can assist with project design, implementation, and evaluation.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Technology */}
              <div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Technology & Innovation</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">What technologies do you use to monitor marine ecosystems?</h3>
                    <p>
                      We employ various technologies including underwater drones, satellite tracking, acoustic monitoring systems, and environmental DNA sampling. These tools help us assess fish populations, monitor habitat health, detect illegal fishing activities, and gather data on ocean conditions. We also use blockchain technology for our traceability systems to ensure transparency in our supply chain.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">How are you incorporating innovation into sustainable fishing?</h3>
                    <p>
                      We're developing and implementing selective fishing gear that minimizes bycatch, using AI and machine learning to predict optimal fishing locations and times, creating mobile apps that help fishers report and track their catches, and exploring alternative packaging solutions to reduce plastic waste. We also invest in research for new aquaculture techniques that have minimal environmental impact.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Partnerships & Community */}
              <div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Partnerships & Community</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">How do you work with local fishing communities?</h3>
                    <p>
                      We establish fair-trade partnerships with local fishing communities, providing training on sustainable practices, fair compensation for their catches, and investment in community infrastructure. We also create programs that diversify income sources, reducing pressure on fish stocks while supporting economic stability. Our approach emphasizes knowledge exchange, respecting traditional fishing methods while introducing sustainable innovations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">Can organizations partner with MarineCatch Africa for conservation initiatives?</h3>
                    <p>
                      Absolutely! We welcome partnerships with NGOs, research institutions, government agencies, and businesses committed to marine conservation. We can collaborate on research projects, community education programs, policy advocacy, and sustainable business practices. Please contact us to discuss potential partnership opportunities that align with our conservation mission.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* General Questions */}
              <div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">General Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">How can I get involved with marine conservation efforts?</h3>
                    <p>
                      There are many ways to get involved! You can support sustainable seafood by making informed consumer choices, participate in beach clean-ups, reduce your plastic consumption, volunteer with local conservation organizations, or donate to marine protection initiatives. You can also follow us on social media and subscribe to our newsletter to stay informed about our projects and opportunities to contribute.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">Where are you currently operating?</h3>
                    <p>
                      We currently operate along the East African coastline, with primary activities in Kenya, Tanzania, and Mozambique. We're gradually expanding our presence to other coastal regions in Africa while ensuring our growth remains sustainable and aligned with our conservation principles.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">How can I contact MarineCatch Africa for more information?</h3>
                    <p>
                      You can reach us through several channels:
                    </p>
                    <p className="mb-6">
                      <strong>Email:</strong> info@marinecatchafrica.com<br />
                      <strong>Phone:</strong> +254 707939810<br />
                      <strong>Address:</strong> Beach Road, Diani, Ukunda<br />
                      <strong>Social Media:</strong> Follow us on Twitter, Facebook, and Instagram @MarineCatchAfrica
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/80 transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
      <Footer />
    </div>
  );
};

export default FAQ;