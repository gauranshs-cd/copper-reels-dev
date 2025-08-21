import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { isAppDomain, redirectToApp } from '@/config/domains';

interface MarketingRedirectProps {
  children: React.ReactNode;
}

export function MarketingRedirect({ children }: MarketingRedirectProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in and on marketing domain, redirect to app domain
    if (user && !isAppDomain()) {
      // For now, just navigate to /chat on same domain
      // In production, we'll redirect to app.copperreels.com
      navigate('/chat');
      
      // When app subdomain is set up, use this instead:
      // redirectToApp();
    }
  }, [user, navigate]);

  // Don't render marketing content for logged-in users
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to app...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}