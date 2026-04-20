import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@/assets/hero-fisher-tech.jpg";
import { useEffect, useState } from "react";

const TermsOfService = () => {
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
          
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">Last Updated: June 10, 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using MarineCatch Africa Limited's website, services, or applications (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Services</h2>
            <p>
              MarineCatch Africa Limited provides a platform connecting fishers with global markets while promoting sustainability in Africa's seafood supply chain. Our Services may include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Digital marketplace for seafood products</li>
              <li>Supply chain tracking and management tools</li>
              <li>Sustainability certification and verification</li>
              <li>Educational resources and market insights</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>
              Some features of our Services may require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Update your information to keep it current</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be solely responsible for all activities that occur under your account</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Conduct</h2>
            <p>
              When using our Services, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with or disrupt the Services or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Services</li>
              <li>Use the Services for any illegal or unauthorized purpose</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of MarineCatch Africa Limited or its licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Links and Services</h2>
            <p>
              Our Services may contain links to third-party websites or services that are not owned or controlled by MarineCatch Africa Limited. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by the use of such third-party websites or services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MarineCatch Africa Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless MarineCatch Africa Limited, its officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney's fees and costs, arising out of or in any way connected with your access to or use of the Services or your violation of these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Services after such changes constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to these Terms shall be brought exclusively in the courts of Kenya.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-6">
              <strong>Email:</strong> info@marinecatchafrica.com<br />
              <strong>Phone:</strong> +254 707939810<br />
              <strong>Address:</strong> Beach Road, Diani, Ukunda
            </p>
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

export default TermsOfService;