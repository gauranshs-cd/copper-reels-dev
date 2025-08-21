import { Link } from 'react-router-dom';
import { 
  Youtube, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/chat' },
      { name: 'Pricing', href: '/services' },
      { name: 'Pattern Bank', href: '/pattern-bank' },
      { name: 'AI Studio', href: '/chat' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'YouTube Guide', href: '/guide' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Support', href: '/support' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Compliance', href: '/compliance' },
    ],
  };

  const socialLinks = [
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stay Ahead of YouTube Trends
            </h3>
            <p className="text-muted-foreground mb-6">
              Get weekly insights on viral content strategies and platform updates
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="bg-gradient-primary">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              Join 10,000+ creators. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img 
              src="/copper-reels-main.svg" 
              alt="Copper Reels" 
              className="h-14 w-auto mb-4"
              style={{ maxWidth: '250px' }}
            />
            <p className="text-sm text-muted-foreground mb-4">
              Empowering content creators with AI-driven tools to create viral YouTube content 
              that resonates with their audience.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              arvind@copperreels.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              +1 (800) 829-4933
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              4060 Spring Valley Rd, Suite 202, Farmers Branch, TX 75244
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Copper Reels. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for content creators
          </p>
        </div>
      </div>
    </footer>
  );
}