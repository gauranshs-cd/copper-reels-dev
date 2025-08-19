-- Supabase Schema for Copper Reels
-- This schema tracks user sessions, creative briefs, and all YouTube content generation history

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channels table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  umbrella_statement TEXT NOT NULL,
  channel_about TEXT,
  primary_goal TEXT,
  viewer_type TEXT CHECK (viewer_type IN ('LEARNER', 'ENTHUSIAST', 'EXPERT')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Audience Avatars table
CREATE TABLE IF NOT EXISTS public.audience_avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  demographics JSONB NOT NULL DEFAULT '{}'::jsonb,
  psychographics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Pillars table
CREATE TABLE IF NOT EXISTS public.pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pattern Banks table
CREATE TABLE IF NOT EXISTS public.pattern_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  power_words TEXT[] DEFAULT '{}',
  title_shapes JSONB DEFAULT '[]'::jsonb,
  thumb_patterns JSONB DEFAULT '[]'::jsonb,
  sources JSONB DEFAULT '[]'::jsonb,
  words_to_avoid TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (tracks each creative session)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Creative Briefs table (main working document)
CREATE TABLE IF NOT EXISTS public.creative_briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  foundation JSONB NOT NULL DEFAULT '{}'::jsonb,
  style_guide JSONB DEFAULT '{}'::jsonb,
  pattern_bank_stale BOOLEAN DEFAULT FALSE,
  ideas_stale BOOLEAN DEFAULT FALSE,
  planning_stale BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspirations table (YouTube reference videos)
CREATE TABLE IF NOT EXISTS public.inspirations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creative_brief_id UUID NOT NULL REFERENCES public.creative_briefs(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  channel_title TEXT,
  duration_sec INTEGER,
  published_at TIMESTAMPTZ,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  weight INTEGER DEFAULT 3 CHECK (weight >= 1 AND weight <= 5),
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creative_brief_id UUID NOT NULL REFERENCES public.creative_briefs(id) ON DELETE CASCADE,
  pillar_id UUID REFERENCES public.pillars(id) ON DELETE SET NULL,
  concept TEXT NOT NULL,
  angle TEXT,
  why_it_will_click TEXT,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
  thumbnail_hint TEXT,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'shortlisted', 'selected', 'rejected')),
  stage TEXT CHECK (stage IN ('new', 'stuck', 'leveling_up')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Title Drafts table
CREATE TABLE IF NOT EXISTS public.title_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  score DECIMAL(3,2) CHECK (score >= 0 AND score <= 1),
  shape TEXT,
  power_words_used TEXT[] DEFAULT '{}',
  predicted_issues TEXT[] DEFAULT '{}',
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thumbnail Briefs table
CREATE TABLE IF NOT EXISTS public.thumbnail_briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  overlay_text TEXT,
  subject TEXT,
  expression_or_hero TEXT,
  background TEXT,
  composition TEXT,
  color_mood TEXT,
  props TEXT[] DEFAULT '{}',
  shot_list TEXT[] DEFAULT '{}',
  avoid TEXT[] DEFAULT '{}',
  image_prompt TEXT,
  negative_prompt TEXT,
  template_hints TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video Plans table
CREATE TABLE IF NOT EXISTS public.video_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  chosen_title_id UUID REFERENCES public.title_drafts(id) ON DELETE SET NULL,
  chosen_thumb_id UUID REFERENCES public.thumbnail_briefs(id) ON DELETE SET NULL,
  runtime_estimate_sec INTEGER,
  bricks JSONB NOT NULL DEFAULT '[]'::jsonb,
  storyboard JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exports table (track what users exported)
CREATE TABLE IF NOT EXISTS public.exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_plan_id UUID NOT NULL REFERENCES public.video_plans(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('script_md', 'broll_csv', 'youtube_metadata', 'full_package')),
  file_url TEXT,
  exported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generation Logs table (track all AI generations for analytics)
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  bot_type TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  request_payload JSONB,
  response_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_channels_user_id ON public.channels(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_channel_id ON public.sessions(channel_id);
CREATE INDEX IF NOT EXISTS idx_creative_briefs_session_id ON public.creative_briefs(session_id);
CREATE INDEX IF NOT EXISTS idx_ideas_creative_brief_id ON public.ideas(creative_brief_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status);
CREATE INDEX IF NOT EXISTS idx_generation_logs_session_id ON public.generation_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at ON public.generation_logs(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.title_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thumbnail_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table
-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Channels: Users can only see and edit their own channels
CREATE POLICY "Users can view own channels" ON public.channels
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own channels" ON public.channels
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own channels" ON public.channels
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own channels" ON public.channels
  FOR DELETE USING (auth.uid() = user_id);

-- Sessions: Users can only see and manage their own sessions
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Apply similar policies to all other tables (simplified for brevity)
-- In production, you'd want more granular policies

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audience_avatars_updated_at BEFORE UPDATE ON public.audience_avatars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pillars_updated_at BEFORE UPDATE ON public.pillars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pattern_banks_updated_at BEFORE UPDATE ON public.pattern_banks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_creative_briefs_updated_at BEFORE UPDATE ON public.creative_briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_plans_updated_at BEFORE UPDATE ON public.video_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();