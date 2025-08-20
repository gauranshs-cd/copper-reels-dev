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

  if (!user) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/foundation', icon: Sparkles, label: 'Foundation' },
    { path: '/ideation', icon: Lightbulb, label: 'Ideas' },
    { path: '/plan', icon: Video, label: 'Planning' },
    { path: '/script-builder', icon: FileText, label: 'Script' },
    { path: '/services', icon: DollarSign, label: 'Services', highlight: true },
    { path: '/pattern-bank', icon: Palette, label: 'Patterns' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const currentPage = navItems.find(item => item.path === location.pathname);

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
                src="/copper-logo.svg" 
                alt="Copper Reels" 
                className="h-12 w-auto"
                style={{ maxWidth: '200px' }}
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

          {/* Right side - User Menu */}
          <div className="flex items-center gap-4">
            {/* Current page indicator */}
            {currentPage && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <currentPage.icon className="w-4 h-4" />
                <span>{currentPage.label}</span>
              </div>
            )}
            
            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </motion.header>
  );
}