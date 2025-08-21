import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Footer } from '@/components/Footer';
import { 
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  Calendar,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Globe,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    description: 'Mon-Fri 9am-6pm CST',
    value: '+1 (469) 742-0195',
    action: 'tel:+14697420195',
    buttonText: 'Call Now'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Quick responses',
    value: 'Message us',
    action: 'https://wa.me/14697420195',
    buttonText: 'Chat Now'
  },
  {
    icon: Mail,
    title: 'Email',
    description: '24-hour response',
    value: 'arvind@copperreels.com',
    action: 'mailto:arvind@copperreels.com',
    buttonText: 'Send Email'
  },
  {
    icon: Calendar,
    title: 'Schedule Call',
    description: '30-min consultation',
    value: 'Book a time',
    action: 'https://calendly.com/arvindsarin/30min',
    buttonText: 'Book Call'
  }
];

const faqs = [
  {
    question: 'How quickly can I get started?',
    answer: 'Immediately! Sign up for your 30-day free trial and start creating content within minutes.'
  },
  {
    question: 'Do you offer custom enterprise solutions?',
    answer: 'Yes! We work with agencies and large creators on custom packages. Contact us to discuss.'
  },
  {
    question: 'What support is included?',
    answer: 'All plans include email support. We also offer priority WhatsApp support for video editing clients.'
  },
  {
    question: 'Can you help with my existing channel?',
    answer: 'Absolutely! We analyze your current content and provide strategies for improvement.'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll respond within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
              <Headphones className="w-3 h-3 mr-1" />
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Talk About Your <span className="text-gradient">YouTube Growth</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Whether you need AI tools, video editing, or strategy advice - we're here to help
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                  <p className="font-medium mb-4">{method.value}</p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(method.action, method.action.startsWith('http') ? '_blank' : '_self')}
                  >
                    {method.buttonText}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Info */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      placeholder="Tell us about your YouTube goals..."
                      className="min-h-[150px]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Info & FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Office Info */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Office Location
                </h3>
                <p className="text-muted-foreground mb-2">
                  4100 Spring Valley Rd, STE 525<br />
                  Dallas, TX 75244<br />
                  United States
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <Clock className="w-4 h-4" />
                  Monday - Friday, 9:00 AM - 6:00 PM CST
                </div>
              </Card>

              {/* Quick FAQs */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                      <h4 className="font-medium mb-1 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                        {faq.question}
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Response Time */}
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Fast Response Time</h4>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 2-4 hours during business hours
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
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
            <Badge className="mb-4" variant="default">
              <Globe className="w-3 h-3 mr-1" />
              Global Support
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Serving Creators Worldwide
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              From Dallas to anywhere in the world - we help creators grow their YouTube channels
            </p>
            <Button size="lg" onClick={() => window.open('https://calendly.com/arvindsarin/30min', '_blank')}>
              Schedule a Free Consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}