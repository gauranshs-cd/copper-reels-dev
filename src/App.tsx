import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminButton } from "@/components/AdminButton";
import { HistorySidebar } from "@/components/HistorySidebar";
import { UserMenu } from "@/components/UserMenu";
import { AppHeader } from "@/components/AppHeader";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';
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

const queryClient = new QueryClient();

const App = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [useNewLayout, setUseNewLayout] = useState(true); // Feature flag for new layout
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="copper-reels-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
              <AdminButton />
              
              {/* Conditionally render old header or new layout */}
              {!useNewLayout && (
                <>
                  {/* Old Layout - App Header with User Menu */}
                  <AppHeader />
                  
                  {/* History Button - Now positioned to avoid header overlap */}
                  <Button
                    onClick={() => setHistoryOpen(true)}
                    className="fixed left-4 top-20 z-30"
                    variant="outline"
                    size="icon"
                    aria-label="View history"
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                  
                  {/* History Sidebar */}
                  <HistorySidebar 
                    isOpen={historyOpen}
                    onClose={() => setHistoryOpen(false)}
                    onSelectItem={(item) => {
                      console.log('Selected history item:', item);
                      // Handle navigation based on item type
                      if (item.type === 'idea' && item.data?.idea) {
                        // Navigate to ideation page with the selected idea
                        window.location.href = '/ideation';
                      } else if (item.type === 'script') {
                        window.location.href = '/script-builder';
                      } else if (item.type === 'foundation') {
                        window.location.href = '/foundation';
                      }
                      setHistoryOpen(false);
                    }}
                  />
                </>
              )}
              
              {/* Main content - conditionally wrapped */}
              <div className={!useNewLayout ? "pt-16" : ""}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      {useNewLayout ? (
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
                      {useNewLayout ? (
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
                    {useNewLayout ? (
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
                    {useNewLayout ? (
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
                    {useNewLayout ? (
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
                    {useNewLayout ? (
                      <AppLayout>
                        <ScriptBuilder />
                      </AppLayout>
                    ) : (
                      <ScriptBuilder />
                    )}
                  </ProtectedRoute>
                } />
                <Route path="/pattern-bank" element={
                  <ProtectedRoute>
                    {useNewLayout ? (
                      <AppLayout>
                        <PatternBank />
                      </AppLayout>
                    ) : (
                      <PatternBank />
                    )}
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    {useNewLayout ? (
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    ) : (
                      <Settings />
                    )}
                  </ProtectedRoute>
                } />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
