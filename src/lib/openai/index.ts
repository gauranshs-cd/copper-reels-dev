import OpenAI from 'openai';
import { z } from 'zod';
import * as prompts from './prompts';

// Initialize OpenAI client
console.log('Initializing OpenAI with key:', import.meta.env.VITE_OPENAI_API_KEY ? 'Key exists' : 'No key found');
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use server-side API routes
});

// Schemas for validation
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

// Types
export type Foundation = z.infer<typeof FoundationSchema>;
export type Idea = z.infer<typeof IdeaSchema>;
export type TitleDraft = z.infer<typeof TitleDraftSchema>;
export type ThumbnailBrief = z.infer<typeof ThumbnailBriefSchema>;
export type Brick = z.infer<typeof BrickSchema>;
export type StoryboardFrame = z.infer<typeof StoryboardFrameSchema>;

// Bot service class
export class CopperReelsAI {
  private async callOpenAI(systemPrompt: string, userPrompt: string, temperature = 0.7) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');
      
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
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
  }): Promise<Foundation> {
    const systemPrompt = prompts.POSITIONING_BOT_SYSTEM;
    const userPrompt = prompts.buildPositioningUserPrompt(params);

    const result = await this.callOpenAI(systemPrompt, userPrompt);
    return FoundationSchema.parse(result);
  }

  // 2. Idea Generator
  async generateIdeas(params: {
    umbrella: string;
    viewerType: string;
    avatarSummary: string;
    pillars: any[];
    patternBank?: any;
    keyword?: string;
    styleGuide?: any;
  }): Promise<Idea[]> {
    const systemPrompt = prompts.IDEA_GENERATOR_SYSTEM;
    const userPrompt = prompts.buildIdeaGeneratorUserPrompt(params);

    const result = await this.callOpenAI(systemPrompt, userPrompt);
    return z.object({ ideas: z.array(IdeaSchema) }).parse(result).ideas;
  }

  // 3. Title Generator
  async generateTitles(params: {
    ideaConcept: string;
    pillarName: string;
    viewerType: string;
    patternBank?: any;
    tone?: string;
    styleGuide?: any;
  }): Promise<{ titles: TitleDraft[], guidance: string }> {
    const systemPrompt = prompts.TITLE_GENERATOR_SYSTEM;
    const userPrompt = prompts.buildTitleGeneratorUserPrompt(params);

    const result = await this.callOpenAI(systemPrompt, userPrompt);
    return z.object({ 
      titles: z.array(TitleDraftSchema),
      guidance: z.string().optional().default('')
    }).parse(result);
  }

  // 4. Thumbnail Brief Generator
  async generateThumbnailBriefs(params: {
    titleText: string;
    ideaConcept: string;
    patternBank?: any;
    brandKit?: any;
    styleGuide?: any;
  }): Promise<ThumbnailBrief[]> {
    const systemPrompt = `You are the Thumbnail Brief Generator. Produce concise creative briefs suitable for a designer or image model. Return ONLY JSON.

SCHEMA
{ "type":"object","required":["briefs"],
  "properties":{"briefs":{"type":"array","minItems":2,"maxItems":3,
    "items":{"type":"object","required":["overlayText","subject","expressionOrHero","background","composition","colorMood","props","shotList","avoid","imagePrompt","negativePrompt","templateHints"],
      "properties":{"overlayText":{"type":"string"},"subject":{"type":"string"},"expressionOrHero":{"type":"string"},"background":{"type":"string"},"composition":{"type":"string"},"colorMood":{"type":"string"},"props":{"type":"array","items":{"type":"string"}},"shotList":{"type":"array","items":{"type":"string"}},"avoid":{"type":"array","items":{"type":"string"}},"imagePrompt":{"type":"string"},"negativePrompt":{"type":"string"},"templateHints":{"type":"array","items":{"type":"string"}}}}}}}
RULES
- Follow Pattern Bank thumbPatterns; overlayText ≤ 4 words; mobile legible. Output JSON ONLY.`;

    const userPrompt = `Chosen or candidate title: ${params.titleText}
Idea concept: ${params.ideaConcept}
Pattern Bank: ${params.patternBank ? JSON.stringify(params.patternBank) : '{}'}
Brand kit (optional): ${params.brandKit ? JSON.stringify(params.brandKit) : '{}'}
Style Guide (optional): ${params.styleGuide ? JSON.stringify(params.styleGuide) : '{}'}
Return 2–3 thumbnail briefs.`;

    const result = await this.callOpenAI(systemPrompt, userPrompt);
    return z.object({ briefs: z.array(ThumbnailBriefSchema) }).parse(result).briefs;
  }

  // 5. Script & Storyboard Generator
  async generateScriptAndStoryboard(params: {
    chosenTitle: string;
    viewerType: string;
    avatarSummary: string;
    ideaConcept: string;
    selectedThumbBrief: any;
    mustCoverPoints?: string[];
    targetMinutes?: number;
    styleGuide?: any;
  }): Promise<{
    runtimeEstimateSec: number;
    bricks: Brick[];
    storyboard: any[];
    metadata: any;
  }> {
    const systemPrompt = `You are the Script & Storyboard Bot. Generate a YT script using YTGS Bricks and a visual storyboard. Return ONLY JSON.

SCHEMA
{ "type":"object","required":["runtimeEstimateSec","bricks","storyboard","metadata"],
  "properties":{
    "runtimeEstimateSec":{"type":"integer","minimum":60,"maximum":1800},
    "bricks":{"type":"array","minItems":4,"maxItems":8,"items":{"type":"object","required":["type","estimatedSec","narration","onScreen","callouts","broll","beats"],"properties":{"type":{"type":"string","enum":["INTRO","MIDDLE","EXAMPLE","APPLICATION","OUTRO"]},"estimatedSec":{"type":"integer"},"narration":{"type":"string"},"onScreen":{"type":"string"},"callouts":{"type":"array","items":{"type":"string"}},"broll":{"type":"array","items":{"type":"string"}},"beats":{"type":"array","items":{"type":"string"}}}}},
    "storyboard":{"type":"array","items":{"type":"object","required":["brickIndex","frames"],"properties":{"brickIndex":{"type":"integer"},"frames":{"type":"array","items":{"type":"object","required":["frameType","shot","description","onScreenText","graphics","assetsToPrep"],"properties":{"frameType":{"type":"string","enum":["A_ROLL","B_ROLL","OVERLAY"]},"shot":{"type":"string"},"description":{"type":"string"},"onScreenText":{"type":"string"},"graphics":{"type":"array","items":{"type":"string"}},"assetsToPrep":{"type":"array","items":{"type":"string"}}}}}}}},
    "metadata":{"type":"object","properties":{"cta":{"type":"string"},"chapters":{"type":"array","items":{"type":"string"}},"seoDescription":{"type":"string"},"tags":{"type":"array","items":{"type":"string"}}}}
}}
RULES
- Order: INTRO → 2–4 MIDDLE → EXAMPLE → APPLICATION → (optional) OUTRO. Output JSON ONLY.`;

    const userPrompt = `Title: ${params.chosenTitle}
ViewerType: ${params.viewerType}
Avatar (summary): ${params.avatarSummary}
Idea concept: ${params.ideaConcept}
Thumbnail brief (selected): ${JSON.stringify(params.selectedThumbBrief)}
Must-cover points (optional): ${params.mustCoverPoints?.join(', ') || ''}
Length target (minutes, optional): ${params.targetMinutes || ''}
Style Guide (optional): ${params.styleGuide ? JSON.stringify(params.styleGuide) : '{}'}
Generate the script bricks and storyboard JSON now.`;

    const result = await this.callOpenAI(systemPrompt, userPrompt);
    return z.object({
      runtimeEstimateSec: z.number(),
      bricks: z.array(BrickSchema),
      storyboard: z.array(z.any()),
      metadata: z.any()
    }).parse(result);
  }
}

// Export singleton instance
export const copperReelsAI = new CopperReelsAI();