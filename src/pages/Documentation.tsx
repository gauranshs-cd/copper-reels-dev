import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { 
  BookOpen,
  Video,
  FileText,
  Code,
  HelpCircle,
  Search,
  ChevronRight,
  PlayCircle,
  Download,
  ExternalLink,
  Zap,
  Target,
  Sparkles,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Documentation sections
const docSections = [
  {
    title: 'Getting Started',
    icon: Rocket,
    items: [
      { title: 'Quick Start Guide', time: '5 min', url: '#quick-start' },
      { title: 'Setting Up Your Profile', time: '3 min', url: '#profile-setup' },
      { title: 'Understanding the Dashboard', time: '4 min', url: '#dashboard' },
      { title: 'Your First Video Script', time: '10 min', url: '#first-script' }
    ]
  },
  {
    title: 'Core Features',
    icon: Zap,
    items: [
      { title: 'Foundation Builder', time: '8 min', url: '#foundation' },
      { title: 'AI Ideation Engine', time: '6 min', url: '#ideation' },
      { title: 'Video Planning System', time: '7 min', url: '#planning' },
      { title: 'Script Generation', time: '10 min', url: '#script-gen' }
    ]
  },
  {
    title: 'Advanced Techniques',
    icon: Target,
    items: [
      { title: 'Viral Pattern Analysis', time: '12 min', url: '#patterns' },
      { title: 'Thumbnail Psychology', time: '8 min', url: '#thumbnails' },
      { title: 'Hook Optimization', time: '9 min', url: '#hooks' },
      { title: 'Retention Strategies', time: '11 min', url: '#retention' }
    ]
  },
  {
    title: 'Helpful Practices',
    icon: Lightbulb,
    items: [
      { title: 'Content Strategy Framework', time: '15 min', url: '#strategy' },
      { title: 'Audience Avatar Deep Dive', time: '10 min', url: '#avatar' },
      { title: 'YouTube Algorithm 2025', time: '12 min', url: '#algorithm' },
      { title: 'Monetization Strategies', time: '14 min', url: '#monetization' }
    ]
  }
];

const videoTutorials = [
  {
    title: 'Complete Platform Walkthrough',
    duration: '12:34',
    thumbnail: '🎥',
    description: 'End-to-end tutorial of all features'
  },
  {
    title: 'Creating Your First Viral Script',
    duration: '08:45',
    thumbnail: '📝',
    description: 'Step-by-step script creation process'
  },
  {
    title: 'Using AI Ideation Effectively',
    duration: '10:22',
    thumbnail: '💡',
    description: 'Generate unlimited content ideas'
  },
  {
    title: 'Thumbnail & Title Optimization',
    duration: '07:15',
    thumbnail: '🎨',
    description: 'Maximize your click-through rate'
  }
];

const faqs = [
  {
    question: 'How does the AI understand my content niche?',
    answer: 'Our AI is trained on millions of successful YouTube videos across all niches. When you complete the Foundation setup, it learns your specific avatar, content pillars, and goals to generate hyper-relevant content.'
  },
  {
    question: 'Can I edit the AI-generated scripts?',
    answer: 'Absolutely! Every script is fully editable. The AI provides a strong foundation based on proven patterns, but you have complete control to add your unique voice and style.'
  },
  {
    question: 'How many videos can I create per month?',
    answer: 'There are no limits on content generation. Create as many scripts, titles, and thumbnails as you need. We believe in empowering creators without artificial restrictions.'
  },
  {
    question: 'What makes Copper Reels different from other AI tools?',
    answer: 'We combine $650k+ of investment in training, technology, and team. Our AI uses strategies from successful creators, not just generic content generation. Plus, our human team provides dedicated support.'
  },
  {
    question: 'Do you offer video editing services?',
    answer: 'Yes! We have a team of editors who work faster than AI while maintaining premium quality. Check our Services page for video editing packages starting at $150/minute.'
  }
];

export default function Documentation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
              <BookOpen className="w-3 h-3 mr-1" />
              Documentation & Help
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to <span className="text-gradient">Use</span> Copper Reels
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive guides, video tutorials, and helpful tips to create YouTube content with AI
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documentation, tutorials, or FAQs..."
                className="pl-12 pr-4 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Rocket, label: 'Quick Start', color: 'from-primary/20 to-primary/10', link: '#quick-start' },
              { icon: Video, label: 'Video Tutorials', color: 'from-primary/30 to-primary/20', link: '#tutorials' },
              { icon: HelpCircle, label: 'FAQs', color: 'from-primary/40 to-primary/30', link: '#faqs' },
              { icon: MessageCircle, label: 'Contact Support', color: 'from-primary/50 to-primary/40', link: '/contact' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden group"
                  onClick={() => item.link.startsWith('/') ? navigate(item.link) : window.location.hash = item.link}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-20",
                    item.color
                  )} />
                  <div className="relative z-10">
                    <item.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold">{item.label}</h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Grid */}
      <section className="py-20" id="docs">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Complete Documentation</h2>
            <p className="text-muted-foreground">
              Organized by topic to help you find exactly what you need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {docSections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.url}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {item.time}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 bg-muted/30" id="tutorials">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="default">
              <Video className="w-3 h-3 mr-1" />
              Video Tutorials
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Learn by Watching</h2>
            <p className="text-muted-foreground">
              Visual guides to help you use every feature
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {videoTutorials.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden cursor-pointer group hover:scale-105 transition-transform">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-4xl relative">
                    {video.thumbnail}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">{video.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary">{video.duration}</span>
                      <Button size="sm" variant="ghost">
                        Watch Now
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20" id="faqs">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQs
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-7">{faq.answer}</p>
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
            <h2 className="text-3xl font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our team is here to help you succeed. Get personalized support from our experienced team.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/contact')}>
                Contact Support
                <MessageCircle className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('https://calendly.com/arvindsarin/30min', '_blank')}>
                Book a Call
                <ArrowRight className="w-4 h-4 ml-2" />
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