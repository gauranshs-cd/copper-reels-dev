import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Lightbulb, 
  FileText, 
  Clock,
  BarChart3,
  Calendar,
  Target,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';

interface ContentMetrics {
  totalIdeas: number;
  totalScripts: number;
  avgGenerationTime: number;
  mostActiveDay: string;
  contentPillars: { name: string; count: number }[];
  weeklyActivity: { day: string; count: number }[];
  recentSessions: { date: string; type: string; title: string }[];
}

export default function Analytics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ContentMetrics>({
    totalIdeas: 0,
    totalScripts: 0,
    avgGenerationTime: 0,
    mostActiveDay: '',
    contentPillars: [],
    weeklyActivity: [],
    recentSessions: []
  });
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    // Load analytics from localStorage
    const loadAnalytics = () => {
      const history = JSON.parse(localStorage.getItem('content_history') || '[]');
      const foundations = JSON.parse(localStorage.getItem('previous_foundations') || '[]');
      const sessions = JSON.parse(localStorage.getItem('session_history') || '[]');
      
      // Calculate metrics
      const ideas = history.filter((item: any) => item.type === 'idea');
      const scripts = history.filter((item: any) => item.type === 'script');
      
      // Weekly activity (last 7 days)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const weekActivity = days.map(day => {
        const dayHistory = history.filter((item: any) => {
          const itemDate = new Date(item.created || item.timestamp);
          return itemDate.getDay() === days.indexOf(day);
        });
        return { day, count: dayHistory.length };
      });
      
      // Most active day
      const mostActive = weekActivity.reduce((max, day) => 
        day.count > max.count ? day : max, weekActivity[0]);
      
      // Content pillars usage
      const pillarCounts: { [key: string]: number } = {};
      foundations.forEach((f: any) => {
        if (f.data?.pillars) {
          f.data.pillars.forEach((p: any) => {
            pillarCounts[p.title] = (pillarCounts[p.title] || 0) + 1;
          });
        }
      });
      
      const pillars = Object.entries(pillarCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Recent sessions
      const recent = [...history, ...sessions]
        .sort((a: any, b: any) => 
          new Date(b.created || b.timestamp).getTime() - 
          new Date(a.created || a.timestamp).getTime()
        )
        .slice(0, 5)
        .map((item: any) => ({
          date: new Date(item.created || item.timestamp).toLocaleDateString(),
          type: item.type || 'session',
          title: item.title || item.description || 'Untitled'
        }));
      
      setMetrics({
        totalIdeas: ideas.length,
        totalScripts: scripts.length,
        avgGenerationTime: 2.3, // Mock average time in minutes
        mostActiveDay: mostActive.day,
        contentPillars: pillars,
        weeklyActivity: weekActivity,
        recentSessions: recent
      });
    };
    
    loadAnalytics();
  }, [timeRange]);

  const statCards = [
    {
      title: 'Total Ideas Generated',
      value: metrics.totalIdeas,
      icon: Lightbulb,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Scripts Created',
      value: metrics.totalScripts,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Avg. Generation Time',
      value: `${metrics.avgGenerationTime}m`,
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Most Active Day',
      value: metrics.mostActiveDay || 'N/A',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              Analytics
            </h1>
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map(range => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="capitalize"
                >
                  {range === 'all' ? 'All Time' : `This ${range}`}
                </Button>
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">
            Track your content creation progress and patterns
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Activity
              </h2>
              <div className="space-y-3">
                {metrics.weeklyActivity.map((day, index) => (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12">{day.day}</span>
                    <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.count / Math.max(...metrics.weeklyActivity.map(d => d.count), 1)) * 100}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full bg-gradient-primary flex items-center justify-end pr-2"
                      >
                        {day.count > 0 && (
                          <span className="text-xs text-white font-medium">{day.count}</span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top Content Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Top Content Pillars
              </h2>
              <div className="space-y-3">
                {metrics.contentPillars.length > 0 ? (
                  metrics.contentPillars.map((pillar, index) => (
                    <div key={pillar.name} className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{pillar.name}</span>
                      <Badge variant="secondary">
                        {pillar.count} {pillar.count === 1 ? 'use' : 'uses'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No content pillars yet
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {metrics.recentSessions.length > 0 ? (
                metrics.recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-medium">{session.title}</p>
                        <p className="text-xs text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {session.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}