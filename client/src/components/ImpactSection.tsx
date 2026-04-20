import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Leaf, Globe } from "lucide-react";
import communityImage from "@/assets/community-impact.jpg";

const ImpactSection = () => {
  const impactStats = [
    {
      icon: <TrendingUp className="h-8 w-8 text-success" />,
      number: "40%",
      label: "Increase in Fisher Income",
      description: "Direct market access eliminates middlemen"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      number: "10,000+",
      label: "Fishing Families Empowered",
      description: "Across 15 African coastal countries"
    },
    {
      icon: <Leaf className="h-8 w-8 text-accent" />,
      number: "95%",
      label: "Sustainable Sourcing",
      description: "Certified sustainable fishing practices"
    },
    {
      icon: <Globe className="h-8 w-8 text-secondary" />,
      number: "$5M+",
      label: "Total Trade Value",
      description: "Transparent, fair trade transactions"
    }
  ];

  const testimonials = [
    {
      name: "Bakari Juma",
        role: "Small-scale Fisher, Shimoni",
      content: "MarineCatch Africa changed my life. I now get fair prices for my fish and can access loans to improve my boat. My family's income has doubled!",
      avatar: "👨🏿‍🦲"
    },
    {
      name: "Blue Marine",
      role: "Seafood Processor, S.A", 
      content: "The traceability features help us ensure quality and meet international standards. Our exports have increased by 60% since joining the platform.",
      avatar: "/team/white-blue marine.jpeg"
    },
    {
      name: "Dr. Sarah Okonkwo",
      role: "Marine Biologist",
      content: "This platform is revolutionizing sustainable fishing in Africa. The data insights help us monitor fish populations and promote conservation.",
      avatar: "👩🏿‍🔬"
    }
  ];

  return (
    <section id="impact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Creating Lasting Impact Across Africa
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our technology is transforming lives, communities, and ecosystems across the African coast. 
            See the real impact we're making together.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-4 gap-10 mb-24">
          {impactStats.map((stat, index) => (
            <Card key={index} className="text-center shadow-2 hover:shadow-4 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex justify-center mb-5">
                  <div className="h-10 w-10 transform hover:scale-110 transition-all duration-300">{stat.icon}</div>
                </div>
                <div className="text-4xl font-bold text-foreground mb-3">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 uppercase tracking-wide">
                  {stat.label}
                </h3>
                <p className="text-muted-foreground text-sm tracking-wide">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Impact Image */}
        <div className="relative mb-20 rounded-2xl overflow-hidden shadow-3 hover:shadow-4 transition-all duration-300">
          <img 
            src={communityImage} 
            alt="Empowered fishing community celebration" 
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                Empowering Communities, Preserving Oceans
              </h3>
              <p className="text-lg text-white/90 max-w-2xl">
                When fishers prosper, entire communities thrive. Our platform creates ripple effects 
                that strengthen local economies while promoting sustainable fishing practices.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-14 tracking-tight uppercase">
            Voices from Our Community
          </h3>
          
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-2 hover:shadow-4 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-5 mb-6">
                    {testimonial.avatar.startsWith('/') ? (
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="h-12 w-12 rounded-full object-cover transform hover:scale-110 transition-all duration-300" 
                      />
                    ) : (
                      <div className="text-5xl transform hover:scale-110 transition-all duration-300">{testimonial.avatar}</div>
                    )}
                    <div>
                      <h4 className="font-semibold text-foreground tracking-tight">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic text-base">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sustainability Commitment */}
        <div className="bg-gradient-logo rounded-2xl p-10 text-white text-center shadow-3 hover:shadow-4 transition-all duration-300">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight uppercase">
            Our Commitment to Sustainability
          </h3>
          <p className="text-white/90 mb-8 max-w-3xl mx-auto text-lg">
            We believe that technology can drive both economic growth and environmental conservation. 
            Every transaction on our platform contributes to a more sustainable future for Africa's oceans.
          </p>
          
          <div className="grid md:grid-cols-3 gap-10 mt-10">
            <div>
              <div className="text-4xl mb-3 transform hover:scale-110 transition-all duration-300">🌊</div>
              <h4 className="font-semibold mb-3 uppercase tracking-wide">Ocean Health</h4>
              <p className="text-white/80 text-sm tracking-wide">Promoting sustainable fishing quotas and practices</p>
            </div>
            <div>
              <div className="text-4xl mb-3 transform hover:scale-110 transition-all duration-300">🔄</div>
              <h4 className="font-semibold mb-3 uppercase tracking-wide">Circular Economy</h4>
              <p className="text-white/80 text-sm tracking-wide">Reducing waste through efficient supply chains</p>
            </div>
            <div>
              <div className="text-4xl mb-3 transform hover:scale-110 transition-all duration-300">🌱</div>
              <h4 className="font-semibold mb-3 uppercase tracking-wide">Community Growth</h4>
              <p className="text-white/80 text-sm tracking-wide">Investing in local education and infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;