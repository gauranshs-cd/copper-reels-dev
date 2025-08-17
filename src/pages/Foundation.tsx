import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, Eye, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditableField } from '@/components/ui/editable-field';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useAppStore } from '@/store/useAppStore';
import type { Avatar, ContentPillar, FoundationData } from '@/store/useAppStore';

// Mock data generation
const generateMockFoundation = (statement: string): FoundationData => {
  return {
    avatar: {
      demographics: "25-40 years old, college-educated, primarily based in North America and Europe, household income $50k-$150k",
      psychographics: "Growth-minded, tech-savvy, values efficiency and learning, frustrated with information overload, seeks actionable advice",
      painPoints: "Struggling to find reliable, step-by-step guidance that actually works, overwhelmed by conflicting advice online",
      goals: "Wants to achieve measurable progress in their field, build confidence in their abilities, create sustainable systems"
    },
    viewerType: 'LEARNER',
    viewerTypeRationale: "Based on your statement, your audience is primarily in learning mode - they're seeking knowledge and actionable steps to improve their situation.",
    pillars: [
      { id: '1', title: 'Fundamentals', description: 'Core concepts and foundational knowledge', color: 'bg-blue-500' },
      { id: '2', title: 'Practical Tutorials', description: 'Step-by-step implementation guides', color: 'bg-green-500' },
      { id: '3', title: 'Case Studies', description: 'Real-world examples and success stories', color: 'bg-purple-500' },
      { id: '4', title: 'Tools & Resources', description: 'Reviews and recommendations', color: 'bg-orange-500' },
      { id: '5', title: 'Mindset & Motivation', description: 'Overcoming challenges and staying focused', color: 'bg-pink-500' }
    ]
  };
};

export default function Foundation() {
  const navigate = useNavigate();
  const { 
    umbrellaStatement, 
    foundationData, 
    setFoundationData, 
    setCurrentStep 
  } = useAppStore();

  useEffect(() => {
    setCurrentStep('foundation');
    
    // Generate mock foundation data if not exists
    if (!foundationData && umbrellaStatement) {
      const mockData = generateMockFoundation(umbrellaStatement);
      setFoundationData(mockData);
    }
  }, [foundationData, umbrellaStatement, setFoundationData, setCurrentStep]);

  const updateAvatar = (field: keyof Avatar, value: string) => {
    if (!foundationData) return;
    setFoundationData({
      ...foundationData,
      avatar: { ...foundationData.avatar, [field]: value }
    });
  };

  const updatePillar = (id: string, field: keyof ContentPillar, value: string) => {
    if (!foundationData) return;
    const updatedPillars = foundationData.pillars.map(pillar =>
      pillar.id === id ? { ...pillar, [field]: value } : pillar
    );
    setFoundationData({ ...foundationData, pillars: updatedPillars });
  };

  if (!foundationData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No foundation data found</h2>
          <Button onClick={() => navigate('/onboarding')}>Return to Onboarding</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <ProgressIndicator currentStep="foundation" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold mb-4"
            >
              Your Content Foundation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Based on your statement: <em>"{umbrellaStatement}"</em>
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Audience Avatar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 h-full shadow-elegant">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Audience Avatar</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Demographics</h3>
                    <EditableField
                      value={foundationData.avatar.demographics}
                      onSave={(value) => updateAvatar('demographics', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Psychographics</h3>
                    <EditableField
                      value={foundationData.avatar.psychographics}
                      onSave={(value) => updateAvatar('psychographics', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Pain Points</h3>
                    <EditableField
                      value={foundationData.avatar.painPoints}
                      onSave={(value) => updateAvatar('painPoints', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Goals</h3>
                    <EditableField
                      value={foundationData.avatar.goals}
                      onSave={(value) => updateAvatar('goals', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Viewer Type */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <Card className="p-6 shadow-elegant">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Viewer Type</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="secondary" 
                      className="px-4 py-2 text-lg font-semibold bg-primary/10 text-primary"
                    >
                      {foundationData.viewerType}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {foundationData.viewerTypeRationale}
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Content Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Content Pillars</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foundationData.pillars.map((pillar, index) => (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-3 h-3 rounded-full ${pillar.color} mb-3`} />
                    <EditableField
                      value={pillar.title}
                      onSave={(value) => updatePillar(pillar.id, 'title', value)}
                      displayClassName="font-semibold mb-2"
                    />
                    <EditableField
                      value={pillar.description}
                      onSave={(value) => updatePillar(pillar.id, 'description', value)}
                      displayClassName="text-sm text-muted-foreground"
                      multiline
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-between"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Statement</span>
            </Button>
            
            <Button
              onClick={() => navigate('/ideation')}
              className="flex items-center space-x-2 bg-gradient-primary hover:shadow-glow"
            >
              <span>Next: Generate Ideas</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}