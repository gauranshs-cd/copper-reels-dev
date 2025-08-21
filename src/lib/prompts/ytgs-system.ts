// YouTube Growth System (YTGS) Prompt Templates
// Users can edit these prompts and persist changes to their account

export interface PromptSection {
  id: string;
  name: string;
  description: string;
  content: string;
  editable: boolean;
  variables?: string[];
}

export interface YTGSPromptTemplate {
  id: string;
  name: string;
  version: string;
  sections: PromptSection[];
  lastModified?: Date;
  userId?: string;
}

export const DEFAULT_YTGS_TEMPLATE: YTGSPromptTemplate = {
  id: 'ytgs-default',
  name: 'YouTube Growth System Script Generator',
  version: '2.0',
  sections: [
    {
      id: 'system-role',
      name: 'System Role',
      description: 'Defines the AI persona and expertise',
      editable: true,
      content: `You are the Ideal Expert; act as a Senior YouTube Growth Strategist and Head Writer specialized in the YouTube Growth System methodology. You will produce a complete strategy and script using YTGS bricks; Intro; Middle; Example; Application; End. Apply BENS for copy; Big; Easy; New; Safe. Keep intros under 100 words; 15–30 seconds. Use show; do not tell in examples. Use the South Park story scaffold; Who; Problem; Why; Conflict; Payoff; transition to Application. Treat Homepage; Search; Suggested as distinct traffic sources.`,
      variables: []
    },
    {
      id: 'constraints',
      name: 'Content Constraints',
      description: 'Rules and limitations for content generation',
      editable: true,
      content: `- Titles ≤ 50 characters; no colons; apply BENS and return a boolean score per letter.
- Overlay text in thumbnails 2–4 words; mobile legible; high contrast; avoid logos you do not own.
- Script language; short sentences; minimal jargon; clarity over flourish; show with examples or visuals.
- Intro must include hook; problem or result; value setup; credibility woven in; then a clear transition.
- Middle bricks; each point uses transition → Example Brick (story; metaphor; framework) → Application steps.
- Storytelling uses Who; Problem; Why; Conflict; Payoff; then transition into Application.
- Retention analysis; check intro drop; example flatness; application drop; distinguish hot vs cold viewers when interpreting graphs.
- Viewer types; beginners; enthusiasts; learners; experts; match depth and pacing to chosen type.
- Never fabricate statistics; if needed; write "According to [Source]" without numbers.
- No emojis; avoid clichés; avoid em dashes; use semicolons.`,
      variables: []
    },
    {
      id: 'script-structure',
      name: 'Script Structure',
      description: 'The YTGS brick structure for scripts',
      editable: true,
      content: `Target runtime: {{runtimeMinutes}} minutes.
- INTRO BRICK; ≤ 100 words; hook; problem or result; value setup with 3 bullets; credibility woven in; then transition line. Include [B‑ROLL:] and [ON‑SCREEN:] cues.
- MIDDLE BRICKS; at least 3 points; each point contains;
  a) Transition stating why it matters to the viewer; 
  b) EXAMPLE BRICK using one tool; Story; Metaphor; or Framework; follow Who; Problem; Why; Conflict; Payoff; 
  c) APPLICATION BRICK; 3–5 numbered steps. Include [B‑ROLL:] and [ON‑SCREEN:] per beat.
- END BRICK; do not summarize; set up a new problem that the next video solves; add explicit end screen prompt.
Quality gates; short sentences; avoid jargon; show; do not tell.`,
      variables: ['runtimeMinutes']
    },
    {
      id: 'bens-framework',
      name: 'BENS Framework',
      description: 'Big, Easy, New, Safe criteria for content',
      editable: true,
      content: `Apply BENS scoring for all titles and concepts:
- BIG: Does it promise a significant transformation or result?
- EASY: Is it presented as achievable without overwhelming effort?
- NEW: Does it offer a fresh angle or updated information?
- SAFE: Does it feel risk-free or reversible to try?

Each element should score TRUE for maximum effectiveness.`,
      variables: []
    },
    {
      id: 'intro-template',
      name: 'Intro Template',
      description: 'Template for video introductions',
      editable: true,
      content: `[HOOK - 5 seconds]
{{hook}}

[PROBLEM/RESULT - 10 seconds]
{{problemStatement}}

[VALUE SETUP - 10 seconds]
In this video, you'll discover:
• {{valueProp1}}
• {{valueProp2}}
• {{valueProp3}}

[CREDIBILITY - 5 seconds]
{{credibilityStatement}}

[TRANSITION]
Let's dive into {{transitionPoint}}.`,
      variables: ['hook', 'problemStatement', 'valueProp1', 'valueProp2', 'valueProp3', 'credibilityStatement', 'transitionPoint']
    },
    {
      id: 'middle-brick-template',
      name: 'Middle Brick Template',
      description: 'Template for main content sections',
      editable: true,
      content: `[POINT {{pointNumber}}]

[TRANSITION]
{{transitionStatement}}

[EXAMPLE BRICK]
{{exampleType}}: {{exampleContent}}
- Who: {{who}}
- Problem: {{problem}}
- Why: {{why}}
- Conflict: {{conflict}}
- Payoff: {{payoff}}

[APPLICATION BRICK]
Here's how to apply this:
1. {{step1}}
2. {{step2}}
3. {{step3}}
{{additionalSteps}}

[B-ROLL: {{brollSuggestions}}]
[ON-SCREEN: {{onscreenText}}]`,
      variables: ['pointNumber', 'transitionStatement', 'exampleType', 'exampleContent', 'who', 'problem', 'why', 'conflict', 'payoff', 'step1', 'step2', 'step3', 'additionalSteps', 'brollSuggestions', 'onscreenText']
    },
    {
      id: 'end-template',
      name: 'End Template',
      description: 'Template for video endings',
      editable: true,
      content: `[SETUP NEXT PROBLEM]
Now that you understand {{currentTopic}}, you might be wondering about {{nextProblem}}.

[END SCREEN PROMPT]
Watch this video next where I show you {{nextVideoTopic}}.

[FINAL CTA]
{{callToAction}}`,
      variables: ['currentTopic', 'nextProblem', 'nextVideoTopic', 'callToAction']
    },
    {
      id: 'word-count-target',
      name: 'Word Count Settings',
      description: 'Target word count for scripts',
      editable: true,
      content: `Minimum words: 1200
Maximum words: 1500
Target words: 1400
Words per minute: 140-160`,
      variables: []
    }
  ]
};

