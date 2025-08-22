import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Video, 
  TrendingUp, 
  Lightbulb,
  FileText,
  Image,
  MessageSquare,
  Target,
  Settings,
  Search,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const tools = [
    {
      title: 'AI Chat Studio',
      description: 'ChatGPT-like interface for all your content needs',
      icon: MessageSquare,
      route: '/chat',
      color: 'from-purple-500 to-pink-500',
      badge: 'NEW'
    },
    {
      title: 'Foundation Setup',
      description: 'Define your channel identity and audience',
      icon: Target,
      route: '/foundation',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Idea Generator',
      description: 'Generate viral video concepts',
      icon: Lightbulb,
      route: '/ideation',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Script Builder',
      description: 'Create engaging scripts with AI',
      icon: FileText,
      route: '/script-builder',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Research Tools',
      description: 'Analyze top performers and find gaps',
      icon: Search,
      route: '/chat',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Pattern Bank',
      description: 'Learn from viral content patterns',
      icon: TrendingUp,
      route: '/pattern-bank',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Analytics',
      description: 'Track your content performance',
      icon: BarChart3,
      route: '/analytics',
      color: 'from-pink-500 to-rose-500',
      badge: 'NEW'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose a tool to start creating viral YouTube content
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => navigate(tool.route)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  {tool.badge && (
                    <Badge variant="secondary">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                <Button variant="ghost" className="w-full group">
                  Open Tool
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Need help getting started?
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/chat')}
            className="bg-gradient-primary"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Open AI Chat Assistant
          </Button>
        </motion.div>
      </div>
    </div>
  );
}