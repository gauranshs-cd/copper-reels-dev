-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    
    -- Content fields
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'optimizing', 'review', 'approved', 'published')),
    
    -- SEO fields
    seo_score INTEGER DEFAULT 0,
    keyword_density DECIMAL(5,2),
    readability_score INTEGER,
    word_count INTEGER,
    
    -- Metadata
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    slug VARCHAR(255) UNIQUE,
    category VARCHAR(100),
    tags TEXT[], -- Array of tags
    
    -- Analytics
    internal_links INTEGER DEFAULT 0,
    external_links INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Indexes for performance
    CONSTRAINT unique_slug_per_team UNIQUE(team_id, slug)
);

-- Create keywords table
CREATE TABLE IF NOT EXISTS public.blog_keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    
    term VARCHAR(255) NOT NULL,
    search_volume INTEGER,
    difficulty INTEGER,
    cpc DECIMAL(10,2),
    trend VARCHAR(20) CHECK (trend IN ('rising', 'stable', 'declining')),
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_keyword_per_post UNIQUE(blog_post_id, term)
);

-- Create blog_drafts table for version history
CREATE TABLE IF NOT EXISTS public.blog_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    content TEXT NOT NULL,
    version INTEGER NOT NULL,
    changes_description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_version_per_post UNIQUE(blog_post_id, version)
);

-- Create blog_optimization_suggestions table
CREATE TABLE IF NOT EXISTS public.blog_optimization_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    
    suggestion TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('seo', 'readability', 'grammar', 'structure', 'links', 'keywords')),
    priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
    is_resolved BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_blog_posts_user_id ON public.blog_posts(user_id);
CREATE INDEX idx_blog_posts_team_id ON public.blog_posts(team_id);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_created_at ON public.blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_keywords_blog_post_id ON public.blog_keywords(blog_post_id);
CREATE INDEX idx_blog_drafts_blog_post_id ON public.blog_drafts(blog_post_id);
CREATE INDEX idx_blog_optimization_blog_post_id ON public.blog_optimization_suggestions(blog_post_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_optimization_suggestions ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Users can view own blog posts" ON public.blog_posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create blog posts" ON public.blog_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blog posts" ON public.blog_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blog posts" ON public.blog_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Team members can view team blog posts
CREATE POLICY "Team members can view team blog posts" ON public.blog_posts
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Keywords policies
CREATE POLICY "Users can manage keywords for own posts" ON public.blog_keywords
    FOR ALL USING (
        blog_post_id IN (
            SELECT id FROM public.blog_posts WHERE user_id = auth.uid()
        )
    );

-- Drafts policies
CREATE POLICY "Users can manage drafts for own posts" ON public.blog_drafts
    FOR ALL USING (
        blog_post_id IN (
            SELECT id FROM public.blog_posts WHERE user_id = auth.uid()
        )
    );

-- Optimization suggestions policies
CREATE POLICY "Users can manage suggestions for own posts" ON public.blog_optimization_suggestions
    FOR ALL USING (
        blog_post_id IN (
            SELECT id FROM public.blog_posts WHERE user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_post_updated_at();