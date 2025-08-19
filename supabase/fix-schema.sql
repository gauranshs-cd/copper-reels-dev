-- Fix for the schema error
-- Run this if you got an error about creative_brief_id

-- First, drop the problematic index if it exists
DROP INDEX IF EXISTS idx_ideas_creative_brief_id;

-- Check if the ideas table exists and has the correct column
DO $$ 
BEGIN
    -- Check if the column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ideas' 
        AND column_name = 'creative_brief_id'
    ) THEN
        -- Create the index with the correct column name
        CREATE INDEX IF NOT EXISTS idx_ideas_creative_brief_id ON public.ideas(creative_brief_id);
    ELSE
        -- If the table doesn't have the column, we might need to recreate it
        RAISE NOTICE 'Column creative_brief_id does not exist in ideas table';
    END IF;
END $$;

-- If you need to start fresh, here's the clean version of just the tables that had issues:

-- Drop and recreate the ideas table with correct structure
DROP TABLE IF EXISTS public.ideas CASCADE;

CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creative_brief_id UUID NOT NULL,
  pillar_id UUID,
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

-- Add foreign key constraints after table creation
ALTER TABLE public.ideas 
  ADD CONSTRAINT fk_ideas_creative_brief 
  FOREIGN KEY (creative_brief_id) 
  REFERENCES public.creative_briefs(id) 
  ON DELETE CASCADE;

ALTER TABLE public.ideas 
  ADD CONSTRAINT fk_ideas_pillar 
  FOREIGN KEY (pillar_id) 
  REFERENCES public.pillars(id) 
  ON DELETE SET NULL;

-- Now create the index
CREATE INDEX idx_ideas_creative_brief_id ON public.ideas(creative_brief_id);
CREATE INDEX idx_ideas_status ON public.ideas(status);

-- Enable RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ideas table
CREATE POLICY "Users can view ideas from their sessions" ON public.ideas
  FOR SELECT USING (
    creative_brief_id IN (
      SELECT cb.id FROM public.creative_briefs cb
      JOIN public.sessions s ON cb.session_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ideas to their sessions" ON public.ideas
  FOR INSERT WITH CHECK (
    creative_brief_id IN (
      SELECT cb.id FROM public.creative_briefs cb
      JOIN public.sessions s ON cb.session_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ideas from their sessions" ON public.ideas
  FOR UPDATE USING (
    creative_brief_id IN (
      SELECT cb.id FROM public.creative_briefs cb
      JOIN public.sessions s ON cb.session_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();