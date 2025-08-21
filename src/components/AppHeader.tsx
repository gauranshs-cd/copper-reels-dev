import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Sparkles, 
  Lightbulb, 
  Video, 
  FileText,
  Palette,
  Settings,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const allNavItems = [
    { path: '/', icon: Home, label: 'Home', public: true },
    { path: '/about', icon: Users, label: 'About', public: true },
    { path: '/services', icon: DollarSign, label: 'Services', highlight: true, public: true },
    { path: '/foundation', icon: Sparkles, label: 'Foundation', public: false },
    { path: '/ideation', icon: Lightbulb, label: 'Ideas', public: false },
    { path: '/plan', icon: Video, label: 'Planning', public: false },
    { path: '/script-builder', icon: FileText, label: 'Script', public: false },
    { path: '/pattern-bank', icon: Palette, label: 'Patterns', public: false },
    { path: '/settings', icon: Settings, label: 'Settings', public: false },
  ];

  const navItems = user ? allNavItems : allNavItems.filter(item => item.public);
  const currentPage = allNavItems.find(item => item.path === location.pathname);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-4">
            {/* Back button for non-home pages */}
            {location.pathname !== '/' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            {/* Logo/Brand */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/copper-reels-main.svg" 
                alt="Copper Reels" 
                className="h-12 w-auto"
                style={{ maxWidth: '240px' }}
              />
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              {navItems.map(item => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : item.highlight ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "gap-2",
                    item.highlight && location.pathname !== item.path && "bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border-purple-600/30"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:block">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>

          {/* Right side - User Menu or Login */}
          <div className="flex items-center gap-4">
            {/* Current page indicator */}
            {currentPage && user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <currentPage.icon className="w-4 h-4" />
                <span>{currentPage.label}</span>
              </div>
            )}
            
            {/* User Menu or Login Button */}
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}