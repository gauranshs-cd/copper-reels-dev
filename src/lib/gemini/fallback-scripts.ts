// Fallback script templates when API quota is exceeded
export const generateFallbackScript = (params: {
  chosenTitle: string;
  viewerType: string;
  ideaConcept: string;
  targetMinutes?: number;
}) => {
  const duration = (params.targetMinutes || 8) * 60;
  const introDuration = Math.min(30, duration * 0.1);
  const outroDuration = Math.min(30, duration * 0.1);
  const middleDuration = (duration - introDuration - outroDuration) / 3;

  return {
    runtimeEstimateSec: duration,
    bricks: [
      {
        type: 'INTRO',
        estimatedSec: introDuration,
        narration: `Have you ever wondered about ${params.chosenTitle}? In the next few minutes, I'm going to show you exactly how to master this, step by step. By the end of this video, you'll have everything you need to get started right away.`,
        onScreen: params.chosenTitle,
        callouts: ['Hook', 'Problem Statement', 'Value Promise'],
        broll: ['Title animation', 'Preview shots', 'Problem visualization'],
        beats: [
          'Open with strong hook',
          'State the problem clearly',
          'Promise specific value',
          'Build credibility quickly'
        ]
      },
      {
        type: 'MIDDLE',
        estimatedSec: middleDuration,
        narration: `Let's start with the fundamentals. The first thing you need to understand about ${params.ideaConcept} is that it's not as complicated as it seems. Here's the key insight that most people miss...`,
        onScreen: 'Key Point #1: Foundation',
        callouts: ['Main Concept', 'Why It Matters', 'Common Mistake'],
        broll: ['Concept visualization', 'Example demonstration', 'Comparison shots'],
        beats: [
          'Introduce main concept',
          'Explain why it matters',
          'Show common mistakes',
          'Demonstrate correct approach'
        ]
      },
      {
        type: 'EXAMPLE',
        estimatedSec: middleDuration,
        narration: `Let me show you a real example. Last month, I worked with someone who was struggling with exactly this. They thought ${params.ideaConcept} was impossible, but once they applied this simple framework, everything changed. Here's what happened...`,
        onScreen: 'Real-World Example',
        callouts: ['Before State', 'The Change', 'After State'],
        broll: ['Case study visuals', 'Before/after comparison', 'Results screenshots'],
        beats: [
          'Set up the story',
          'Introduce the problem',
          'Show the solution applied',
          'Reveal the results'
        ]
      },
      {
        type: 'APPLICATION',
        estimatedSec: middleDuration,
        narration: `Now it's your turn. Here's exactly how you can apply this: Step 1, start by identifying your specific situation. Step 2, apply the framework we just discussed. Step 3, track your results and adjust as needed. It's that simple.`,
        onScreen: 'Your Action Steps',
        callouts: ['Step 1', 'Step 2', 'Step 3', 'Quick Win'],
        broll: ['Step-by-step graphics', 'Action items list', 'Template preview'],
        beats: [
          'Break down into steps',
          'Make it actionable',
          'Provide quick win',
          'Remove friction'
        ]
      },
      {
        type: 'OUTRO',
        estimatedSec: outroDuration,
        narration: `You now have everything you need to succeed with ${params.chosenTitle}. If this helped you, hit the like button and subscribe for more content like this. Comment below with your biggest takeaway, and I'll see you in the next video where we'll dive into advanced strategies.`,
        onScreen: 'Subscribe & Like',
        callouts: ['CTA', 'Next Video Tease', 'Engagement'],
        broll: ['End screen template', 'Subscribe animation', 'Next video preview'],
        beats: [
          'Quick recap',
          'Clear call to action',
          'Tease next content',
          'End on high note'
        ]
      }
    ],
    storyboard: [
      {
        brickIndex: 0,
        frames: [
          {
            frameType: 'A_ROLL',
            shot: 'Medium shot of presenter',
            description: 'Presenter introduces topic with energy',
            onScreenText: params.chosenTitle,
            graphics: ['Lower third', 'Title card'],
            assetsToPrep: ['Intro music', 'Logo animation']
          }
        ]
      },
      {
        brickIndex: 1,
        frames: [
          {
            frameType: 'B_ROLL',
            shot: 'Screen recording or animation',
            description: 'Visual explanation of concept',
            onScreenText: 'Key Concept',
            graphics: ['Animated diagrams', 'Text overlays'],
            assetsToPrep: ['Screen recordings', 'Graphics']
          }
        ]
      }
    ],
    metadata: {
      cta: 'Subscribe for more tutorials',
      chapters: ['Introduction', 'Foundation', 'Example', 'Application', 'Conclusion'],
      seoDescription: `Learn ${params.chosenTitle} with this complete guide. Step-by-step tutorial for ${params.viewerType.toLowerCase()} viewers.`,
      tags: params.ideaConcept.split(' ').filter(w => w.length > 3)
    }
  };
};