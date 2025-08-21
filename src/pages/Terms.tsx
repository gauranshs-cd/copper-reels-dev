import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/Footer';
import { 
  FileText,
  Shield,
  Scale,
  AlertCircle,
  CheckCircle2,
  Building2,
  Mail,
  Globe,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();
  const lastUpdated = 'August 21, 2025';
  const effectiveDate = 'January 1, 2025';

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
              <Scale className="w-3 h-3 mr-1" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Please read these terms carefully before using Copper Reels
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Effective: {effectiveDate}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Updated: {lastUpdated}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legal Entity Notice */}
      <section className="py-8 bg-primary/5 border-b">
        <div className="container mx-auto px-4">
          <Card className="p-6 max-w-4xl mx-auto border-primary/20">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Legal Entity Information</h3>
                <p className="text-muted-foreground">
                  Copper Reels is a DBA (Doing Business As) of <strong>Copper Digital, Inc.</strong>, 
                  a Delaware corporation headquartered in Dallas, Texas. All legal agreements, 
                  obligations, and rights described herein are with Copper Digital, Inc.
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p><strong>Corporate Name:</strong> Copper Digital, Inc.</p>
                  <p><strong>DBA:</strong> Copper Reels</p>
                  <p><strong>Address:</strong> 4100 Spring Valley Rd, STE 525, Dallas, TX 75244</p>
                  <p><strong>Contact:</strong> arvind@copperreels.com</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            
            {/* 1. Acceptance of Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Acceptance of Terms
              </h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using Copper Reels ("Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
              <Card className="p-4 bg-muted/30 border-l-4 border-l-primary">
                <p className="text-sm">
                  These Terms constitute a legally binding agreement between you and Copper Digital, Inc. 
                  regarding your use of the Copper Reels platform and services.
                </p>
              </Card>
            </motion.div>

            {/* 2. Service Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Service Description
              </h2>
              <p className="text-muted-foreground mb-4">
                Copper Reels provides AI-powered YouTube content creation tools, including but not limited to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>AI-generated video scripts based on viral patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Content ideation and planning tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Thumbnail and title optimization suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <span>Video editing services (separate pricing)</span>
                </li>
              </ul>
            </motion.div>

            {/* 3. User Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> User Accounts
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  When you create an account with us, you must provide information that is accurate, 
                  complete, and current at all times. You are responsible for safeguarding the password 
                  and for all activities that occur under your account.
                </p>
                <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <p className="text-sm">
                      You must notify us immediately upon becoming aware of any breach of security 
                      or unauthorized use of your account.
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* 4. Acceptable Use */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Acceptable Use Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Violate any laws or regulations</li>
                <li>• Infringe on intellectual property rights</li>
                <li>• Generate harmful, offensive, or misleading content</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Use the service for spam or fraudulent purposes</li>
                <li>• Resell or redistribute our services without permission</li>
              </ul>
            </motion.div>

            {/* 5. Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">5.1 Our Content</h3>
                  <p>
                    The Service and its original content (excluding content provided by users), 
                    features, and functionality are and will remain the exclusive property of 
                    Copper Digital, Inc. and its licensors.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">5.2 Your Content</h3>
                  <p>
                    You retain all rights to the content you create using our Service. By using 
                    our Service, you grant us a limited license to process and display your content 
                    solely for the purpose of providing the Service to you.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">5.3 AI-Generated Content</h3>
                  <p>
                    Content generated by our AI tools is provided for your use. You are responsible 
                    for reviewing and editing any AI-generated content before publication to ensure 
                    accuracy, appropriateness, and compliance with applicable laws.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 6. Payment Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Payment Terms
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Certain aspects of the Service may be provided for a fee. You agree to pay all 
                  fees associated with your use of the Service.
                </p>
                <ul className="space-y-2">
                  <li>• Fees are non-refundable unless otherwise stated</li>
                  <li>• Prices may change with 30 days notice</li>
                  <li>• You are responsible for all applicable taxes</li>
                  <li>• Failure to pay may result in service suspension</li>
                </ul>
              </div>
            </motion.div>

            {/* 7. Disclaimers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Disclaimers
              </h2>
              <Card className="p-4 bg-muted/30 border-l-4 border-l-yellow-500">
                <p className="text-sm uppercase font-semibold mb-2">Important:</p>
                <p className="text-muted-foreground">
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE 
                  SPECIFIC RESULTS, INCLUDING BUT NOT LIMITED TO YOUTUBE VIEWS, SUBSCRIBERS, OR REVENUE. 
                  SUCCESS ON YOUTUBE DEPENDS ON MANY FACTORS BEYOND OUR CONTROL.
                </p>
              </Card>
            </motion.div>

            {/* 8. Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">8.</span> Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, COPPER DIGITAL, INC. SHALL NOT BE LIABLE FOR 
                ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF 
                PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, 
                USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </motion.div>

            {/* 9. Termination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">9.</span> Termination
              </h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without prior notice or liability, 
                for any reason, including breach of these Terms. Upon termination, your right to use 
                the Service will cease immediately.
              </p>
            </motion.div>

            {/* 10. Governing Law */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">10.</span> Governing Law
              </h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the 
                State of Texas, United States, without regard to its conflict of law provisions. 
                Any disputes arising from these Terms will be resolved in the courts of Dallas County, Texas.
              </p>
            </motion.div>

            {/* 11. Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">11.</span> Changes to Terms
              </h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time. If a revision is 
                material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </motion.div>

            {/* 12. Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">12.</span> Contact Information
              </h2>
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold mb-4">Questions about these Terms?</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email: arvind@copperreels.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Copper Digital, Inc. DBA Copper Reels
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    4100 Spring Valley Rd, STE 525, Dallas, TX 75244
                  </p>
                </div>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}