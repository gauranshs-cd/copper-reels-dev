import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/Footer';
import { 
  Shield,
  Lock,
  Eye,
  UserCheck,
  Database,
  Globe,
  Mail,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    icon: Database,
    content: [
      'Account information (name, email, channel details)',
      'Content preferences and avatar data',
      'Usage analytics to improve our service',
      'Payment information (processed securely via Stripe)'
    ]
  },
  {
    title: 'How We Use Your Information',
    icon: UserCheck,
    content: [
      'Provide and improve our AI content generation',
      'Process payments and manage subscriptions',
      'Send service updates and helpful tips',
      'Analyze usage patterns to enhance features'
    ]
  },
  {
    title: 'Data Security',
    icon: Lock,
    content: [
      'SSL encryption for all data transmission',
      'Secure cloud storage with encryption at rest',
      'Regular security audits and updates',
      'PCI compliant payment processing'
    ]
  },
  {
    title: 'Your Rights',
    icon: Shield,
    content: [
      'Access your personal data anytime',
      'Request data correction or deletion',
      'Opt-out of marketing communications',
      'Export your content and data'
    ]
  }
];

const commitments = [
  'We never sell your personal information',
  'Your content ideas remain your intellectual property',
  'We use industry-standard security measures',
  'You can delete your account and data anytime',
  'We only share data with your explicit consent'
];

export default function Privacy() {
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
              <Shield className="w-3 h-3 mr-1" />
              Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Privacy is Our <span className="text-gradient">Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              We believe in complete transparency about how we handle your data
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: January 21, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 bg-primary/5 border-primary/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Our Privacy Commitments
              </h2>
              <div className="space-y-2">
                {commitments.map((commitment, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span>{commitment}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  Copper Reels ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you use our platform.
                </p>
                <p className="text-muted-foreground">
                  By using Copper Reels, you agree to the collection and use of information in 
                  accordance with this policy. If you do not agree with our policies and practices, 
                  please do not use our services.
                </p>
              </Card>
            </motion.div>

            {/* Policy Sections */}
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <section.icon className="w-6 h-6 text-primary" />
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}

            {/* Data Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Information Sharing
                </h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties. 
                  This does not include trusted third parties who assist us in:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    Operating our platform (hosting, analytics)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    Processing payments (Stripe)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    Sending email communications (when opted-in)
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  These parties agree to keep this information confidential and use it only for 
                  the purposes we specify.
                </p>
              </Card>
            </motion.div>

            {/* Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-primary" />
                  Cookies and Tracking
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    Keep you logged in to your account
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    Remember your preferences
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                    Analyze usage to improve our service
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  You can instruct your browser to refuse all cookies or indicate when a cookie 
                  is being sent. However, some features may not function properly without cookies.
                </p>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary" />
                  Contact Us
                </h2>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> arvind@copperreels.com</p>
                  <p><strong>Phone:</strong> +1 (469) 742-0195</p>
                  <p><strong>Address:</strong><br />
                    Copper Reels<br />
                    4100 Spring Valley Rd, STE 525<br />
                    Dallas, TX 75244<br />
                    United States
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-muted/50">
                <h2 className="text-xl font-bold mb-4">Policy Updates</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new Privacy Policy on this page and updating the "Last updated" 
                  date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}