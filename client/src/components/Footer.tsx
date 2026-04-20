import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fish, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-20">
        {/* Newsletter Signup */}
        <div className="bg-white/10 rounded-xl p-10 mb-20 text-center shadow-3 hover:shadow-4 transition-all duration-300">
          <h3 className="text-3xl font-bold mb-6">Stay Connected with Our Mission</h3>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg">
            Get the latest updates on our impact, technology developments, and opportunities 
            to join the marine revolution in Africa.
          </p>
          <form action="mailto:info@marinecatchafrica.com" method="post" encType="text/plain" className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email"
              name="email"
              placeholder="Enter your email" 
              className="bg-white text-foreground border-0 shadow-1 h-14 text-base"
              required
            />
            <Button type="submit" variant="logo" className="whitespace-nowrap uppercase tracking-wider shadow-2 hover:shadow-3 transition-all duration-300 h-14">
              Subscribe
            </Button>
          </form>
        </div>

        <div className="grid md:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 rounded-lg shadow-1">
                <Fish className="h-7 w-7" />
              </div>
              <span className="text-2xl font-bold">MarineCatch Africa</span>
            </div>
            <p className="text-primary-foreground/90 mb-8 text-base">
              Transforming Africa's seafood supply chain through innovative technology, 
              connecting fishers with global markets while promoting sustainability.
            </p>
            <div className="flex space-x-5">
              <a href="https://www.facebook.com/people/MarineCatch-Africa-Limited/61550514909780/?name=xhp_nt_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-1 hover:shadow-2 hover:bg-white/20 transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/MarineCatch?t=G_nHpeGpL0Jy47xeK2UeVQ&s=09" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-1 hover:shadow-2 hover:bg-white/20 transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/marinecatch-africa-limited/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-1 hover:shadow-2 hover:bg-white/20 transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/marinecatch_africa?igshid=Y2IzZGU1MTFhOQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-1 hover:shadow-2 hover:bg-white/20 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xl font-semibold mb-6 uppercase tracking-wide">Solutions</h4>
            <ul className="space-y-3 text-primary-foreground/90">
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">For Fishers</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">For Buyers</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">For Processors</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">For Regulators</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">API Integration</a></li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-xl font-semibold mb-6 uppercase tracking-wide">Technology</h4>
            <ul className="space-y-3 text-primary-foreground/90">
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">Blockchain</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">IoT Solutions</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">Mobile App</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">Analytics</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">Security</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-6 uppercase tracking-wide">Contact Us</h4>
            <div className="space-y-4 text-primary-foreground/90">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center shadow-1">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@marinecatchafrica.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center shadow-1">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+254 707939810</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center shadow-1">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Beach Road, Diani, Ukunda</span>
              </div>
            </div>
            
            <Button variant="logo" className="mt-6 w-full shadow-2 hover:shadow-3 transition-all duration-300 uppercase tracking-wider">
              Get in Touch
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-primary-foreground/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MarineCatch Africa. All rights reserved.
          </div>
          <div className="flex space-x-8 text-sm text-primary-foreground/70">
            <Link to="/privacy-policy" className="hover:text-secondary transition-colors uppercase tracking-wider">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-secondary transition-colors uppercase tracking-wider">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-secondary transition-colors uppercase tracking-wider">Cookie Policy</Link>
            <Link to="/faq" className="hover:text-secondary transition-colors uppercase tracking-wider">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;