// Test script generation
const testScriptGeneration = async () => {
  const apiKey = 'AIzaSyCSzrypBYgrdg0MQ9DrcttW7G2-EodiZ1g';
  
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

  const userPrompt = `Title: How to Start a YouTube Channel
ViewerType: LEARNER
Avatar (summary): Beginners wanting to start YouTube
Idea concept: Complete guide to starting a YouTube channel
Thumbnail brief (selected): N/A
Must-cover points (optional): N/A
Length target (minutes, optional): 5
Style Guide (optional): N/A
Generate the script bricks and storyboard JSON now.`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt + '\n\nUSER REQUEST:\n' + userPrompt
          }]
        }]
      })
    });

    const data = await response.json();
    console.log('Raw Gemini response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0]) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('Response text:', text);
      
      // Try to extract JSON
      let jsonStr = text;
      if (text.includes('```json')) {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }
      }
      
      const parsed = JSON.parse(jsonStr);
      console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testScriptGeneration();