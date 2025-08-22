import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminButton } from "@/components/AdminButton";
import { HistorySidebar } from "@/components/HistorySidebar";
import { AppHeader } from "@/components/AppHeader";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';
import { LayoutProvider } from "@/contexts/LayoutContext";
import { MarketingRedirect } from "@/components/MarketingRedirect";
import Index from "./pages/Index-new";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Foundation from "./pages/Foundation-new";
import Ideation from "./pages/Ideation-enhanced";
import VideoPlanning from "./pages/VideoPlanning-enhanced";
import ScriptBuilder from "./pages/ScriptBuilder-enhanced";
import PatternBank from "./pages/PatternBank";
import Settings from "./pages/Settings";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Test from "./pages/Test";
import ChatInterface from "./pages/ChatInterface";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Documentation from "./pages/Documentation";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Analytics from "./pages/Analytics";
import TeamSettings from "./pages/TeamSettings";
import AcceptInvite from "./pages/AcceptInvite";

const queryClient = new QueryClient();

// Main App Content Component
const AppContent = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  // Define which routes are protected/authenticated (app routes)
  const appRoutes = [
    '/chat', '/dashboard', '/onboarding', '/foundation', 
    '/ideation', '/plan', '/script-builder', '/settings', '/analytics', '/team-settings'
  ];
  
  // Define public/marketing routes
  const marketingRoutes = [
    '/', '/services', '/about', '/documentation', '/blog', 
    '/contact', '/careers', '/privacy', '/terms', '/pattern-bank'
  ];
  
  // Check if current route is an app route
  const isAppRoute = appRoutes.some(route => location.pathname.startsWith(route));
  
  // Check if current route is a marketing route
  const isMarketingRoute = marketingRoutes.some(route => location.pathname === route);
  
  // Use sidebar layout only for authenticated users on app routes
  const useSidebarLayout = user && isAppRoute;
  
  // Show header only for non-authenticated users
  const showHeader = !user;
  
  return (
    <LayoutProvider hasSidebar={useSidebarLayout}>
      <AdminButton />
      
      {/* Show header only for non-authenticated users on marketing pages */}
      {showHeader && <AppHeader />}
      
      {/* History Button - Only show when using old layout */}
      {!useSidebarLayout && user && (
        <Button
          onClick={() => setHistoryOpen(true)}
          className="fixed left-4 top-20 z-30"
          variant="outline"
          size="icon"
          aria-label="View history"
        >
          <Clock className="w-4 h-4" />
        </Button>
      )}
      
      {/* History Sidebar */}
      {!useSidebarLayout && (
        <HistorySidebar 
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectItem={(item) => {
            console.log('Selected history item:', item);
            // Handle navigation based on item type
            if (item.type === 'idea' && item.data?.idea) {
              window.location.href = '/ideation';
            } else if (item.type === 'script') {
              window.location.href = '/script-builder';
            } else if (item.type === 'foundation') {
              window.location.href = '/foundation';
            }
            setHistoryOpen(false);
          }}
        />
      )}
      
      {/* Main content with conditional wrapper */}
      <div className={!useSidebarLayout ? "pt-16" : ""}>
        <Routes>
          {/* Public Routes - Redirect logged-in users to app */}
          <Route path="/" element={
            <MarketingRedirect>
              <Index />
            </MarketingRedirect>
          } />
          <Route path="/auth" element={<Auth />} />
          <Route path="/invite/:token" element={<AcceptInvite />} />
          <Route path="/test" element={<Test />} />
          <Route path="/services" element={
            <MarketingRedirect>
              <Services />
            </MarketingRedirect>
          } />
          <Route path="/about" element={
            <MarketingRedirect>
              <About />
            </MarketingRedirect>
          } />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/blog" element={
            <MarketingRedirect>
              <Blog />
            </MarketingRedirect>
          } />
          <Route path="/contact" element={
            <MarketingRedirect>
              <Contact />
            </MarketingRedirect>
          } />
          <Route path="/careers" element={
            <MarketingRedirect>
              <Careers />
            </MarketingRedirect>
          } />
          <Route path="/privacy" element={
            <MarketingRedirect>
              <Privacy />
            </MarketingRedirect>
          } />
          <Route path="/terms" element={
            <MarketingRedirect>
              <Terms />
            </MarketingRedirect>
          } />
          
          {/* Protected Routes - With sidebar when authenticated */}
          <Route path="/chat" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <ChatInterface />
                </AppLayout>
              ) : (
                <ChatInterface />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              ) : (
                <Dashboard />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          
          <Route path="/foundation" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <Foundation />
                </AppLayout>
              ) : (
                <Foundation />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/ideation" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <Ideation />
                </AppLayout>
              ) : (
                <Ideation />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/plan" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <VideoPlanning />
                </AppLayout>
              ) : (
                <VideoPlanning />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/script-builder" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <ScriptBuilder />
                </AppLayout>
              ) : (
                <ScriptBuilder />
              )}
            </ProtectedRoute>
          } />
          
          {/* Pattern Bank - Public page */}
          <Route path="/pattern-bank" element={
            <MarketingRedirect>
              <PatternBank />
            </MarketingRedirect>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <Settings />
                </AppLayout>
              ) : (
                <Settings />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <Analytics />
                </AppLayout>
              ) : (
                <Analytics />
              )}
            </ProtectedRoute>
          } />
          
          <Route path="/team-settings" element={
            <ProtectedRoute>
              {user ? (
                <AppLayout>
                  <TeamSettings />
                </AppLayout>
              ) : (
                <TeamSettings />
              )}
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </LayoutProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="copper-reels-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;