import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LogIn, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import WaitlistDialog from "./WaitlistDialog";
import { useAuth } from "@/lib/auth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin": return "/admin";
      case "fisher": return "/fisher";
      case "buyer": return "/buyer";
      default: return "/login";
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-2 py-2' : 'bg-transparent py-4'}`}>
      {/* Background gradient overlay when scrolled */}
      <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>
      <nav className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/1ae85f32-514d-4783-b0e2-40848366203f.png" 
              alt="MarineCatch Africa Logo" 
              className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-14'} w-auto filter drop-shadow-md`}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {[
              { href: "#home", label: "Home", testId: "link-nav-home" },
              { href: "#solutions", label: "Solutions", testId: "link-nav-solutions" },
              { href: "#technology", label: "Technology", testId: "link-nav-technology" },
              { href: "#impact", label: "Impact", testId: "link-nav-impact" },
              { href: "#team", label: "Team", testId: "link-nav-team" },
              { href: "#marine-life", label: "MarineCatch Network", testId: "link-nav-network" }
            ].map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium relative group uppercase tracking-wide text-sm ${scrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'}`}
                data-testid={item.testId}
              >
                {item.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Link href={getDashboardPath()}>
                <Button variant="logo" size="default" className="shadow-2 hover:shadow-3" data-testid="button-nav-dashboard">
                  <span>Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant={scrolled ? 'ghost' : 'outline'} size="default" className={scrolled ? '' : 'text-white border-white/30'} data-testid="button-nav-login">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="logo" size="default" className="shadow-2" data-testid="button-nav-register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-full transition-all duration-200 ${scrolled ? 'text-primary' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden pb-4 bg-gradient-to-b from-white to-blue-50 backdrop-blur-md rounded-r-xl shadow-lg absolute left-0 top-16 bottom-0 w-72 transform transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
          <div className="flex flex-col space-y-1 pt-6 px-6">
            {[
              { href: "#home", label: "Home", testId: "link-mobile-home" },
              { href: "#solutions", label: "Solutions", testId: "link-mobile-solutions" },
              { href: "#technology", label: "Technology", testId: "link-mobile-technology" },
              { href: "#impact", label: "Impact", testId: "link-mobile-impact" },
              { href: "#team", label: "Team", testId: "link-mobile-team" },
              { href: "#marine-life", label: "MarineCatch Network", testId: "link-mobile-network" }
            ].map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className="px-5 py-3.5 rounded-lg text-foreground transition-all duration-200 font-medium flex items-center group animate-in fade-in slide-in-from-left-4 uppercase tracking-wide text-sm hover-elevate"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={item.testId}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-5 mt-4 border-t border-muted/50 space-y-2">
              {isAuthenticated ? (
                <Link href={getDashboardPath()} onClick={() => setIsMenuOpen(false)}>
                  <Button variant="logo" size="default" className="w-full shadow-md" data-testid="button-mobile-dashboard">
                    <span>Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="default" className="w-full" data-testid="button-mobile-login">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="logo" size="default" className="w-full shadow-md" data-testid="button-mobile-register">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Register</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;