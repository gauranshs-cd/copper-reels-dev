import patternBankData from '@/data/pattern_bank.json';

export interface PatternEntry {
  title: string;
  topic?: string;
  powerwords?: string;
  structure?: string;
  thumbnail?: string;
  format?: string;
  examples?: string;
  views?: string;
}

export interface ChannelPatterns {
  outlier_titles: string[];
  topics: string[];
  powerwords: string[];
  title_structures: string[];
  thumbnail_patterns: string[];
  formats: string[];
  example_titles: string[];
}

export interface PatternBank {
  channels: Record<string, ChannelPatterns>;
  niche_patterns: Record<string, { patterns: PatternEntry[] }>;
  adjacent_patterns: Record<string, { patterns: PatternEntry[] }>;
  metadata: {
    total_sheets: number;
    sheet_names: string[];
  };
}

class PatternBankService {
  private patterns: PatternBank;

  constructor() {
    this.patterns = patternBankData as PatternBank;
  }

  /**
   * Get all power words across all channels
   */
  getAllPowerWords(): string[] {
    const powerWords = new Set<string>();
    
    Object.values(this.patterns.channels).forEach(channel => {
      channel.powerwords.forEach(word => {
        if (word && word !== 'Powerwords/Title Patterns') {
          powerWords.add(word);
        }
      });
    });
    
    return Array.from(powerWords);
  }

  /**
   * Get all title structures
   */
  getAllTitleStructures(): string[] {
    const structures = new Set<string>();
    
    Object.values(this.patterns.channels).forEach(channel => {
      channel.title_structures.forEach(structure => {
        if (structure && structure !== 'Repeating Title Structures') {
          structures.add(structure);
        }
      });
    });
    
    return Array.from(structures);
  }

  /**
   * Get high-performing outlier titles
   */
  getOutlierTitles(limit = 10): string[] {
    const titles: string[] = [];
    
    Object.values(this.patterns.channels).forEach(channel => {
      titles.push(...channel.outlier_titles);
    });
    
    // Sort by views if available (extract from title string)
    return titles
      .filter(title => title && title.length > 0)
      .slice(0, limit);
  }

  /**
   * Get thumbnail patterns
   */
  getThumbnailPatterns(): string[] {
    const patterns = new Set<string>();
    
    Object.values(this.patterns.channels).forEach(channel => {
      channel.thumbnail_patterns.forEach(pattern => {
        if (pattern && pattern !== 'Thumbnail patterns') {
          patterns.add(pattern);
        }
      });
    });
    
    return Array.from(patterns);
  }

  /**
   * Get example titles for inspiration
   */
  getExampleTitles(limit = 20): string[] {
    const examples: string[] = [];
    
    Object.values(this.patterns.channels).forEach(channel => {
      examples.push(...channel.example_titles);
    });
    
    return examples
      .filter(title => title && title.length > 0)
      .slice(0, limit);
  }

  /**
   * Generate title suggestions based on patterns
   */
  generateTitleSuggestions(topic: string, niche?: string): string[] {
    const suggestions: string[] = [];
    const powerWords = this.getAllPowerWords();
    const structures = this.getAllTitleStructures();
    
    // Pattern 1: Number + Power Word + Topic
    const randomPowerWord = powerWords[Math.floor(Math.random() * powerWords.length)];
    suggestions.push(`${Math.floor(Math.random() * 20) + 5} ${randomPowerWord} ${topic} Tips You Need to Know`);
    
    // Pattern 2: Question format
    suggestions.push(`Why ${topic} is the ${randomPowerWord} Thing You're Not Doing`);
    
    // Pattern 3: Before/After
    suggestions.push(`${topic}: Before vs After Using These ${randomPowerWord} Tricks`);
    
    // Pattern 4: Warning/Alert
    suggestions.push(`Stop Making These ${topic} Mistakes! (${randomPowerWord} Solutions)`);
    
    // Pattern 5: Discovery
    suggestions.push(`I Discovered ${Math.floor(Math.random() * 10) + 3} ${randomPowerWord} ${topic} Hacks`);
    
    return suggestions;
  }

  /**
   * Get patterns for a specific niche
   */
  getNichePatterns(niche: string): PatternEntry[] {
    const nicheKey = Object.keys(this.patterns.niche_patterns).find(
      key => key.toLowerCase().includes(niche.toLowerCase())
    );
    
    if (nicheKey && this.patterns.niche_patterns[nicheKey]) {
      return this.patterns.niche_patterns[nicheKey].patterns;
    }
    
    return [];
  }

  /**
   * Get all available data
   */
  getAllPatterns(): PatternBank {
    return this.patterns;
  }

  /**
   * Search patterns by keyword
   */
  searchPatterns(keyword: string): {
    titles: string[];
    powerwords: string[];
    structures: string[];
  } {
    const results = {
      titles: [] as string[],
      powerwords: [] as string[],
      structures: [] as string[]
    };
    
    const lowerKeyword = keyword.toLowerCase();
    
    Object.values(this.patterns.channels).forEach(channel => {
      // Search in titles
      results.titles.push(...channel.outlier_titles.filter(
        title => title.toLowerCase().includes(lowerKeyword)
      ));
      
      // Search in powerwords
      results.powerwords.push(...channel.powerwords.filter(
        word => word.toLowerCase().includes(lowerKeyword)
      ));
      
      // Search in structures
      results.structures.push(...channel.title_structures.filter(
        structure => structure.toLowerCase().includes(lowerKeyword)
      ));
    });
    
    return results;
  }
}

// Export singleton instance
export const patternBankService = new PatternBankService();

// Export utility functions for direct use
export const getViralTitlePatterns = () => patternBankService.getOutlierTitles(20);
export const getPowerWords = () => patternBankService.getAllPowerWords();
export const getThumbnailIdeas = () => patternBankService.getThumbnailPatterns();
export const generateTitleIdeas = (topic: string) => patternBankService.generateTitleSuggestions(topic);