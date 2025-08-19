import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminPromptEditor } from './AdminPromptEditor';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'arvind@copperdigital.com') {
      setIsAdmin(true);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 z-50"
          >
            <Button
              onClick={() => setShowEditor(true)}
              size="icon"
              variant="outline"
              className="w-10 h-10 rounded-full shadow-lg hover:shadow-xl bg-background/95 backdrop-blur-sm border-primary/20 hover:border-primary/40 group"
              title="Admin Prompt Settings"
            >
              <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminPromptEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
      />
    </>
  );
}