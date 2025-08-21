import { motion } from 'framer-motion';
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
  ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <Building className="w-3 h-3 mr-1" />
              About Copper Reels
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powered by <span className="text-gradient">Copper Digital</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A division of Copper Digital, Inc. - Your partner in digital transformation and AI-driven content creation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Leadership</h2>
            <p className="text-muted-foreground">
              Visionary leadership driving innovation in content creation
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="w-32 h-32 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                    AS
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-xl mb-2">Arvind Sarin</h3>
                    <p className="text-muted-foreground mb-4">
                      Chairman & CEO
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => window.open('https://linkedin.com/in/arvindsarin', '_blank')}>
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => window.open('https://twitter.com/arvindsarin', '_blank')}>
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => window.open('https://youtube.com/@arvindsarin', '_blank')}>
                        <Youtube className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Professional Background
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Technologist, entrepreneur, and digital-nomad storyteller. Co-founder and CEO of Copper Digital 
                      (formerly Copper Mobile), an enterprise-centered digital transformation firm headquartered in Dallas, Texas. 
                      Leads consulting for global clients including VISA, Verizon, U.S. Army, Cisco, eBay, Westinghouse Electric, 
                      and Texas Health Resources.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• MBA - McCombs School of Business, University of Texas at Austin</li>
                      <li>• M.S. Electrical & Computer Engineering - Texas A&M University</li>
                      <li>• B.S. - Bharati Vidyapeeth University</li>
                      <li>• Additional Studies - NYU Tandon School of Engineering</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Expertise
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Mobile technology, digital transformation, AI-driven solutions, healthcare technology innovation. 
                      Regular speaker at UT Southwestern and HIMSS Annual Conference. Angel investor in seed-stage 
                      technology companies. Host of "Decoding the Digital Industrial Revolution" podcast.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      CEO Nomad
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Known as a digital nomad who documents travels and entrepreneurial lessons. 
                      Advocates for remote work and offers free training programs for people entering the technology industry. 
                      Passionate about exploring new scientific approaches to improve quality of life.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Company Information</h2>
            <p className="text-muted-foreground">
              Building the future of content creation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Copper Digital, Inc.</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Headquarters</p>
                  <p className="font-medium">Dallas, Texas</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Founded</p>
                  <p className="font-medium">2010 (as Copper Mobile)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rebranded</p>
                  <p className="font-medium">2023 (as Copper Digital)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Focus</p>
                  <p className="font-medium">Digital Transformation & AI Solutions</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">ReelCraft Inc.</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">4060 Spring Valley Rd, Suite 202</p>
                  <p className="font-medium">Farmers Branch, TX 75244</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EIN</p>
                  <p className="font-medium">93-4701507</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Incorporated</p>
                  <p className="font-medium">December 2023</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              At Copper Reels, we leverage emerging technologies to streamline content creation processes 
              and automate workflows. Our goal is to help businesses and creators stay ahead of the curve 
              and succeed in the digital landscape through AI-driven innovation.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">ROI-Driven</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on measurable results and business impact
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Client-Centered</h4>
                <p className="text-sm text-muted-foreground">
                  Custom solutions tailored to each client's workflow
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Innovation-Led</h4>
                <p className="text-sm text-muted-foreground">
                  Leveraging AI and emerging technologies
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators using Copper Reels to grow their channels
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = '/auth'}
          >
            Get Started Today
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}