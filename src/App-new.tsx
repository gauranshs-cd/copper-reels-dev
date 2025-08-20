import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { Settings, Plus, Sparkles, Video, FileText, Image, Home } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ThemeProvider } from '@/components/theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

// Import pages
import { Foundation } from '@/pages/Foundation';
import { IdeationPage } from '@/pages/Ideation-new';
import { ScriptGenerationPage } from '@/pages/ScriptGeneration-new';
import { ThumbnailGeneratorPage } from '@/pages/ThumbnailGenerator-new';
import { PreviewPage } from '@/pages/Preview-new';

interface Workspace {
  id: string;
  name: string;
  umbrella: string;
  avatar: any;
  pillars: any[];
  createdAt: Date;
  lastUsed: Date;
}

function WorkspaceSelector() {
  const navigate = useNavigate();
  const { setFoundationData } = useAppStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  useEffect(() => {
    // Load workspaces from localStorage
    const savedWorkspaces = localStorage.getItem('copper_reels_workspaces');
    if (savedWorkspaces) {
      setWorkspaces(JSON.parse(savedWorkspaces));
    }
  }, []);

  const selectWorkspace = (workspace: Workspace) => {
    // Set the foundation data
    setFoundationData({
      avatar: workspace.avatar,
      viewerType: workspace.avatar.viewerType || 'LEARNER',
      pillars: workspace.pillars,
      notes: {
        rationale: '',
        toneOfVoice: []
      }
    });
    
    // Update last used
    workspace.lastUsed = new Date();
    const updatedWorkspaces = workspaces.map(w => 
      w.id === workspace.id ? workspace : w
    );
    setWorkspaces(updatedWorkspaces);
    localStorage.setItem('copper_reels_workspaces', JSON.stringify(updatedWorkspaces));
    localStorage.setItem('current_workspace_id', workspace.id);
    
    setSelectedWorkspace(workspace.id);
    navigate('/ideation');
  };

  const createNewWorkspace = () => {
    navigate('/foundation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Copper Reels Studio
          </h1>
          <p className="text-xl text-muted-foreground">
            Select a workspace to continue or create a new one
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Create New Workspace Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="p-8 cursor-pointer border-dashed border-2 hover:border-primary transition-all h-full flex flex-col items-center justify-center min-h-[200px]"
              onClick={createNewWorkspace}
            >
              <Plus className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Create New Workspace</h3>
              <p className="text-sm text-muted-foreground text-center">
                Set up a new channel foundation
              </p>
            </Card>
          </motion.div>

          {/* Existing Workspaces */}
          {workspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="p-6 cursor-pointer hover:border-primary transition-all h-full"
                onClick={() => selectWorkspace(workspace)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(workspace.lastUsed).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{workspace.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {workspace.umbrella}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {workspace.pillars.slice(0, 3).map((pillar, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-muted rounded">
                      {pillar.name || pillar.title}
                    </span>
                  ))}
                  {workspace.pillars.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-muted rounded">
                      +{workspace.pillars.length - 3}
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MainWorkflow() {
  const navigate = useNavigate();
  const { foundationData, currentIdea } = useAppStore();
  const [currentStep, setCurrentStep] = useState<'ideation' | 'script' | 'thumbnail' | 'preview'>('ideation');
  
  // Auto-navigate based on state
  useEffect(() => {
    if (!foundationData) {
      navigate('/');
    }
  }, [foundationData, navigate]);

  const steps = [
    { id: 'ideation', label: 'Ideas', icon: Sparkles, path: '/ideation' },
    { id: 'script', label: 'Script', icon: FileText, path: '/script' },
    { id: 'thumbnail', label: 'Thumbnail', icon: Image, path: '/thumbnail' },
    { id: 'preview', label: 'Preview', icon: Video, path: '/preview' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header with Workflow Steps */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Workspaces
              </Button>
              
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <Button
                      variant={currentStep === step.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setCurrentStep(step.id as any);
                        navigate(step.path);
                      }}
                      className="gap-2"
                    >
                      <step.icon className="w-4 h-4" />
                      {step.label}
                    </Button>
                    {index < steps.length - 1 && (
                      <span className="mx-2 text-muted-foreground">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/ideation" element={<IdeationPage />} />
            <Route path="/script" element={<ScriptGenerationPage />} />
            <Route path="/thumbnail" element={<ThumbnailGeneratorPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="*" element={<Navigate to="/ideation" />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  const { foundationData } = useAppStore();
  const [hasWorkspace, setHasWorkspace] = useState(false);

  useEffect(() => {
    // Check if we have a current workspace
    const currentWorkspaceId = localStorage.getItem('current_workspace_id');
    const workspaces = localStorage.getItem('copper_reels_workspaces');
    
    if (currentWorkspaceId && workspaces) {
      const parsed = JSON.parse(workspaces);
      const workspace = parsed.find((w: any) => w.id === currentWorkspaceId);
      if (workspace) {
        setHasWorkspace(true);
        // Load the workspace data
        useAppStore.getState().setFoundationData({
          avatar: workspace.avatar,
          viewerType: workspace.avatar.viewerType || 'LEARNER',
          pillars: workspace.pillars,
          notes: {
            rationale: '',
            toneOfVoice: []
          }
        });
      }
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="copper-reels-theme">
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<WorkspaceSelector />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/*" element={<MainWorkflow />} />
        </Routes>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}