import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Avatar {
  demographics: string;
  psychographics: string;
  painPoints: string;
  goals: string;
}

export interface ContentPillar {
  id: string;
  title: string;
  description: string;
  color: string;
  topics?: string[];
}

export interface FoundationData {
  avatar: Avatar;
  viewerType: 'LEARNER' | 'ENTHUSIAST' | 'EXPERT';
  viewerTypeRationale: string;
  pillars: ContentPillar[];
}

export interface IdeaCard {
  id: string;
  title: string;
  thumbnail: string;
  pillar: string;
  pillarColor: string;
  ctrScore: number;
  description: string;
  concept?: string;
  angle?: string;
  whyItWillClick?: string;
  thumbnailBrief?: string;
}

export interface VideoBrick {
  id: string;
  type: 'INTRO' | 'MIDDLE' | 'EXAMPLE' | 'APPLICATION' | 'OUTRO';
  title: string;
  content: string;
  duration: string;
  order: number;
}

export interface StoryboardFrame {
  id: string;
  brickId: string;
  thumbnail: string;
  visualNotes: string;
  brollSuggestions: string[];
}

export interface VideoPlan {
  bricks: VideoBrick[];
  storyboard: StoryboardFrame[];
  teleprompterMode: boolean;
}

// Blog Post Interfaces
export interface BlogKeyword {
  term: string;
  searchVolume: number;
  difficulty: number;
  cpc?: number;
  trend?: 'rising' | 'stable' | 'declining';
  selected?: boolean;
}

export interface BlogMetadata {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  tags: string[];
  category?: string;
}

export interface BlogSEO {
  score: number;
  keywordDensity: number;
  readabilityScore: number;
  wordCount: number;
  headingsStructure: boolean;
  internalLinks: number;
  externalLinks: number;
}

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  keywords: BlogKeyword[];
  metadata: BlogMetadata;
  seo: BlogSEO;
  status: 'draft' | 'optimizing' | 'review' | 'approved' | 'published';
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppState {
  // Navigation
  currentStep: 'onboarding' | 'foundation' | 'ideation' | 'plan';
  
  // Data
  umbrellaStatement: string;
  foundationData: FoundationData | null;
  ideas: any[] | null;
  selectedIdea: IdeaCard | null;
  videoPlan: VideoPlan | null;
  
  // Current Workflow State
  currentIdea: any | null;
  currentScript: any | null;
  currentThumbnail: any | null;
  
  // UI State
  isLoading: boolean;
  loadingMessage: string;
  
  // Admin Features
  customPrompts: Record<string, string>;
  
  // Blog Post State
  currentBlogPost: BlogPost | null;
  blogPosts: BlogPost[];
  blogKeywords: BlogKeyword[];
  selectedBlogKeyword: BlogKeyword | null;
  
  // Actions
  setCurrentStep: (step: AppState['currentStep']) => void;
  setUmbrellaStatement: (statement: string) => void;
  setFoundationData: (data: FoundationData) => void;
  setIdeas: (ideas: any[]) => void;
  setSelectedIdea: (idea: IdeaCard) => void;
  setVideoPlan: (plan: VideoPlan) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setCustomPrompt: (type: string, prompt: string) => void;
  
  // New Workflow Actions
  setCurrentIdea: (idea: any) => void;
  setCurrentScript: (script: any) => void;
  setCurrentThumbnail: (thumbnail: any) => void;
  
  // Blog Post Actions
  setCurrentBlogPost: (post: BlogPost | null) => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  setBlogKeywords: (keywords: BlogKeyword[]) => void;
  setSelectedBlogKeyword: (keyword: BlogKeyword | null) => void;
  
  resetStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'onboarding',
      umbrellaStatement: '',
      foundationData: null,
      ideas: null,
      selectedIdea: null,
      videoPlan: null,
      currentIdea: null,
      currentScript: null,
      currentThumbnail: null,
      isLoading: false,
      loadingMessage: '',
      customPrompts: {},
      currentBlogPost: null,
      blogPosts: [],
      blogKeywords: [],
      selectedBlogKeyword: null,
      
      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      setUmbrellaStatement: (statement) => set({ umbrellaStatement: statement }),
      setFoundationData: (data) => set({ foundationData: data }),
      setIdeas: (ideas) => set({ ideas: ideas }),
      setSelectedIdea: (idea) => set({ selectedIdea: idea }),
      setVideoPlan: (plan) => set({ videoPlan: plan }),
      setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),
      setCustomPrompt: (type, prompt) => set((state) => ({
        customPrompts: { ...state.customPrompts, [type]: prompt }
      })),
      
      // New Workflow Actions
      setCurrentIdea: (idea) => set({ currentIdea: idea }),
      setCurrentScript: (script) => set({ currentScript: script }),
      setCurrentThumbnail: (thumbnail) => set({ currentThumbnail: thumbnail }),
      
      // Blog Post Actions
      setCurrentBlogPost: (post) => set({ currentBlogPost: post }),
      setBlogPosts: (posts) => set({ blogPosts: posts }),
      addBlogPost: (post) => set((state) => ({ 
        blogPosts: [...state.blogPosts, post] 
      })),
      updateBlogPost: (id, updates) => set((state) => ({
        blogPosts: state.blogPosts.map(post => 
          post.id === id ? { ...post, ...updates } : post
        ),
        currentBlogPost: state.currentBlogPost?.id === id 
          ? { ...state.currentBlogPost, ...updates }
          : state.currentBlogPost
      })),
      setBlogKeywords: (keywords) => set({ blogKeywords: keywords }),
      setSelectedBlogKeyword: (keyword) => set({ selectedBlogKeyword: keyword }),
      
      resetStore: () => set({
        currentStep: 'onboarding',
        umbrellaStatement: '',
        foundationData: null,
        ideas: null,
        selectedIdea: null,
        videoPlan: null,
        currentIdea: null,
        currentScript: null,
        currentThumbnail: null,
        isLoading: false,
        loadingMessage: '',
        customPrompts: {},
        currentBlogPost: null,
        blogPosts: [],
        blogKeywords: [],
        selectedBlogKeyword: null
      })
    }),
    {
      name: 'copper-reels-storage',
      partialize: (state) => ({
        umbrellaStatement: state.umbrellaStatement,
        foundationData: state.foundationData,
        ideas: state.ideas,
        selectedIdea: state.selectedIdea,
        videoPlan: state.videoPlan,
        currentIdea: state.currentIdea,
        currentScript: state.currentScript,
        currentThumbnail: state.currentThumbnail
      })
    }
  )
);