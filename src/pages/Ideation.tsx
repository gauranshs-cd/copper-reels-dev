import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAppStore } from '@/store/useAppStore';
import type { IdeaCard } from '@/store/useAppStore';

const mockIdeas: IdeaCard[] = [
  {
    id: '1',
    title: '5 Essential Tools Every Developer Needs in 2024',
    thumbnail: '/api/placeholder/300/200',
    pillar: 'Tools & Resources',
    pillarColor: 'bg-orange-500',
    ctrScore: 8.4,
    description: 'Complete guide to must-have development tools'
  },
  {
    id: '2', 
    title: 'From Zero to First Sale: My SaaS Journey',
    thumbnail: '/api/placeholder/300/200',
    pillar: 'Case Studies',
    pillarColor: 'bg-purple-500',
    ctrScore: 9.2,
    description: 'Behind-the-scenes look at building profitable SaaS'
  },
  {
    id: '3',
    title: 'React vs Vue: Which Should You Choose in 2024?',
    thumbnail: '/api/placeholder/300/200',
    pillar: 'Fundamentals',
    pillarColor: 'bg-blue-500',
    ctrScore: 7.8,
    description: 'Comprehensive comparison for beginners'
  },
  {
    id: '4',
    title: 'Building Your First API in 15 Minutes',
    thumbnail: '/api/placeholder/300/200',
    pillar: 'Practical Tutorials',
    pillarColor: 'bg-green-500',
    ctrScore: 8.9,
    description: 'Step-by-step API development tutorial'
  },
  {
    id: '5',
    title: 'Overcoming Imposter Syndrome as a Developer',
    thumbnail: '/api/placeholder/300/200',
    pillar: 'Mindset & Motivation',
    pillarColor: 'bg-pink-500',
    ctrScore: 7.6,
    description: 'Mental strategies for developer confidence'
  },
  {
    id: '6',
    title: 'Database Design Patterns That Scale',
    thumbnail: '/api/placeholder/300/200',
    pillar: 'Fundamentals',
    pillarColor: 'bg-blue-500',
    ctrScore: 8.1,
    description: 'Advanced database architecture concepts'
  }
];

const columns = [
  { id: 'ideas', title: 'Ideas', count: 12 },
  { id: 'in-progress', title: 'In Progress', count: 3 },
  { id: 'scheduled', title: 'Scheduled', count: 2 }
];

export default function Ideation() {
  const navigate = useNavigate();
  const { 
    foundationData, 
    selectedIdea, 
    setSelectedIdea, 
    setCurrentStep,
    isLoading,
    setLoading 
  } = useAppStore();
  
  const [ideas, setIdeas] = useState<IdeaCard[]>(mockIdeas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setCurrentStep('ideation');
  }, [setCurrentStep]);

  const generateNewIdeas = async () => {
    setIsGenerating(true);
    setLoading(true, "Generating fresh video ideas...");
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new mock ideas
    const newIdeas: IdeaCard[] = [
      {
        id: Date.now().toString(),
        title: 'The Productivity Method That Changed My Coding',
        thumbnail: '/api/placeholder/300/200',
        pillar: 'Mindset & Motivation',
        pillarColor: 'bg-pink-500',
        ctrScore: 8.7,
        description: 'Time management strategies for developers'
      }
    ];
    
    setIdeas(prev => [...newIdeas, ...prev]);
    setIsGenerating(false);
    setLoading(false);
  };

  const handleIdeaSelect = (idea: IdeaCard) => {
    setSelectedIdea(idea);
  };

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.pillar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <LoadingSpinner size="lg" message="Generating fresh video ideas..." />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-muted-foreground max-w-md"
          >
            Our AI is analyzing trending topics in your niche and creating video ideas tailored to your content pillars.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <ProgressIndicator currentStep="ideation" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Ideation Hub</h1>
              <p className="text-muted-foreground">
                AI-generated video ideas based on your content pillars
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas or pillars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              
              <Button
                onClick={generateNewIdeas}
                disabled={isGenerating}
                className="bg-gradient-primary hover:shadow-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate New Ideas
              </Button>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {columns.map((column, columnIndex) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: columnIndex * 0.1 }}
              >
                <Card className="p-4 h-fit shadow-elegant">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {column.id === 'ideas' ? filteredIdeas.length : column.count}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 min-h-[400px]">
                    {column.id === 'ideas' && (
                      <AnimatePresence>
                        {filteredIdeas.map((idea, index) => (
                          <motion.div
                            key={idea.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleIdeaSelect(idea)}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedIdea?.id === idea.id ? 'ring-2 ring-primary shadow-glow' : ''
                            }`}
                          >
                            <Card className="p-4 hover:shadow-md">
                              <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                                <img 
                                  src={idea.thumbnail} 
                                  alt={idea.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <h4 className="font-medium text-sm mb-2 line-clamp-2">
                                {idea.title}
                              </h4>
                              
                              <div className="flex items-center justify-between mb-2">
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs px-2 py-1"
                                >
                                  {idea.pillar}
                                </Badge>
                                
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{idea.ctrScore}</span>
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {idea.description}
                              </p>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                    
                    {column.id !== 'ideas' && (
                      <div className="text-center text-muted-foreground py-8">
                        <p className="text-sm">No items yet</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/foundation')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Foundation</span>
            </Button>
            
            <Button
              onClick={() => navigate('/plan')}
              disabled={!selectedIdea}
              className="flex items-center space-x-2 bg-gradient-primary hover:shadow-glow disabled:opacity-50"
            >
              <span>Plan Video</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}