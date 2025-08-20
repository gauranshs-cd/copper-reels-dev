import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  LogOut, 
  Settings, 
  HelpCircle, 
  ChevronDown,
  Sparkles,
  History,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = () => {
    if (user.email) {
      const parts = user.email.split('@')[0].split('.');
      if (parts.length > 1) {
        return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
      }
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user.email) {
      return user.email.split('@')[0].replace(/[._]/g, ' ');
    }
    return 'User';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <AnimatePresence>
        <DropdownMenuContent 
          className="w-64" 
          align="end"
          asChild
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Info */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            {/* Navigation Items */}
            <DropdownMenuItem 
              onClick={() => navigate('/foundation')}
              className="cursor-pointer"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Foundation Setup</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => navigate('/pattern-bank')}
              className="cursor-pointer"
            >
              <Palette className="mr-2 h-4 w-4" />
              <span>Pattern Bank</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => {
                const historyButton = document.querySelector('[aria-label*="history"]');
                if (historyButton) {
                  (historyButton as HTMLButtonElement).click();
                }
              }}
              className="cursor-pointer"
            >
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Settings & Help */}
            <DropdownMenuItem 
              onClick={() => toast.info('Settings coming soon!')}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => window.open('https://docs.copperreels.com', '_blank')}
              className="cursor-pointer"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Docs</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Logout */}
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
            </DropdownMenuItem>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
}