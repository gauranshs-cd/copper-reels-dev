import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import * as prompts from '../openai/prompts';
import { supabase } from '@/integrations/supabase/client';
import { generateFallbackScript } from './fallback-scripts';

// Initialize Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log('Initializing Gemini with key:', apiKey ? 'Key exists' : 'No key found');

const genAI = new GoogleGenerativeAI(apiKey);

// Re-define schemas here to avoid circular dependencies
export const FoundationSchema = z.object({
  avatar: z.object({
    demographics: z.object({
      ageRange: z.string(),
      locations: z.array(z.string()),
      roles: z.array(z.string()),
      incomeRange: z.string().optional()
    }),
    psychographics: z.object({
      fears: z.array(z.string()),
      goals: z.array(z.string()),
      rankedProblems: z.array(z.object({
        problem: z.string(),
        whyItMatters: z.string()
      }))
    })
  }),
  viewerType: z.enum(['LEARNER', 'ENTHUSIAST', 'EXPERT']),
  pillars: z.array(z.object({
    name: z.string(),
    summary: z.string()
  })).min(3).max(5),
  notes: z.object({
    rationale: z.string(),
    toneOfVoice: z.array(z.string())
  })
});

export const IdeaSchema = z.object({
  concept: z.string(),
  pillar: z.string(),
  angle: z.string(),
  whyItWillClick: z.string(),
  thumbnailHint: z.string(),
  difficulty: z.number().min(1).max(5),
  stage: z.enum(['new', 'stuck', 'leveling_up']).optional(),
  notes: z.string().optional()
});

export const TitleDraftSchema = z.object({
  text: z.string(),
  shape: z.string(),
  score: z.number().min(0).max(1),
  powerWordsUsed: z.array(z.string()),
  predictedIssues: z.array(z.string())
});

export const ThumbnailBriefSchema = z.object({
  overlayText: z.string(),
  subject: z.string(),
  expressionOrHero: z.string(),
  background: z.string(),
  composition: z.string(),
  colorMood: z.string(),
  props: z.array(z.string()),
  shotList: z.array(z.string()),
  avoid: z.array(z.string()),
  imagePrompt: z.string(),
  negativePrompt: z.string(),
  templateHints: z.array(z.string())
});

export const BrickSchema = z.object({
  type: z.enum(['INTRO', 'MIDDLE', 'EXAMPLE', 'APPLICATION', 'OUTRO']),
  estimatedSec: z.number(),
  narration: z.string(),
  onScreen: z.string(),
  callouts: z.array(z.string()),
  broll: z.array(z.string()),
  beats: z.array(z.string())
});

export const StoryboardFrameSchema = z.object({
  frameType: z.enum(['A_ROLL', 'B_ROLL', 'OVERLAY']),
  shot: z.string(),
  description: z.string(),
  onScreenText: z.string(),
  graphics: z.array(z.string()),
  assetsToPrep: z.array(z.string())
});

export type Foundation = z.infer<typeof FoundationSchema>;
export type Idea = z.infer<typeof IdeaSchema>;
export type TitleDraft = z.infer<typeof TitleDraftSchema>;
export type ThumbnailBrief = z.infer<typeof ThumbnailBriefSchema>;
export type Brick = z.infer<typeof BrickSchema>;
export type StoryboardFrame = z.infer<typeof StoryboardFrameSchema>;

// Video Script Table Schema
export const VideoScriptRowSchema = z.object({
  id: z.string(),
  brick: z.string(),
  time: z.string(),
  scriptBeats: z.string(),
  avatarDialogue: z.string(),
  psychologicalTrigger: z.string()
});

export type VideoScriptRow = z.infer<typeof VideoScriptRowSchema>;

// Bot service class using Gemini
export class CopperReelsGemini {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  private getCustomPrompt(promptType: string): string | null {
    // Check localStorage for custom prompts
    const saved = localStorage.getItem('copper_reels_custom_prompts');
    if (saved) {
      const customPrompts = JSON.parse(saved);
      return customPrompts[promptType] || null;
    }
    return null;
  }
  
