import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Award,
  Users,
  Target,
  Sparkles,
  Building,
  Mail,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  Heart,
  Clock,
  Zap,
  Star,
  Camera,
  Video,
  Coffee,
  Home,
  Building2,
  Rocket,
  TrendingUp,
  DollarSign,
  Trophy,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Import team photos
import neonSign from '@/assets/team-photos/just the initial neon sign at first home office.jpeg';
import earlyOffice from '@/assets/team-photos/early picture in early office in front of the neon sign.jpeg';
import teamExcited from '@/assets/team-photos/team excited about posting important video.JPG';
import teamVisit from '@/assets/team-photos/picture with th team when someone visited from states and was leaving after long day.jpeg';
import amanEditor from '@/assets/team-photos/aman one of our editors who edits faster than ai.jpeg';
import familyPhoto from '@/assets/team-photos/me and my mom, my parents live with me in Dallas.jpeg';
import arvindProfile from '@/assets/team-photos/Arvind another solo Image (1).png';
import arvindTransparent from '@/assets/team-photos/My_Pic-removebg-preview.png';

// Animated Counter Component
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Timeline data
const timelineEvents = [
  {
    year: '2010',
    title: 'The Beginning',
    description: 'Started as Copper Mobile with a vision to transform digital experiences',
    icon: Rocket,
    color: 'from-primary/20 to-primary/10'
  },
  {
    year: '2015',
    title: 'First 100 Clients',
    description: 'Reached milestone serving enterprise clients like VISA and Verizon',
    icon: Trophy,
    color: 'from-primary/30 to-primary/20'
  },
  {
    year: '2020',
    title: 'Creator Economy Pivot',
    description: 'Invested $650k+ total: $50k in masterclasses, $300k in tech, $300k in our team',
    icon: Video,
    color: 'from-primary/40 to-primary/30'
  },
  {
    year: '2023',
    title: 'AI Integration',
    description: 'Launched CopperReels combining human expertise with AI technology',
    icon: Sparkles,
    color: 'from-primary/50 to-primary/40'
  },
  {
    year: '2025',
    title: 'Global Scale',
    description: '1,200+ clients worldwide, democratizing viral content creation',
    icon: Globe,
    color: 'from-primary/60 to-primary/50'
  }
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring animations for parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Multiple parallax layers
  const y1 = useTransform(smoothProgress, [0, 1], [0, -300]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, -50]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 1.2]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [1, 1, 0.5, 0]);

  return (
    <div className="min-h-screen bg-gradient-mesh" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: y1 }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </motion.div>

        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: y2 }}
        >
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div 
              className="mb-6"
              style={{ scale }}
            >
              <Badge className="mb-4 px-4 py-2 text-sm" variant="secondary">
                <Heart className="w-4 h-4 mr-2" />
                Our Journey
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ opacity }}
            >
              <span className="text-gradient">$650,000+</span> Invested
              <br />
              in Building Excellence
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              $50k+ in masterclasses, $300k in technology, $300k in talented team members—all to help creators succeed on YouTube
            </motion.p>

            {/* Stats Cards */}
            <motion.div 
              className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">
                  <AnimatedCounter value={15} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </Card>
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">
                  <AnimatedCounter value={1200} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </Card>
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">
                  <AnimatedCounter value={650} prefix="$" suffix="k+" />
                </div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
              </Card>
              <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">
                  <AnimatedCounter value={100} suffix="M+" />
                </div>
                <p className="text-sm text-muted-foreground">Views Generated</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Interactive Timeline Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="default">
              <Clock className="w-3 h-3 mr-1" />
              Our Evolution
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              15 Years of <span className="text-gradient">Innovation</span>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/50 via-primary/30 to-primary/10" />
            
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative flex items-center mb-16",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <div className="flex-1">
                  <Card className={cn(
                    "p-6 relative overflow-hidden group hover:scale-105 transition-transform",
                    index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                  )}>
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-10",
                      event.color
                    )} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <event.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-2xl font-bold text-primary">{event.year}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </Card>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                  <motion.div
                    className="w-6 h-6 bg-primary rounded-full border-4 border-background"
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                </div>
                
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery with Advanced Animations */}
      <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="default">
              <Camera className="w-3 h-3 mr-1" />
              Behind the Scenes
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-gradient">Journey</span> in Pictures
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From a home office with a neon sign to a global team serving creators worldwide
            </p>
          </motion.div>

          {/* Masonry Grid with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              { img: neonSign, title: "The Beginning", desc: "Our first home office", delay: 0, span: "lg:row-span-2" },
              { img: earlyOffice, title: "First Office", desc: "Growing beyond home", delay: 0.1 },
              { img: teamExcited, title: "Celebrating Wins", desc: "Every video matters", delay: 0.2 },
              { img: teamVisit, title: "Client Love", desc: "Going the extra mile", delay: 0.3, span: "lg:col-span-2" },
              { img: amanEditor, title: "Speed Demon", desc: "Faster than AI", delay: 0.4 },
              { img: familyPhoto, title: "Family Values", desc: "What drives us", delay: 0.5 }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay }}
                className={cn("group relative", item.span)}
              >
                <Card className="overflow-hidden h-full relative">
                  <div className="relative overflow-hidden h-full min-h-[300px]">
                    <motion.img 
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <Badge className="mb-2 bg-primary text-primary-foreground">
                        {index + 1} / 6
                      </Badge>
                      <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                      <p className="text-white/90">{item.desc}</p>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section with Video Background */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">
                <Star className="w-3 h-3 mr-1" />
                Leadership
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meet the <span className="text-gradient">Founder</span>
              </h2>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-96 md:h-auto bg-gradient-to-br from-primary/20 to-primary/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <motion.div 
                        className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"
                        animate={{ 
                          boxShadow: [
                            "0 0 0 0px rgba(var(--primary), 0.2)",
                            "0 0 0 20px rgba(var(--primary), 0)",
                            "0 0 0 0px rgba(var(--primary), 0)"
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <img 
                          src={arvindProfile} 
                          alt="Arvind Sarin"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <Button 
                        size="icon" 
                        className="absolute -bottom-2 -right-2 rounded-full bg-primary hover:bg-primary/90"
                      >
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-2">Arvind Sarin</h3>
                  <p className="text-primary mb-6">Founder & CEO</p>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Track Record</h4>
                      </div>
                      <p className="text-muted-foreground">
                        15+ years building digital products for Fortune 500 companies including VISA, Verizon, and Cisco
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Creator Investment</h4>
                      </div>
                      <p className="text-muted-foreground">
                        Invested $50,000+ learning from top YouTube strategists and turned that knowledge into scalable AI systems
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Personal Touch</h4>
                      </div>
                      <p className="text-muted-foreground">
                        Lives with parents in Dallas, bringing family values to every client relationship
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button variant="default" onClick={() => window.open('https://linkedin.com/in/arvindsarin', '_blank')}>
                      <Linkedin className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline" onClick={() => window.open('mailto:arvind@copperreels.com', '_blank')}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Value Props with Glassmorphism */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why We're <span className="text-gradient">Different</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Our editors work faster than AI while maintaining premium quality",
                gradient: "from-primary/30 to-primary/10"
              },
              {
                icon: Heart,
                title: "We Actually Care",
                desc: "We've flown to clients when they needed us. That's our commitment level.",
                gradient: "from-primary/40 to-primary/20"
              },
              {
                icon: TrendingUp,
                title: "Proven Results",
                desc: "1,200+ success stories speak louder than any promise we could make",
                gradient: "from-primary/50 to-primary/30"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm border-primary/20">
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity",
                    item.gradient
                  )} />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-gradient">Transform</span> Your Content?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join 1,200+ creators who've already discovered the Copper Reels difference
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Book a Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}