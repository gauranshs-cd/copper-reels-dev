# Supabase Setup Instructions

## Your Supabase Project Details

- **Project URL**: `https://vdfqlbslaoogzfkczosi.supabase.co`
- **Project Reference**: `vdfqlbslaoogzfkczosi`

## Step 1: Run the Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/vdfqlbslaoogzfkczosi

2. Navigate to **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy the entire contents of `/supabase/schema.sql` file

5. Paste it into the SQL editor

6. Click **Run** (or press Ctrl/Cmd + Enter)

You should see a success message indicating all tables have been created.

## Step 2: Enable Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard

2. Enable the following providers (recommended):
   - **Email** (already enabled by default)
   - **Google** (optional, for OAuth login)
   - **GitHub** (optional, for OAuth login)

3. For Email authentication, configure:
   - Enable email confirmations (optional)
   - Set up email templates if needed

## Step 3: Verify Tables Created

1. Go to **Table Editor** in the sidebar

2. You should see these tables:
   - profiles
   - channels
   - audience_avatars
   - pillars
   - pattern_banks
   - sessions
   - creative_briefs
   - inspirations
   - ideas
   - title_drafts
   - thumbnail_briefs
   - video_plans
   - exports
   - generation_logs

## Step 4: Test the Integration

1. Open your app at http://localhost:8081/

2. Sign up with an email address (or use OAuth if configured)

3. Enter an umbrella statement like:
   - "I help developers learn React"
   - "I help entrepreneurs build online businesses"
   - "I help students ace their exams"

4. Click "Run" and watch the AI generate your content foundation

5. Check your Supabase dashboard:
   - Go to **Table Editor** → **sessions**
   - You should see a new session record
   - Check **generation_logs** for AI generation tracking

## Step 5: Monitor Usage

### Database Tables to Watch:
- **sessions**: Track user creative sessions
- **creative_briefs**: Main working documents
- **generation_logs**: Monitor AI API usage and performance
- **ideas**: All generated content ideas

### Useful SQL Queries:

Get recent sessions:
```sql
SELECT s.*, p.email 
FROM sessions s
JOIN profiles p ON s.user_id = p.id
ORDER BY s.started_at DESC
LIMIT 10;
```

Check AI generation performance:
```sql
SELECT 
  bot_type,
  COUNT(*) as total_calls,
  AVG(duration_ms) as avg_duration_ms,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as failed
FROM generation_logs
GROUP BY bot_type;
```

Get user activity:
```sql
SELECT 
  p.email,
  COUNT(DISTINCT s.id) as total_sessions,
  COUNT(DISTINCT cb.id) as total_briefs,
  MAX(s.last_activity_at) as last_active
FROM profiles p
LEFT JOIN sessions s ON p.id = s.user_id
LEFT JOIN creative_briefs cb ON s.id = cb.session_id
GROUP BY p.id, p.email
ORDER BY last_active DESC;
```

## Troubleshooting

### If tables don't create:
1. Check for any error messages in the SQL editor
2. Make sure you're running the SQL in the correct project
3. Try running the schema in smaller chunks

### If authentication doesn't work:
1. Check that your `.env` file has the correct keys
2. Verify the keys match your Supabase project
3. Restart the development server after changing `.env`

### If data isn't saving:
1. Check browser console for errors
2. Verify Row Level Security (RLS) policies are enabled
3. Make sure you're logged in when testing

## Security Notes

- The anon key is safe to use in the frontend (it's public)
- The service role key (second one you provided) should NEVER be exposed to the client
- Keep the service role key secure and only use it in server-side code if needed

## Next Steps

1. ✅ Database is ready
2. ✅ Authentication is configured
3. ✅ Start using the app with real AI generation
4. 📊 Monitor usage in Supabase dashboard
5. 🔧 Customize prompts based on results