  private async callGemini(systemPrompt: string, userPrompt: string, promptType?: string) {
    try {
      // Check for custom prompt if type is provided
      let finalSystemPrompt = systemPrompt;
      if (promptType) {
        const customPrompt = this.getCustomPrompt(promptType);
        if (customPrompt) {
          finalSystemPrompt = customPrompt;
          console.log(`Using custom prompt for ${promptType}`);
        }
      }
      
      // Combine system and user prompts for Gemini
      const fullPrompt = `${finalSystemPrompt}\n\nUSER REQUEST:\n${userPrompt}`;
      
      console.log('Calling Gemini API with prompt type:', promptType || 'default');
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini raw response:', text.substring(0, 200) + '...');
      
      // Try to extract JSON from the response
      // First try to find JSON between ```json and ``` markers
      let jsonStr = text;
      if (text.includes('```json')) {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
      } else if (text.includes('```')) {
        // Try without json marker
        const jsonMatch = text.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
      }
      
      // Try to find JSON object
      const jsonObjMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonObjMatch) {
        console.error('No JSON found in response:', text);
        throw new Error('No JSON found in response');
      }
      
      try {
        return JSON.parse(jsonObjMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse JSON:', jsonObjMatch[0]);
        throw new Error(`Invalid JSON in response: ${parseError.message}`);
      }
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Check if it's a quota error
      if (error?.message?.includes('quota') || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('API quota exceeded. Using fallback generation.');
      }
      
      throw error;
    }
  }

  // 1. Positioning Bot (Foundation)
  async generateFoundation(params: {
    umbrella: string;
    channelName?: string;
    locale?: string;
    contentHints?: string;
    constraints?: string;
  }) {
    const systemPrompt = prompts.POSITIONING_BOT_SYSTEM;
    const userPrompt = prompts.buildPositioningUserPrompt(params);
    
    const result = await this.callGemini(systemPrompt, userPrompt, 'POSITIONING');
    return FoundationSchema.parse(result);
  }

  // 2. Idea Generator (Limited to 3 ideas for better quality)
  async generateIdeas(params: {
    umbrella: string;
    viewerType: string;
    avatarSummary: string;
    pillars: any[];
    patternBank?: any;
    keyword?: string;
    styleGuide?: any;
  }) {
    // Import pattern bank data
    const { getViralTitlePatterns, getPowerWords } = await import('@/lib/pattern-bank');
    
    // Enhance params with pattern bank data
    const enhancedParams = {
      ...params,
      patternBank: {
        viralTitles: getViralTitlePatterns(),
        powerWords: getPowerWords(),
        ...params.patternBank
      }
    };
    
    // Modify system prompt to generate only 3 high-quality ideas
    const modifiedSystemPrompt = prompts.IDEA_GENERATOR_SYSTEM + '\n\nIMPORTANT: Generate exactly 3 high-quality, diverse video ideas. Focus on quality over quantity.';
    const userPrompt = prompts.buildIdeaGeneratorUserPrompt(enhancedParams);
    
    const result = await this.callGemini(modifiedSystemPrompt, userPrompt, 'IDEA_GENERATOR');
    const ideas = z.object({ ideas: z.array(IdeaSchema) }).parse(result).ideas;
    
    // Ensure we return exactly 3 ideas
    return ideas.slice(0, 3);
  }

