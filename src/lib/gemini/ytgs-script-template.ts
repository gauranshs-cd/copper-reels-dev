// YTGS-compliant script template matching the exact format requirements
export const generateYTGSScript = (params: {
  chosenTitle: string;
  viewerType: string;
  ideaConcept: string;
  avatarSummary?: string;
  targetMinutes?: number;
}) => {
  const duration = (params.targetMinutes || 8) * 60;
  
  // Generate the complete YTGS document
  const scriptDocument = {
    runtimeEstimateSec: duration,
    
    // Complete YTGS Output Format
    channelPositioning: {
      avatar: {
        demographics: params.avatarSummary || "Content creators aged 25-45; US-based; intermediate skill level",
        psychographics: "Fear of algorithm changes; want consistent views; struggle with content ideas",
        rankedProblems: [
          "1. Inconsistent video performance",
          "2. Running out of content ideas",
          "3. Time investment vs results"
        ]
      },
      umbrellaStatement: `I help ${params.viewerType.toLowerCase()} viewers master ${params.ideaConcept}`,
      validation: "Proven system; 500+ successful implementations; unique framework approach",
      reasoningSteps: [
        "Avatar fears align with solution promise",
        "Problems ranked by urgency and solvability",
        "Umbrella creates clear transformation path"
      ]
    },
    
    researchAndPatternBank: {
      outlierTopics: [
        `${params.chosenTitle} - High CTR due to specificity`,
        "Common mistakes version - Negative angle performs",
        "Quick wins version - Instant gratification hook"
      ],
      patternBank: {
        powerWords: ["Secret", "Mistake", "Never", "Finally", "Proven", "System"],
        titleShapes: ["How I [Result] in [Time]", "[Number] [Thing] That [Outcome]", "Why [Belief] is [Truth]"],
        thumbnailMotifs: ["Before/after split", "Shocked expression", "Big text overlay"]
      },
      trafficSourceFit: "Search: problem-aware; Homepage: curiosity gap; Suggested: similar content",
      reasoningSteps: [
        "Patterns extracted from top 10% performers",
        "Power words trigger emotional response",
        "Traffic source alignment maximizes reach"
      ]
    },
    
    // The actual script in YTGS brick format
    bricks: [
      {
        type: 'INTRO',
        estimatedSec: 30,
        narration: `${params.chosenTitle.includes('mistake') ? 'Stop.' : 'Listen.'} 
          ${params.viewerType === 'LEARNER' ? 'If you\'re struggling with' : 'You already know'} ${params.ideaConcept.split(' ').slice(0, 5).join(' ')}.
          ${params.viewerType === 'LEARNER' ? 'You\'re not alone' : 'But there\'s more'}.
          In the next ${Math.floor(duration/60)} minutes; I\'ll show you the exact system that changed everything.
          Three specific things you\'ll discover: First; the hidden pattern nobody talks about.
          Second; why conventional advice fails. Third; your personalized action plan.
          Let\'s dive into the first breakthrough.`,
        onScreen: params.chosenTitle,
        callouts: ['HOOK', 'PROBLEM', 'VALUE PROMISE', 'TRANSITION'],
        broll: ['Title card animation', 'Problem visualization', 'Results preview'],
        beats: [
          '[B-ROLL: Hook visual - pattern interrupt]',
          '[ON-SCREEN: Title text overlay]',
          '[B-ROLL: Problem visualization]',
          '[ON-SCREEN: 3 bullet points appear]'
        ]
      },
      {
        type: 'MIDDLE',
        estimatedSec: 120,
        narration: `Here\'s why this matters to you right now.
          Most people approach ${params.ideaConcept} completely wrong.
          They follow outdated advice from 2019.
          
          [TRANSITION] Let me show you what actually works.
          
          [EXAMPLE - Story Format]
          Last month; Sarah came to me. [WHO]
          She\'d been creating content for 18 months with no growth. [PROBLEM]
          Her videos were good; but the algorithm ignored them. [WHY]
          She tried everything; courses; tools; strategies. Nothing worked. [CONFLICT]
          Then she applied this one framework. 47% view increase in 14 days. [PAYOFF]
          
          [TRANSITION TO APPLICATION]
          Here\'s exactly how you can do the same.`,
        onScreen: 'The Hidden Pattern',
        callouts: ['TRANSITION', 'STORY SETUP', 'CONFLICT', 'PAYOFF'],
        broll: ['Chart showing growth', 'Before/after comparison', 'Framework diagram'],
        beats: [
          '[B-ROLL: Statistics visualization]',
          '[ON-SCREEN: "Common Mistake #1"]',
          '[B-ROLL: Sarah\'s channel screenshots]',
          '[ON-SCREEN: Growth chart animation]',
          '[B-ROLL: Framework diagram]'
        ]
      },
      {
        type: 'APPLICATION',
        estimatedSec: 150,
        narration: `Now; your turn. Here are your three action steps.
          
          Step one; audit your current approach.
          Open your analytics right now.
          Look for these three patterns: [specifics based on topic].
          
          Step two; implement the framework.
          Start with one video as a test.
          Apply these exact elements: [framework components].
          Document everything.
          
          Step three; optimize based on data.
          After 48 hours; check these metrics.
          Adjust only what\'s not working.
          Scale what is.
          
          This works because it aligns with how the algorithm actually functions.
          Not theory; proven results.`,
        onScreen: 'Your Action Plan',
        callouts: ['STEP 1', 'STEP 2', 'STEP 3', 'REASONING'],
        broll: ['Screen recording of process', 'Template preview', 'Results dashboard'],
        beats: [
          '[B-ROLL: Screen recording - analytics]',
          '[ON-SCREEN: Step 1 checklist]',
          '[B-ROLL: Implementation demo]',
          '[ON-SCREEN: Framework template]',
          '[B-ROLL: Results dashboard]',
          '[ON-SCREEN: Success metrics]'
        ]
      },
      {
        type: 'MIDDLE',
        estimatedSec: 120,
        narration: `But there\'s a second layer most people miss.
          
          [TRANSITION] This changes everything about retention.
          
          [EXAMPLE - Metaphor Format]
          Think of your content like a restaurant.
          You can have amazing food; but if the menu is confusing; people leave.
          Your thumbnail and title are the menu.
          Your intro is the appetizer.
          Your middle section is the main course.
          
          Most creators serve dessert first; then wonder why people leave.
          The order matters more than the ingredients.
          
          [TRANSITION TO APPLICATION]
          Let me show you the optimal sequence.`,
        onScreen: 'The Retention Secret',
        callouts: ['METAPHOR SETUP', 'INSIGHT', 'APPLICATION TEASE'],
        broll: ['Restaurant analogy visuals', 'Retention graph', 'Sequence diagram'],
        beats: [
          '[B-ROLL: Restaurant menu visual]',
          '[ON-SCREEN: Retention graph overlay]',
          '[B-ROLL: Content structure diagram]',
          '[ON-SCREEN: "Optimal Sequence"]'
        ]
      },
      {
        type: 'OUTRO',
        estimatedSec: 30,
        narration: `You now have the complete system.
          But implementation is where most fail.
          
          Next video; I\'ll show you the automation that saves 5 hours per week.
          It\'s the tool nobody talks about.
          
          If this helped; like and subscribe.
          Comment your biggest takeaway below.
          
          Your next video is on the right.
          It shows the advanced version of what we just covered.
          Click it now.`,
        onScreen: 'Next Steps',
        callouts: ['NEXT PROBLEM SETUP', 'CTA', 'END SCREEN'],
        broll: ['Next video preview', 'Subscribe animation', 'End screen template'],
        beats: [
          '[B-ROLL: Next video teaser]',
          '[ON-SCREEN: Subscribe button highlight]',
          '[B-ROLL: End screen with two videos]',
          '[ON-SCREEN: Arrow pointing to next video]'
        ]
      }
    ],
    
    // Metadata for complete YTGS compliance
    metadata: {
      titlesAndThumbnails: {
        titles: [
          {
            text: params.chosenTitle.substring(0, 50),
            shape: "How I [Result] in [Time]",
            bens: { B: true, E: true, N: true, S: true },
            charCount: params.chosenTitle.length
          }
        ],
        thumbnails: [
          {
            overlayText: params.chosenTitle.split(' ').slice(0, 3).join(' '),
            subject: "Presenter with shocked/excited expression",
            composition: "Rule of thirds; face on left; text on right",
            colorMood: "High contrast; complementary colors",
            whyItClicks: "Curiosity gap + emotional expression"
          }
        ]
      },
      
      optimizeAndPublish: {
        primaryGoal: "views",
        description: `Discover ${params.chosenTitle}. Learn the exact system that professionals use. Proven framework with step-by-step implementation. Watch now to transform your results.`,
        chapters: ["0:00 Intro", "0:30 Hidden Pattern", "2:30 Your Action Plan", "5:00 Retention Secret", "7:30 Next Steps"],
        tags: params.ideaConcept.split(' ').filter(w => w.length > 3).slice(0, 15)
      },
      
      longTermGrowth: "Converts problem-aware viewers to method-aware; builds authority; sets up product ladder",
      
      styleAndSafety: [
        "No medical claims",
        "No guaranteed outcomes", 
        "Results vary disclaimer",
        "Educational purpose only"
      ]
    },
    
    // Storyboard for production
    storyboard: [
      {
        brickIndex: 0,
        frames: [
          {
            frameType: 'A_ROLL',
            shot: 'Medium close-up; direct to camera',
            description: 'High energy opening; lean forward',
            onScreenText: params.chosenTitle,
            graphics: ['Lower third', 'Title animation'],
            assetsToPrep: ['Intro music sting', 'Brand colors']
          }
        ]
      }
    ]
  };
  
  return scriptDocument;
};