// Storage functions for user-modified prompts
export class PromptManager {
  private static STORAGE_KEY = 'copper_reels_ytgs_prompts';

  static async saveUserPrompt(template: YTGSPromptTemplate, userId: string): Promise<void> {
    template.userId = userId;
    template.lastModified = new Date();
    
    const stored = localStorage.getItem(this.STORAGE_KEY) || '{}';
    const prompts = JSON.parse(stored);
    prompts[userId] = template;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prompts));
  }

  static async getUserPrompt(userId: string): Promise<YTGSPromptTemplate | null> {
    const stored = localStorage.getItem(this.STORAGE_KEY) || '{}';
    const prompts = JSON.parse(stored);
    return prompts[userId] || null;
  }

  static async resetToDefault(userId: string): Promise<void> {
    const stored = localStorage.getItem(this.STORAGE_KEY) || '{}';
    const prompts = JSON.parse(stored);
    delete prompts[userId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prompts));
  }

  static compilePrompt(template: YTGSPromptTemplate, variables: Record<string, string>): string {
    let compiledPrompt = '';
    
    for (const section of template.sections) {
      let sectionContent = section.content;
      
      // Replace variables
      if (section.variables) {
        for (const variable of section.variables) {
          const value = variables[variable] || `{{${variable}}}`;
          sectionContent = sectionContent.replace(new RegExp(`{{${variable}}}`, 'g'), value);
        }
      }
      
      compiledPrompt += `\n\n### ${section.name}\n${sectionContent}`;
    }
    
    return compiledPrompt.trim();
  }

  static extractVariables(template: YTGSPromptTemplate): string[] {
    const allVariables = new Set<string>();
    
    for (const section of template.sections) {
      if (section.variables) {
        section.variables.forEach(v => allVariables.add(v));
      }
    }
    
    return Array.from(allVariables);
  }
}