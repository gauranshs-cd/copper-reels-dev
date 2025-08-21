import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { 
  Briefcase,
  Users,
  Rocket,
  Heart,
  Target,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Video,
  Edit,
  Brain,
  TrendingUp,
  Gift,
  Coffee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const openPositions = [
  {
    title: 'Video Editor',
    type: 'Full-time / Contract',
    location: 'Remote',
    department: 'Production',
    description: 'Edit YouTube videos with our signature style. Must be proficient in Premiere Pro/Final Cut and understand YouTube retention strategies.',
    requirements: [
      '2+ years editing YouTube content',
      'Portfolio showing retention-focused editing',
      'Fast turnaround times (24-48 hours)',
      'Understanding of hooks and pacing'
    ],
    salary: '$150/video minute edited'
  },
  {
    title: 'YouTube Strategy Consultant',
    type: 'Part-time',
    location: 'Remote',
    department: 'Strategy',
    description: 'Help clients develop content strategies and analyze their YouTube analytics for growth opportunities.',
    requirements: [
      'Proven track record growing YouTube channels',
      'Deep understanding of YouTube algorithm',
      'Excellent communication skills',
      'Data analysis experience'
    ],
    salary: '$75-$150/hour'
  },
  {
    title: 'AI Training Specialist',
    type: 'Contract',
    location: 'Remote',
    department: 'Technology',
    description: 'Help train and improve our AI models by analyzing successful YouTube content patterns.',
    requirements: [
      'Experience with content analysis',
      'Understanding of viral content patterns',
      'Attention to detail',
      'Basic Python knowledge (preferred)'
    ],
    salary: '$40-$60/hour'
  }
];

const benefits = [
  {
    icon: DollarSign,
    title: 'Competitive Pay',
    description: 'Above market rates for quality work'
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Work when you\'re most creative'
  },
  {
    icon: MapPin,
    title: 'Remote First',
    description: 'Work from anywhere in the world'
  },
  {
    icon: Rocket,
    title: 'Growth Path',
    description: 'Clear advancement opportunities'
  },
  {
    icon: Gift,
    title: 'Profit Sharing',
    description: 'Share in our success'
  },
  {
    icon: Coffee,
    title: 'Creative Freedom',
    description: 'Bring your ideas to life'
  }
];

const values = [
  {
    title: 'Quality Over Quantity',
    description: 'We believe in doing fewer things exceptionally well rather than many things adequately.'
  },
  {
    title: 'Creator First',
    description: 'Every decision we make starts with "How does this help creators succeed?"'
  },
  {
    title: 'Continuous Learning',
    description: 'YouTube changes fast. We invest heavily in staying ahead of the curve.'
  },
  {
    title: 'No Nickel & Diming',
    description: 'We provide full service and support. No hidden fees or surprise charges.'
  }
];

export default function Careers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <section className="py-20 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <Briefcase className="w-3 h-3 mr-1" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Help Creators <span className="text-gradient">Change Lives</span> Through Video
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join a team that's invested $650K+ in building the future of YouTube content creation
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}>
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                Contact HR
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="default">
              <Heart className="w-3 h-3 mr-1" />
              Why Copper Reels
            </Badge>
            <h2 className="text-3xl font-bold mb-4">A Different Kind of Company</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're not just another tech company. We're creators helping creators, with a genuine mission to democratize YouTube success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-muted/30" id="positions">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              <Users className="w-3 h-3 mr-1" />
              Open Positions
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Current Opportunities</h2>
            <p className="text-muted-foreground">
              Join us in building the future of content creation
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 hover:scale-102 transition-transform">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {position.type}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {position.department}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-600">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {position.salary}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {position.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button onClick={() => navigate('/contact')}>
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4" variant="default">
              <Sparkles className="w-3 h-3 mr-1" />
              Our Culture
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Built by Creators, For Creators
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              We understand the creator journey because we've lived it. Our team includes successful YouTubers, 
              editors who've worked on viral videos, and engineers who are passionate about content.
            </p>
            <Card className="p-8 bg-primary/5 border-primary/20">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$650K+</div>
                  <p className="text-sm text-muted-foreground">Invested in learning & tech</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                  <p className="text-sm text-muted-foreground">Videos analyzed</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-sm text-muted-foreground">Creator support</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Don't See Your Role?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              We're always looking for talented people who share our passion for helping creators succeed.
              Send us your resume and tell us how you can contribute.
            </p>
            <Button size="lg" onClick={() => navigate('/contact')}>
              Send Your Resume
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}