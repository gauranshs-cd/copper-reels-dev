# Copper Reels - AI-Powered YouTube Content Creation System

## Overview
Copper Reels is an AI-powered platform that helps YouTube creators transform their mission statements into complete content strategies, including audience profiling, idea generation, titles, thumbnails, scripts, and storyboards.

## Current Setup

### 1. OpenAI Integration
- **API Key**: Configured in `.env` file as `VITE_OPENAI_API_KEY`
- **Model**: GPT-4 Turbo Preview
- **Service Location**: `/src/lib/openai/index.ts`

### 2. Supabase Database
- **Schema**: Located in `/supabase/schema.sql`
- **Service**: `/src/lib/supabase/session-service.ts`
- **Tables**:
  - `profiles`: User profiles
  - `channels`: YouTube channels
  - `sessions`: Creative sessions tracking
  - `creative_briefs`: Main working documents
  - `ideas`: Generated content ideas
  - `generation_logs`: AI generation tracking

### 3. Key Features Implemented
- ✅ OpenAI API integration for content generation
- ✅ Supabase database schema for session tracking
- ✅ Real-time content foundation generation
- ✅ Editable AI-generated content
- ✅ Session persistence and history tracking
- ✅ Generation logging for analytics

## Setting Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Get your project credentials:
   - Go to Settings → API
   - Copy the `URL` and `anon public` key

3. Update your `.env` file:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the database schema:
   - Go to SQL Editor in Supabase
   - Copy the contents of `/supabase/schema.sql`
   - Run the SQL to create all tables

## Research Guidelines

### Adding Your Research
Create files in this `/docs` folder to add your research:

1. **Prompt Templates** (`/docs/prompts.md`):
   - Store and refine your prompt templates
   - Test different variations
   - Document what works best

2. **Content Patterns** (`/docs/patterns.md`):
   - Document successful title patterns
   - Thumbnail strategies that work
   - Hook formulas

3. **Audience Insights** (`/docs/audience.md`):
   - Research on different viewer types
   - Engagement patterns
   - Content preferences by niche

4. **Performance Metrics** (`/docs/metrics.md`):
   - Track what generates the best results
   - A/B testing results
   - User feedback

### Updating the AI Prompts
The AI prompts are located in `/src/lib/openai/index.ts`. Each bot has its own method:

- `generateFoundation()`: Positioning bot for audience and pillars
- `generateIdeas()`: Idea generation bot
- `generateTitles()`: Title creation bot
- `generateThumbnailBriefs()`: Thumbnail brief generator
- `generateScriptAndStoryboard()`: Script and storyboard bot

To modify prompts:
1. Find the relevant method in the file
2. Update the `systemPrompt` or `userPrompt` strings
3. Test the changes in the application

## Current AI Bots

### 1. Positioning Bot
- **Purpose**: Creates audience avatar, viewer type, and content pillars
- **Input**: Umbrella statement ("I help X achieve Y")
- **Output**: Demographics, psychographics, viewer type, content pillars

### 2. Idea Generator
- **Purpose**: Generates 12-20 video ideas
- **Input**: Foundation data, pattern bank, style guide
- **Output**: Ideas with concept, angle, difficulty, thumbnail hints

### 3. Title Generator
- **Purpose**: Creates 6 high-CTR title options
- **Input**: Idea concept, viewer type, pattern bank
- **Output**: Titles with scores, power words, predicted issues

### 4. Thumbnail Brief Generator
- **Purpose**: Creates 2-3 thumbnail design briefs
- **Input**: Title, idea concept, pattern bank
- **Output**: Detailed briefs with overlay text, composition, prompts

### 5. Script & Storyboard Bot
- **Purpose**: Generates complete script and visual storyboard
- **Input**: Title, idea, viewer type, thumbnail brief
- **Output**: Script bricks (INTRO, MIDDLE, EXAMPLE, etc.) and storyboard frames

## Testing the Integration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the flow**:
   - Enter an umbrella statement in Onboarding
   - Click "Run" to generate foundation with real AI
   - Edit any generated content inline
   - Navigate to Ideas to generate content ideas
   - Continue to Video Planning for scripts

3. **Monitor the console**:
   - Check browser console for API calls
   - Look for any error messages
   - Verify data is being saved to Supabase

## Troubleshooting

### OpenAI API Issues
- **Rate Limits**: The API has rate limits. If you hit them, wait a few seconds
- **API Key**: Ensure your key has sufficient credits
- **Network**: Check your internet connection

### Supabase Issues
- **Authentication**: Make sure RLS policies are set correctly
- **Connection**: Verify your Supabase URL and key are correct
- **Schema**: Ensure all tables were created successfully

## Next Steps

1. **Complete Supabase Setup**:
   - Add your Supabase credentials to `.env`
   - Run the schema SQL in your Supabase project
   - Test user authentication

2. **Customize Prompts**:
   - Review and adjust the prompts in `/src/lib/openai/index.ts`
   - Add your specific requirements or tone
   - Test with different inputs

3. **Add Inspirations Feature**:
   - Implement YouTube video fetching
   - Create style guide extraction
   - Weight and tag system for influences

4. **Implement Exports**:
   - Markdown script export
   - CSV B-roll list
   - YouTube metadata package

## Development Notes

- The app uses Zustand for state management
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- TypeScript for type safety

## Support

For issues or questions:
1. Check the console for error messages
2. Review the `/docs` folder for additional documentation
3. Verify your API keys and database connection
4. Test with simplified inputs first