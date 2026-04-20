import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter, Mail } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Kennedy Kitavi",
      role: "CEO & Co-Founder",
      bio: "Early career ocean professional driving innovation in marine technology and sustainability for Africa’s blue economy (Eco-M.",
      avatar: "/team/kennedy-kitavi.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "kennedy@marinecatchafrica.com"
      }
    },
    {
      name: "Zachary Githua",
      role: "CTO & Co-Founder", 
      bio: "Microsoft-certified in cybersecurity, specializing in blockchain, AI, and sustainability-focused tech solutions.",
      avatar: "/team/zack.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "zack@marinecatchafrica.com"
      }
    },
    {
      name: "Muna Abdulkadir",
      role: "Head of Sales & Marketing",
      bio: "Expert in business development and market expansion, driving revenue growth and brand visibility across 38 African nations.",
      avatar: "/team/muna.jpg",
      social: {
        linkedin: "#",
        twitter: "#", 
        email: "muna@marinecatchafrica.com"
      }
    },
    {
      name: "Theo Matundura",
      role: "VP of Finance & Operations",
      bio: "Kenyan corporate law expert overseeing operations and compliance.",
      avatar: "/team/theo.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "theo@marinecatchafrica.com"
      }
    },
    {
      name: "Muthoni Murungi",
      role: "Head of Community Partnerships",
      bio: "Solutions architect fostering community partnerships.",
      avatar: "/team/muthoni.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "muthoni@marinecatchafrica.com"
      }
    }
  ];

  return (
    <section id="team" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Meet Our Leadership Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our diverse team combines deep African market expertise with cutting-edge technology experience. 
            Together, we're building the future of sustainable seafood in Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group shadow-2 hover:shadow-4 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                {/* Avatar */}
                <div className="relative mb-8">
                  <div className="w-28 h-28 mx-auto bg-gradient-logo rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-105 transition-transform duration-300 shadow-2">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-logo rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold mb-4 uppercase tracking-wider text-sm">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center space-x-5">
                  <a
                    href={member.social.linkedin}
                    className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-1 hover:shadow-2"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="w-12 h-12 bg-accent/10 hover:bg-accent hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-1 hover:shadow-2"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="w-12 h-12 bg-secondary/10 hover:bg-secondary hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-1 hover:shadow-2"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Values */}
        <div className="bg-card rounded-xl p-10 shadow-3 hover:shadow-4 transition-all duration-300">
          <h3 className="text-2xl font-bold text-center text-foreground mb-10">
            Our Shared Values
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-4 rounded-lg hover:bg-muted/20 transition-colors duration-300">
              <div className="w-20 h-20 bg-gradient-logo rounded-full flex items-center justify-center mx-auto mb-6 shadow-2 transform hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">🌊</span>
              </div>
              <h4 className="font-semibold text-foreground mb-3 text-lg uppercase tracking-wide">Sustainability</h4>
              <p className="text-muted-foreground text-sm">Safeguarding Africa’s marine ecosystems.</p>
            </div>
            
            <div className="text-center p-4 rounded-lg hover:bg-muted/20 transition-colors duration-300">
              <div className="w-20 h-20 bg-gradient-logo rounded-full flex items-center justify-center mx-auto mb-6 shadow-2 transform hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">🤝</span>
              </div>
              <h4 className="font-semibold text-foreground mb-3 text-lg uppercase tracking-wide">Empowerment</h4>
              <p className="text-muted-foreground text-sm">Equipping communities for success.</p>
            </div>
            
            <div className="text-center p-4 rounded-lg hover:bg-muted/20 transition-colors duration-300">
              <div className="w-20 h-20 bg-gradient-logo rounded-full flex items-center justify-center mx-auto mb-6 shadow-2 transform hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">🔍</span>
              </div>
              <h4 className="font-semibold text-foreground mb-3 text-lg uppercase tracking-wide">Transparency</h4>
              <p className="text-muted-foreground text-sm">Building trust through supply chain visibility.</p>
            </div>
            
            <div className="text-center p-4 rounded-lg hover:bg-muted/20 transition-colors duration-300">
              <div className="w-20 h-20 bg-gradient-logo rounded-full flex items-center justify-center mx-auto mb-6 shadow-2 transform hover:scale-105 transition-transform duration-300">
                <span className="text-3xl">💡</span>
              </div>
              <h4 className="font-semibold text-foreground mb-3 text-lg uppercase tracking-wide">Innovation</h4>
              <p className="text-muted-foreground text-sm">Driving impact with technology.</p>
            </div>
          </div>
        </div>

        {/* Join Team CTA section removed as requested */}
      </div>
    </section>
  );
};

export default TeamSection;