  // 3. Generate Video Script Table (NEW - Based on your example)
  async generateVideoScriptTable(params: {
    topic: string;
    avatarProfile: string;
    targetAudience: string;
    duration?: number;
  }): Promise<VideoScriptRow[]> {
    const prompt = `
You are creating a video script for YouTube content. Generate a structured script table with psychological triggers.

Topic: ${params.topic}
Avatar Profile: ${params.avatarProfile}
Target Audience: ${params.targetAudience}
Duration: ${params.duration || 10} minutes

Create a video script table with these exact columns:
- BRICK (section name like INTRO BRICK, MIDDLE BRICK 1, etc.)
- TIME (timestamp range like 0:00-0:30)
- SCRIPT BEATS (the actual script content, key points to cover)
- AVATAR'S INTERNAL DIALOGUE (what the viewer is thinking)
- PSYCHOLOGICAL TRIGGER (the psychological principle being used)

Return ONLY a JSON object with this structure:
{
  "scriptRows": [
    {
      "id": "unique-id",
      "brick": "INTRO BRICK",
      "time": "0:00-0:30",
      "scriptBeats": "Main hook and opening statement...",
      "avatarDialogue": "What the viewer is thinking...",
      "psychologicalTrigger": "Mirror Neuron Activation"
    }
  ]
}

Include at least:
- INTRO BRICK
- PROBLEM AGITATION
- STAKES SETUP
- 2-3 MIDDLE BRICKS
- APPLICATION sections
- END BRICK

Make it specific, actionable, and psychologically targeted to the avatar.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return z.object({ 
      scriptRows: z.array(VideoScriptRowSchema) 
    }).parse(parsed).scriptRows;
  }

  // 4. Title Generator
  async generateTitles(params: {
    ideaConcept: string;
    pillarName: string;
    viewerType: string;
    patternBank?: any;
    tone?: string;
    styleGuide?: any;
  }) {
    const systemPrompt = prompts.TITLE_GENERATOR_SYSTEM;
    const userPrompt = prompts.buildTitleGeneratorUserPrompt(params);
    
    const result = await this.callGemini(systemPrompt, userPrompt, 'TITLE_GENERATOR');
    return z.object({ 
      titles: z.array(TitleDraftSchema),
      guidance: z.string().optional().default('')
    }).parse(result);
  }

  // 5. Thumbnail Brief Generator
  async generateThumbnailBriefs(params: {
    titleText: string;
    ideaConcept: string;
    patternBank?: any;
    brandKit?: any;
    styleGuide?: any;
  }) {
    const systemPrompt = prompts.THUMBNAIL_BRIEF_SYSTEM;
    const userPrompt = prompts.buildThumbnailBriefUserPrompt(params);
    
    const result = await this.callGemini(systemPrompt, userPrompt, 'THUMBNAIL_BRIEF');
    return z.object({ briefs: z.array(ThumbnailBriefSchema) }).parse(result).briefs;
  }

  // 6. Script & Storyboard Generator
  async generateScriptAndStoryboard(params: {
    chosenTitle: string;
    viewerType: string;
    avatarSummary: string;
    ideaConcept: string;
    selectedThumbBrief: any;
    mustCoverPoints?: string[];
    targetMinutes?: number;
    styleGuide?: any;
  }) {
    const systemPrompt = prompts.SCRIPT_STORYBOARD_SYSTEM;
    const userPrompt = prompts.buildScriptStoryboardUserPrompt(params);
    
    try {
      // Try API first
      let result;
      try {
        result = await this.callGemini(systemPrompt, userPrompt, 'SCRIPT_STORYBOARD');
      } catch (apiError: any) {
        console.warn('API call failed, using fallback:', apiError.message);
        
        // Use fallback if quota exceeded or API fails
        if (apiError.message.includes('quota') || apiError.message.includes('API')) {
          console.log('Using fallback script generation');
          return generateFallbackScript({
            chosenTitle: params.chosenTitle,
            viewerType: params.viewerType,
            ideaConcept: params.ideaConcept,
            targetMinutes: params.targetMinutes
          });
        }
        throw apiError;
      }
      
      // Try to parse the full response
      try {
        return z.object({
          runtimeEstimateSec: z.number(),
          bricks: z.array(BrickSchema),
          storyboard: z.array(z.any()).optional().default([]),
          metadata: z.any().optional().default({})
        }).parse(result);
      } catch (parseError) {
        console.warn('Full parse failed, trying minimal structure:', parseError);
        
        // Fallback: Try to extract just bricks
        if (result.bricks && Array.isArray(result.bricks)) {
          return {
            runtimeEstimateSec: result.runtimeEstimateSec || 300,
            bricks: result.bricks,
            storyboard: result.storyboard || [],
            metadata: result.metadata || {}
          };
        }
        
        // Ultimate fallback: Generate default structure
        console.warn('Using fallback script structure');
        return {
          runtimeEstimateSec: 300,
          bricks: [
            {
              type: 'INTRO',
              estimatedSec: 30,
              narration: `Welcome! Today we're covering: ${params.chosenTitle}`,
              onScreen: params.chosenTitle,
              callouts: ['Hook', 'Problem', 'Value'],
              broll: ['Title card', 'Preview shots'],
              beats: ['Open strong', 'State problem', 'Preview value']
            },
            {
              type: 'MIDDLE',
              estimatedSec: 180,
              narration: `Let's dive into the main content about ${params.ideaConcept}`,
              onScreen: 'Main Points',
              callouts: ['Point 1', 'Point 2', 'Point 3'],
              broll: ['Examples', 'Demonstrations'],
              beats: ['Explain concept', 'Show examples', 'Application']
            },
            {
              type: 'OUTRO',
              estimatedSec: 30,
              narration: 'Thanks for watching! Like and subscribe for more.',
              onScreen: 'Subscribe',
              callouts: ['CTA', 'Next video'],
              broll: ['End screen'],
              beats: ['Recap', 'Call to action', 'Next video tease']
            }
          ],
          storyboard: [],
          metadata: {
            cta: 'Subscribe for more content',
            chapters: ['Intro', 'Main Content', 'Outro'],
            tags: params.ideaConcept.split(' ').filter(w => w.length > 3)
          }
        };
      }
    } catch (error) {
      console.error('Script generation failed:', error);
      throw new Error('Failed to generate script. Please try again.');
    }
  }
}

// Export singleton instance
export const copperReelsGemini = new CopperReelsGemini();