import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon,
  User,
  Key,
  Palette,
  Bell,
  Database,
  Shield,
  Globe,
  Save,
  ArrowLeft,
  Check,
  X,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Brain,
  Video,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface ApiKey {
  name: string;
  key: string;
  masked: boolean;
  required: boolean;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  notifications: boolean;
  emailUpdates: boolean;
  defaultViewerType: 'LEARNER' | 'ENTHUSIAST' | 'EXPERT';
  defaultDifficulty: number;
  scriptLength: 'short' | 'medium' | 'long';
  thumbnailStyle: 'viral' | 'professional' | 'minimal';
  generateRealThumbnails: boolean;
  autoGenerateIdeas: boolean;
  showPsychologicalTriggers: boolean;
  teleprompterSpeed: number;
  patternBankEnabled: boolean;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resetStore } = useAppStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      name: 'Gemini API Key',
      key: import.meta.env.VITE_GEMINI_API_KEY || '',
      masked: true,
      required: true
    },
    {
      name: 'OpenAI API Key',
      key: localStorage.getItem('openai_api_key') || '',
      masked: true,
      required: false
    },
    {
      name: 'Unsplash API Key',
      key: localStorage.getItem('unsplash_api_key') || '',
      masked: true,
      required: false
    },
    {
      name: 'Pexels API Key',
      key: localStorage.getItem('pexels_api_key') || '',
      masked: true,
      required: false
    }
  ]);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: (localStorage.getItem('theme') as any) || 'system',
    autoSave: localStorage.getItem('autoSave') === 'true',
    notifications: localStorage.getItem('notifications') !== 'false',
    emailUpdates: localStorage.getItem('emailUpdates') === 'true',
    defaultViewerType: (localStorage.getItem('defaultViewerType') as any) || 'LEARNER',
    defaultDifficulty: parseInt(localStorage.getItem('defaultDifficulty') || '3'),
    scriptLength: (localStorage.getItem('scriptLength') as any) || 'medium',
    thumbnailStyle: (localStorage.getItem('thumbnailStyle') as any) || 'viral',
    generateRealThumbnails: localStorage.getItem('generateRealThumbnails') !== 'false',
    autoGenerateIdeas: localStorage.getItem('autoGenerateIdeas') === 'true',
    showPsychologicalTriggers: localStorage.getItem('showPsychologicalTriggers') !== 'false',
    teleprompterSpeed: parseInt(localStorage.getItem('teleprompterSpeed') || '50'),
    patternBankEnabled: localStorage.getItem('patternBankEnabled') !== 'false'
  });
  
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    channelName: localStorage.getItem('channelName') || '',
    niche: localStorage.getItem('niche') || '',
    bio: localStorage.getItem('bio') || ''
  });
  
  const [saving, setSaving] = useState(false);
  const [dataUsage, setDataUsage] = useState({
    foundations: 0,
    ideas: 0,
    scripts: 0,
    patterns: 0
  });

  useEffect(() => {
    // Calculate data usage
    const foundations = JSON.parse(localStorage.getItem('previous_foundations') || '[]').length;
    const history = JSON.parse(localStorage.getItem('generation_history') || '[]');
    const ideas = history.filter((h: any) => h.type === 'idea').length;
    const scripts = history.filter((h: any) => h.type === 'script').length;
    const patterns = JSON.parse(localStorage.getItem('custom_patterns') || '[]').length;
    
    setDataUsage({ foundations, ideas, scripts, patterns });
  }, []);

  const toggleApiKeyVisibility = (index: number) => {
    setApiKeys(prev => prev.map((key, i) => 
      i === index ? { ...key, masked: !key.masked } : key
    ));
  };

  const updateApiKey = (index: number, value: string) => {
    setApiKeys(prev => prev.map((key, i) => 
      i === index ? { ...key, key: value } : key
    ));
  };

  const saveApiKeys = () => {
    apiKeys.forEach(key => {
      if (key.name === 'OpenAI API Key') {
        localStorage.setItem('openai_api_key', key.key);
      } else if (key.name === 'Unsplash API Key') {
        localStorage.setItem('unsplash_api_key', key.key);
      } else if (key.name === 'Pexels API Key') {
        localStorage.setItem('pexels_api_key', key.key);
      }
    });
    toast.success('API keys saved successfully');
  };

  const savePreferences = () => {
    Object.entries(preferences).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    
    // Apply theme
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (preferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    toast.success('Preferences saved successfully');
  };

  const saveProfile = async () => {
    setSaving(true);
    
    // Save to localStorage
    Object.entries(profileData).forEach(([key, value]) => {
      if (key !== 'email') {
        localStorage.setItem(key, value);
      }
    });
    
    // Update Supabase profile if user is authenticated
    if (user) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: profileData.name,
            channel_name: profileData.channelName,
            niche: profileData.niche
          }
        });
        
        if (error) throw error;
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast.error('Failed to update profile');
      }
    } else {
      toast.success('Profile saved locally');
    }
    
    setSaving(false);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      // Clear localStorage
      const keysToKeep = ['supabase.auth.token', 'theme'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!keysToKeep.some(k => key.includes(k))) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset app store
      resetStore();
      
      toast.success('All data cleared successfully');
      navigate('/onboarding');
    }
  };

  const exportData = () => {
    const data = {
      profile: profileData,
      preferences,
      foundations: JSON.parse(localStorage.getItem('previous_foundations') || '[]'),
      history: JSON.parse(localStorage.getItem('generation_history') || '[]'),
      patterns: JSON.parse(localStorage.getItem('custom_patterns') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copper-reels-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="api">
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Palette className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Brain className="w-4 h-4 mr-2" />
                AI Settings
              </TabsTrigger>
              <TabsTrigger value="data">
                <Database className="w-4 h-4 mr-2" />
                Data
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="mt-1 opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="channel">Channel Name</Label>
                    <Input
                      id="channel"
                      value={profileData.channelName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, channelName: e.target.value }))}
                      placeholder="Your YouTube channel name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="niche">Niche/Industry</Label>
                    <Input
                      id="niche"
                      value={profileData.niche}
                      onChange={(e) => setProfileData(prev => ({ ...prev, niche: e.target.value }))}
                      placeholder="e.g., Technology, Education, Gaming"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself and your content..."
                      className="mt-1 min-h-24"
                    />
                  </div>
                  
                  <Button onClick={saveProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                        </motion.div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">API Keys</h2>
                <p className="text-muted-foreground mb-6">
                  Configure API keys for enhanced features
                </p>
                
                <div className="space-y-4 max-w-2xl">
                  {apiKeys.map((apiKey, index) => (
                    <div key={apiKey.name} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {apiKey.name}
                        {apiKey.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type={apiKey.masked ? 'password' : 'text'}
                          value={apiKey.key}
                          onChange={(e) => updateApiKey(index, e.target.value)}
                          placeholder={`Enter ${apiKey.name}`}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleApiKeyVisibility(index)}
                        >
                          {apiKey.masked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={saveApiKeys}>
                    <Save className="w-4 h-4 mr-2" />
                    Save API Keys
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Preferences</h2>
                
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value: any) => 
                        setPreferences(prev => ({ ...prev, theme: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoSave">Auto-save</Label>
                        <p className="text-sm text-muted-foreground">Automatically save your work</p>
                      </div>
                      <Switch
                        id="autoSave"
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, autoSave: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications">Notifications</Label>
                        <p className="text-sm text-muted-foreground">Show in-app notifications</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={preferences.notifications}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, notifications: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailUpdates">Email Updates</Label>
                        <p className="text-sm text-muted-foreground">Receive feature updates via email</p>
                      </div>
                      <Switch
                        id="emailUpdates"
                        checked={preferences.emailUpdates}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, emailUpdates: checked }))
                        }
                      />
                    </div>
                  </div>
                  
                  <Button onClick={savePreferences}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* AI Settings Tab */}
            <TabsContent value="ai" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">AI & Generation Settings</h2>
                
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <Label htmlFor="viewerType">Default Viewer Type</Label>
                    <Select
                      value={preferences.defaultViewerType}
                      onValueChange={(value: any) => 
                        setPreferences(prev => ({ ...prev, defaultViewerType: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LEARNER">Learner</SelectItem>
                        <SelectItem value="ENTHUSIAST">Enthusiast</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="scriptLength">Default Script Length</Label>
                    <Select
                      value={preferences.scriptLength}
                      onValueChange={(value: any) => 
                        setPreferences(prev => ({ ...prev, scriptLength: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (3-5 min)</SelectItem>
                        <SelectItem value="medium">Medium (5-10 min)</SelectItem>
                        <SelectItem value="long">Long (10+ min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="thumbnailStyle">Thumbnail Style</Label>
                    <Select
                      value={preferences.thumbnailStyle}
                      onValueChange={(value: any) => 
                        setPreferences(prev => ({ ...prev, thumbnailStyle: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viral">Viral (Bold & Colorful)</SelectItem>
                        <SelectItem value="professional">Professional (Clean)</SelectItem>
                        <SelectItem value="minimal">Minimal (Simple)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="realThumbnails">Generate Real Thumbnails</Label>
                        <p className="text-sm text-muted-foreground">Use AI to generate actual images</p>
                      </div>
                      <Switch
                        id="realThumbnails"
                        checked={preferences.generateRealThumbnails}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, generateRealThumbnails: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoGenerate">Auto-generate Ideas</Label>
                        <p className="text-sm text-muted-foreground">Automatically generate ideas on foundation completion</p>
                      </div>
                      <Switch
                        id="autoGenerate"
                        checked={preferences.autoGenerateIdeas}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, autoGenerateIdeas: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="psychological">Show Psychological Triggers</Label>
                        <p className="text-sm text-muted-foreground">Display psychological triggers in scripts</p>
                      </div>
                      <Switch
                        id="psychological"
                        checked={preferences.showPsychologicalTriggers}
                        onCheckedChange={(checked) => 
                          setPreferences(prev => ({ ...prev, showPsychologicalTriggers: checked }))
                        }
                      />
                    </div>
                  </div>
                  
                  <Button onClick={savePreferences}>
                    <Save className="w-4 h-4 mr-2" />
                    Save AI Settings
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Data Management Tab */}
            <TabsContent value="data" className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Data Management</h2>
                
                <div className="space-y-6">
                  {/* Storage Usage */}
                  <div>
                    <h3 className="font-semibold mb-4">Storage Usage</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card className="p-4 text-center">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{dataUsage.foundations}</div>
                        <div className="text-sm text-muted-foreground">Foundations</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <Lightbulb className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{dataUsage.ideas}</div>
                        <div className="text-sm text-muted-foreground">Ideas</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{dataUsage.scripts}</div>
                        <div className="text-sm text-muted-foreground">Scripts</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{dataUsage.patterns}</div>
                        <div className="text-sm text-muted-foreground">Patterns</div>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Data Actions */}
                  <div>
                    <h3 className="font-semibold mb-4">Data Actions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Export Data</h4>
                          <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
                        </div>
                        <Button variant="outline" onClick={exportData}>
                          <Database className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Clear All Data</h4>
                          <p className="text-sm text-muted-foreground text-red-600">
                            This action cannot be undone
                          </p>
                        </div>
                        <Button variant="destructive" onClick={clearAllData}>
                          <X className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}