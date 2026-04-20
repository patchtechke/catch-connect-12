import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@/assets/hero-fisher-tech.jpg";
import { useEffect, useState } from "react";

const CookiePolicy = () => {
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
          
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">Last Updated: June 10, 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              This Cookie Policy explains how MarineCatch Africa Limited ("we," "our," or "us") uses cookies and similar technologies on our website. This policy provides you with information about how we use cookies, what types of cookies we use, and how you can control them.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how their site is being used.
            </p>
            <p>
              Cookies are not harmful and do not contain any information that directly identifies you as a person. They cannot be used to spread viruses or access your hard drive.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
            <p>
              We use the following types of cookies on our website:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.
              </li>
              <li>
                <strong>Preference Cookies:</strong> These cookies allow the website to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personalized features.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve the way our website works.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third parties on our website. These third parties may include analytics providers (like Google Analytics), advertising networks, and social media platforms. These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our website and other websites.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. How Long Do Cookies Stay on My Device?</h2>
            <p>
              The length of time a cookie will remain on your device depends on whether it is a "persistent" or "session" cookie:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                <strong>Session Cookies:</strong> These cookies are temporary and are erased when you close your browser.
              </li>
              <li>
                <strong>Persistent Cookies:</strong> These cookies remain on your device until they expire or you delete them. The duration varies from cookie to cookie.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. How to Control Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can usually find these settings in the "Options" or "Preferences" menu of your browser. You can set your browser to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Accept or reject all cookies</li>
              <li>Accept or reject cookies from specific websites</li>
              <li>Be notified when a cookie is set</li>
              <li>Delete cookies that have already been set</li>
            </ul>
            <p>
              Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically to stay informed about our use of cookies.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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

export default CookiePolicy;