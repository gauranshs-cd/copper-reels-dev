# Prompt Templates and Guidelines

## Overview
This document contains templates and guidelines for refining the AI prompts used in Copper Reels. You can experiment with these templates and update them based on your research and results.

## Current Prompt Structure

Each bot uses a consistent structure:
1. **System Prompt**: Defines the bot's role and output format
2. **Schema**: JSON schema for validation
3. **Rules**: Specific constraints and guidelines
4. **User Prompt**: The actual request with placeholders

## Prompt Optimization Tips

### 1. Be Specific About Output Format
- Always specify "Return ONLY JSON" to avoid prose
- Include exact schema requirements
- Use enums for restricted values

### 2. Provide Context
- Include relevant background information
- Reference pattern banks and style guides when available
- Pass viewer type and avatar data downstream

### 3. Set Quality Constraints
- Minimum and maximum counts (e.g., "minItems":12, "maxItems":20)
- Score ranges (0-1 for quality metrics)
- Character limits for user-facing text

## Experimental Prompt Variations

### For Better Idea Generation
Try adding these to the Idea Generator prompt:
```
Additional context to include:
- Current trending topics in the niche
- Seasonal relevance
- Competitor content gaps
- Viral potential indicators
```

### For Higher CTR Titles
Experiment with these additions:
```
Title optimization factors:
- Curiosity gap creation
- Number usage (when relevant)
- Emotional triggers
- Urgency indicators
- Contrast/paradox elements
```

### For Thumbnail Briefs
Consider these enhancements:
```
Visual psychology elements:
- Color theory for emotions
- Rule of thirds composition
- Face prominence when applicable
- Motion/direction indicators
- Contrast for mobile visibility
```

## Pattern Bank Integration

### Power Words Database
Maintain a list of high-performing words by niche:
```javascript
const powerWordsByNiche = {
  tech: ['Revolutionary', 'Hidden', 'Leaked', 'Secret', 'Breakthrough'],
  finance: ['Millionaire', 'Passive', 'Wealth', 'Rich', 'Freedom'],
  fitness: ['Transform', 'Shredded', 'Burn', 'Explosive', 'Results'],
  education: ['Master', 'Learn', 'Genius', 'Hack', 'Fast-track']
};
```

### Title Shapes That Convert
Document successful patterns:
```
1. "How I [Achieved Result] in [Timeframe]"
2. "[Number] [Things] That [Unexpected Outcome]"
3. "Why [Common Belief] is [Contradiction]"
4. "[Authority] Reveals [Secret/Method]"
5. "The [Adjective] Truth About [Topic]"
```

## Testing Framework

### A/B Testing Prompts
When testing prompt variations:

1. **Control Version**: Current prompt
2. **Test Version**: Modified prompt
3. **Metrics to Track**:
   - Generation time
   - Output quality score
   - User satisfaction
   - Downstream success (CTR, engagement)

### Quality Checklist
Before deploying prompt changes:
- [ ] Generates valid JSON 100% of the time
- [ ] Outputs match schema requirements
- [ ] Results are relevant to input
- [ ] No repetition or redundancy
- [ ] Appropriate variety in outputs
- [ ] Respects all constraints

## Prompt Versioning

### Version 1.0 (Current)
- Basic YTGS methodology
- Standard output formats
- Generic pattern matching

### Version 1.1 (Planned)
- Niche-specific optimizations
- Trend integration
- Competitive analysis features

### Version 2.0 (Future)
- Multi-language support
- Platform-specific adaptations
- Performance prediction models

## Custom Additions

### Style Guide Integration
Add these parameters to any prompt:
```javascript
styleGuide: {
  tone: ['professional', 'casual', 'humorous', 'authoritative'],
  pacing: ['fast', 'moderate', 'detailed'],
  complexity: ['beginner', 'intermediate', 'advanced'],
  personality: ['friendly', 'serious', 'energetic', 'calm']
}
```

### Inspiration Weighting
When inspirations are provided:
```javascript
inspirations.forEach(video => {
  // Weight 1-5 affects influence
  // Tags determine what aspects to borrow
  // Notes provide specific guidance
});
```

## Research Notes

### What Works
- Clear, specific instructions
- Examples within prompts
- Structured output requirements
- Temperature 0.7 for creativity with consistency

### What Doesn't Work
- Vague quality descriptors ("make it good")
- Conflicting requirements
- Too many constraints at once
- Temperature too high (>0.9) or too low (<0.3)

## Implementation Guide

To update a prompt:

1. **Locate the bot method** in `/src/lib/openai/index.ts`
2. **Modify the prompt** strings
3. **Test with various inputs**
4. **Validate output** against schema
5. **Deploy if quality improves**

## Monitoring and Feedback

Track these metrics for prompt performance:
- Token usage (cost optimization)
- Generation success rate
- User edit frequency (indicates quality)
- Downstream conversion metrics

## Next Experiments

1. **Context Length Optimization**: Find the sweet spot between context and cost
2. **Few-Shot Learning**: Add examples to prompts
3. **Chain-of-Thought**: Add reasoning steps for complex generation
4. **Prompt Compression**: Reduce tokens while maintaining quality
5. **Dynamic Temperature**: Adjust based on content type