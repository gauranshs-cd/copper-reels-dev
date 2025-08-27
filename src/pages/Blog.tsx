import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { 
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Video,
  Brain,
  Target,
  Sparkles,
  BookOpen,
  Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'How We Analyzed 10,000+ YouTube Videos to Find the Perfect Hook Formula',
    excerpt: 'Discover the data-driven approach we used to identify the most effective video hooks that get viewers to stay.',
    category: 'Research',
    readTime: '8 min read',
    date: 'January 15, 2025',
    tags: ['Hooks', 'Retention', 'Data Analysis'],
    featured: true
  },
  {
    id: 2,
    title: 'The $650K Investment: Building AI That Actually Understands YouTube',
    excerpt: 'Behind the scenes of our journey investing in masterclasses, technology, and team to create Copper Reels.',
    category: 'Journey',
    readTime: '12 min read',
    date: 'January 10, 2025',
    tags: ['AI', 'Technology', 'Investment'],
    featured: true
  },
  {
    id: 3,
    title: '7 Thumbnail Patterns That Increased CTR by 300%',
    excerpt: 'Real case studies from our clients showing thumbnail transformations and their impact on views.',
    category: 'Case Study',
    readTime: '6 min read',
    date: 'January 5, 2025',
    tags: ['Thumbnails', 'CTR', 'Design']
  },
  {
    id: 4,
    title: 'Why Your First 30 Seconds Matter More Than Ever in 2025',
    excerpt: 'YouTube\'s algorithm changes and what they mean for your content strategy this year.',
    category: 'Strategy',
    readTime: '7 min read',
    date: 'December 28, 2024',
    tags: ['Algorithm', 'Strategy', 'Retention']
  },
  {
    id: 5,
    title: 'From 0 to 100K Subscribers: The Exact Framework We Use',
    excerpt: 'A step-by-step breakdown of our proven system for channel growth, with real examples.',
    category: 'Growth',
    readTime: '15 min read',
    date: 'December 20, 2024',
    tags: ['Growth', 'Subscribers', 'Framework']
  },
  {
    id: 6,
    title: 'The Psychology of Viral Content: What Makes People Share',
    excerpt: 'Understanding the emotional triggers and patterns that drive viral video success.',
    category: 'Psychology',
    readTime: '10 min read',  
    date: 'December 15, 2024',
    tags: ['Psychology', 'Viral', 'Sharing']
  }
];

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Research', count: 1 },
  { name: 'Journey', count: 1 },
  { name: 'Case Study', count: 1 },
  { name: 'Strategy', count: 1 },
  { name: 'Growth', count: 1 },
  { name: 'Psychology', count: 1 }
];

export default function Blog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <section className="py-20 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <BookOpen className="w-3 h-3 mr-1" />
              Blog & Insights
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn from Our <span className="text-gradient">YouTube Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Data-driven insights, case studies, and strategies from analyzing thousands of successful videos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 justify-center flex-wrap">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {blogPosts.filter(post => post.featured).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:scale-105 transition-transform cursor-pointer group">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default">Featured</Badge>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="group-hover:gap-4 transition-all" onClick={() => navigate(`/blog/${post.id}`)}>
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Regular Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:scale-105 transition-transform cursor-pointer group">
                  <Badge variant="outline" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4" variant="default">
              <Sparkles className="w-3 h-3 mr-1" />
              Stay Updated
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Get YouTube Growth Tips Weekly
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join creators getting exclusive insights and strategies we don't share anywhere else
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')}>
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}