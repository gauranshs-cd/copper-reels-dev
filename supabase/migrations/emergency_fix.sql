-- Emergency fix - drop everything and start fresh
DROP TABLE IF EXISTS team_activity CASCADE;
DROP TABLE IF EXISTS shared_content CASCADE;
DROP TABLE IF EXISTS team_invitations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

DROP TYPE IF EXISTS team_role CASCADE;
DROP TYPE IF EXISTS member_status CASCADE;
DROP TYPE IF EXISTS invitation_status CASCADE;
DROP TYPE IF EXISTS content_type CASCADE;

-- Create the simplest possible teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the simplest possible team_members table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS, no policies, just raw tables
-- Grant everything to everyone (we'll fix security later)
GRANT ALL ON teams TO anon, authenticated, service_role;
GRANT ALL ON team_members TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Test insert to make sure it works
DO $$
BEGIN
  -- Only run if no teams exist
  IF NOT EXISTS (SELECT 1 FROM teams LIMIT 1) THEN
    INSERT INTO teams (name, slug, owner_id) 
    VALUES ('System Test Team', 'system-test-' || gen_random_uuid(), gen_random_uuid());
    RAISE NOTICE 'Test team created successfully';
  END IF;
END $$;