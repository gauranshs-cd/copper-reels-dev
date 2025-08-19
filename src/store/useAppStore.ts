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

interface AppState {
  // Navigation
  currentStep: 'onboarding' | 'foundation' | 'ideation' | 'plan';
  
  // Data
  umbrellaStatement: string;
  foundationData: FoundationData | null;
  selectedIdea: IdeaCard | null;
  videoPlan: VideoPlan | null;
  
  // UI State
  isLoading: boolean;
  loadingMessage: string;
  
  // Admin Features
  customPrompts: Record<string, string>;
  
  // Actions
  setCurrentStep: (step: AppState['currentStep']) => void;
  setUmbrellaStatement: (statement: string) => void;
  setFoundationData: (data: FoundationData) => void;
  setSelectedIdea: (idea: IdeaCard) => void;
  setVideoPlan: (plan: VideoPlan) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setCustomPrompt: (type: string, prompt: string) => void;
  resetStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'onboarding',
      umbrellaStatement: '',
      foundationData: null,
      selectedIdea: null,
      videoPlan: null,
      isLoading: false,
      loadingMessage: '',
      customPrompts: {},
      
      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      setUmbrellaStatement: (statement) => set({ umbrellaStatement: statement }),
      setFoundationData: (data) => set({ foundationData: data }),
      setSelectedIdea: (idea) => set({ selectedIdea: idea }),
      setVideoPlan: (plan) => set({ videoPlan: plan }),
      setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),
      setCustomPrompt: (type, prompt) => set((state) => ({
        customPrompts: { ...state.customPrompts, [type]: prompt }
      })),
      resetStore: () => set({
        currentStep: 'onboarding',
        umbrellaStatement: '',
        foundationData: null,
        selectedIdea: null,
        videoPlan: null,
        isLoading: false,
        loadingMessage: '',
        customPrompts: {}
      })
    }),
    {
      name: 'copper-reels-storage',
      partialize: (state) => ({
        umbrellaStatement: state.umbrellaStatement,
        foundationData: state.foundationData,
        selectedIdea: state.selectedIdea,
        videoPlan: state.videoPlan
      })
    }
  )
);