import { toast } from 'sonner';

// Thumbnail generation service using various image APIs
// You can integrate with DALL-E, Midjourney, Stable Diffusion, or other services

interface ThumbnailOptions {
  prompt: string;
  style?: 'photorealistic' | 'illustration' | 'cartoon' | 'artistic';
  aspectRatio?: '16:9' | '4:3' | '1:1';
  quality?: 'standard' | 'hd';
}

// Using Unsplash API for real images (free tier available)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'demo';

// Using Pexels API as fallback (free tier available)
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || 'demo';

export async function generateRealThumbnail(options: ThumbnailOptions): Promise<string> {
  try {
    // Option 1: Try Unsplash API (real stock photos)
    if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'demo') {
      try {
        const query = encodeURIComponent(options.prompt.slice(0, 100));
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            // Return high-quality image URL
            return data.results[0].urls.regular || data.results[0].urls.full;
          }
        }
      } catch (error) {
        console.error('Unsplash API error:', error);
      }
    }

    // Option 2: Try Pexels API (also free)
    if (PEXELS_API_KEY && PEXELS_API_KEY !== 'demo') {
      try {
        const query = encodeURIComponent(options.prompt.slice(0, 100));
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
          {
            headers: {
              'Authorization': PEXELS_API_KEY
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large || data.photos[0].src.original;
          }
        }
      } catch (error) {
        console.error('Pexels API error:', error);
      }
    }

    // Option 3: Use AI image generation service (requires API key)
    // Uncomment and configure based on your preferred service

    // DALL-E 3 Integration (OpenAI)
    /*
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: options.prompt,
          size: '1792x1024',
          quality: options.quality || 'standard',
          n: 1
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data[0].url;
      }
    }
    */

    // Stable Diffusion API (Stability AI)
    /*
    if (import.meta.env.VITE_STABILITY_API_KEY) {
      const response = await fetch(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text_prompts: [{ text: options.prompt, weight: 1 }],
            cfg_scale: 7,
            height: 720,
            width: 1280,
            samples: 1,
            steps: 30
          })
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return `data:image/png;base64,${data.artifacts[0].base64}`;
      }
    }
    */

    // Option 4: Use Picsum for demo/placeholder (always works)
    const promptText = options.prompt || 'default';
    const seed = promptText.split('').reduce((a, b) => {
      return a + b.charCodeAt(0);
    }, 0);
    
    return `https://picsum.photos/seed/${seed}/1280/720`;
    
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    
    // Fallback to placeholder
    const seed = Math.random().toString(36).substring(7);
    return `https://picsum.photos/seed/${seed}/1280/720`;
  }
}

// Generate multiple thumbnail variations
export async function generateThumbnailVariations(
  basePrompt: string,
  count: number = 3
): Promise<string[]> {
  const variations = [
    `${basePrompt} professional style`,
    `${basePrompt} vibrant colors high contrast`,
    `${basePrompt} minimalist clean design`,
    `${basePrompt} dramatic lighting cinematic`,
    `${basePrompt} modern tech style`
  ];

  const promises = variations.slice(0, count).map(prompt =>
    generateRealThumbnail({ prompt })
  );

  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Failed to generate variations:', error);
    // Return placeholder images
    return Array.from({ length: count }, (_, i) => 
      `https://picsum.photos/seed/${Date.now() + i}/1280/720`
    );
  }
}

// Add text overlay to thumbnail (client-side)
export function addTextOverlay(
  imageUrl: string,
  text: string,
  position: 'center' | 'top' | 'bottom' = 'center'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject('Canvas context not available');
        return;
      }
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Add dark overlay for text visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      const overlayHeight = canvas.height * 0.3;
      let overlayY = 0;
      
      switch (position) {
        case 'top':
          overlayY = 0;
          break;
        case 'bottom':
          overlayY = canvas.height - overlayHeight;
          break;
        case 'center':
        default:
          overlayY = (canvas.height - overlayHeight) / 2;
      }
      
      ctx.fillRect(0, overlayY, canvas.width, overlayHeight);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = `bold ${canvas.width * 0.06}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Word wrap if needed
      const maxWidth = canvas.width * 0.8;
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Draw text lines
      const lineHeight = canvas.height * 0.08;
      const startY = overlayY + overlayHeight / 2 - (lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
      });
      
      // Convert to blob URL
      canvas.toBlob(blob => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject('Failed to create blob');
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.onerror = () => {
      reject('Failed to load image');
    };
    
    img.src = imageUrl;
  });
}