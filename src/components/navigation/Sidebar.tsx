import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth/AuthProvider';
import { TeamSwitcher } from '@/components/TeamSwitcher';
import {
  Home,
  MessageSquare,
  Target,
  Lightbulb,
  FileText,
  Palette,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Video,
  TrendingUp,
  BookOpen,
  Mail,
  LogOut,
  UserCircle,
  ChevronDown,
  PenTool
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  icon: any;
  label: string;
  path: string;
  badge?: string;
  count?: number;
  disabled?: boolean;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Check screen size for auto-collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mainNavigation: NavItem[] = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'AI Studio', path: '/chat', badge: 'New' },
    { icon: Target, label: 'Foundation', path: '/foundation' },
    { icon: Lightbulb, label: 'Ideas', path: '/ideation' },
    { icon: Video, label: 'Planning', path: '/plan' },
    { icon: FileText, label: 'Scripts', path: '/script-builder' },
    { icon: PenTool, label: 'Blog Post Writer', path: '/blog-writer', badge: 'New' },
    { icon: Palette, label: 'Pattern Bank', path: '/pattern-bank' },
  ];

  const teamNavigation: NavItem[] = [
    { icon: Users, label: 'Team Settings', path: '/team-settings' },
    { icon: FolderOpen, label: 'Shared Projects', path: '/projects', disabled: true },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: 'New' },
  ];

  const settingsNavigation: NavItem[] = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: CreditCard, label: 'Billing', path: '/billing', disabled: true },
    { icon: HelpCircle, label: 'Support', path: '/contact' },
    { icon: BookOpen, label: 'Documentation', path: '/documentation' },
  ];

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.disabled ? '#' : item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
          "hover:bg-muted/50",
          isActive && "bg-primary/10 text-primary",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          collapsed && "justify-center"
        )}
      >
        <item.icon className={cn("w-5 h-5", collapsed && "w-6 h-6")} />
        {!collapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
            {item.count !== undefined && (
              <span className="text-xs text-muted-foreground ml-auto">
                {item.count}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/cr-logo-new.svg" 
              alt="Copper Reels" 
              className={cn(
                "transition-all duration-300",
                collapsed ? "h-8 w-8" : "h-10 w-auto max-w-[160px]"
              )}
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Team Selector */}
      {!collapsed && user && (
        <div className="p-4 border-b">
          <TeamSwitcher className="w-full" />
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                Workspace
              </h3>
            )}
            <nav className="space-y-1">
              {mainNavigation.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
          </div>

          {/* Team Navigation */}
          {user && (
            <div>
              {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                  Team
                </h3>
              )}
              <nav className="space-y-1">
                {teamNavigation.map((item) => (
                  <NavLink key={item.path} item={item} />
                ))}
              </nav>
            </div>
          )}

          {/* Settings Navigation */}
          <div>
            {!collapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                Settings
              </h3>
            )}
            <nav className="space-y-1">
              {settingsNavigation.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 space-y-4">
        {/* Usage Indicator */}
        {!collapsed && user && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>API Usage</span>
              <span>1,234 / 10,000</span>
            </div>
            <Progress value={12.34} className="h-1" />
          </div>
        )}

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full", collapsed ? "px-2" : "justify-start")}>
                <Avatar className={cn(collapsed ? "w-8 h-8" : "w-7 h-7 mr-2")}>
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium truncate">{user.email}</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={collapsed ? "center" : "start"} className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/billing')} disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={() => navigate('/auth')}
            className={cn("w-full", collapsed && "px-2")}
            size={collapsed ? "icon" : "sm"}
          >
            {collapsed ? <LogOut className="w-4 h-4" /> : 'Sign In'}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: collapsed ? 80 : 240 }}
        animate={{ width: collapsed ? 80 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          "hidden lg:flex flex-col bg-background border-r h-screen fixed left-0 top-0 z-30",
          className
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed left-4 top-4 z-40"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 20 }}
              className={cn(
                "lg:hidden fixed left-0 top-0 h-screen w-[240px] bg-background border-r z-40 flex flex-col",
                className
              )}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}