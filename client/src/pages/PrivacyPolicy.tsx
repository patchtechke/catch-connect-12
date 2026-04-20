import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@/assets/hero-fisher-tech.jpg";
import { useEffect, useState } from "react";

const PrivacyPolicy = () => {
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
          
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">Last Updated: June 10, 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              MarineCatch Africa Limited ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>We may collect information about you in various ways, including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information you provide when subscribing to our newsletter, contacting us, or creating an account.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and actions taken.</li>
              <li><strong>Device Information:</strong> Information about your device, including IP address, browser type, and operating system.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Providing, maintaining, and improving our services</li>
              <li>Communicating with you about our services, updates, and promotions</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Protecting against unauthorized access and fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Service Providers:</strong> Third-party vendors who assist us in providing our services</li>
              <li><strong>Business Partners:</strong> Companies we collaborate with to offer joint services or promotions</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Accessing, correcting, or deleting your personal information</li>
              <li>Withdrawing consent for processing your information</li>
              <li>Restricting or objecting to certain processing activities</li>
              <li>Data portability</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing activities. You can manage your cookie preferences through your browser settings.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;