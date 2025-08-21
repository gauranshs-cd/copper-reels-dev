# Copper Reels - AI-Powered YouTube Content Creation System

## 🏗️ Project Overview

Copper Reels is a comprehensive AI-powered platform for YouTube content creators to generate high-performing video content. The system helps creators go from initial ideas to complete scripts using advanced AI and psychology-based frameworks.

## 🚀 Current Status (Latest as of August 21, 2025)

### 🔄 Recent Session Updates (Cursor Integration)
- **About Page Enhancement**: Added team story with photo gallery, company culture, and detailed founder background
- **Services Page Redesign**: Simplified pricing structure, removed complex packages, focus on pay-as-you-go model
- **Asset Integration**: Added team photos to showcase company culture and journey
- **Footer & Contact**: Consistent contact information across all pages
- **Video Editing Upsell**: Updated component for better conversion

### ✅ Recently Fixed Critical Issues
1. **Script Generation Stuck at 80%** - Fixed timeout handling and progressive completion flow
2. **Data Flow Between Planning & Script Builder** - Fixed store property mismatches
3. **Navigation Bar Visibility** - Made consistent across all pages (public & authenticated)
4. **Contact Information** - Updated to real contact details (arvind@copperreels.com)

### 🔄 User Flow (Working End-to-End)
```
Foundation → Ideation → Planning → Script Builder
     ↓            ↓         ↓           ↓
  Avatar &     Select    Structure   Generate
  Pillars      Ideas     & Plan      Scripts
```

## 📊 Architecture & Data Flow

### Core Store (Zustand + Persistence)
**Location:** `src/store/useAppStore.ts`

**Key State Properties:**
- `umbrellaStatement`: User's core content focus
- `foundationData`: Avatar, viewer type, content pillars
- `selectedIdea`: Chosen video concept from ideation
- `currentScript`: Planning data (title, thumbnail, bricks, research)
- `videoPlan`: Script structure and storyboard
- `currentIdea`, `currentThumbnail`: Additional workflow state

**Critical Fix:** The store uses `currentScript` but some components were trying to access non-existent `scriptData`. This has been fixed.

### Data Flow Between Pages

#### 1. Foundation (`/foundation`)
- **Sets:** `foundationData` (avatar, viewer type, pillars)
- **File:** `src/pages/Foundation-new.tsx`

#### 2. Ideation (`/ideation`) 
- **Reads:** `foundationData`
- **Sets:** `selectedIdea`
- **File:** `src/pages/Ideation-enhanced.tsx`

#### 3. Planning (`/plan`)
- **Reads:** `selectedIdea`, `foundationData`
- **Sets:** `currentScript` (title, thumbnail, bricks, research)
- **File:** `src/pages/VideoPlanning-enhanced.tsx`

#### 4. Script Builder (`/script-builder`)
- **Reads:** `currentScript`, `selectedIdea`
- **Generates:** Full video scripts with AI
- **File:** `src/pages/ScriptBuilder-enhanced.tsx`

## 🔧 Technical Implementation

### AI Integration
**Gemini API Integration:** `src/lib/gemini.ts`
- Script generation with psychology-based frameworks
- Title generation with CTR optimization
- Thumbnail brief creation
- Video structure planning

### Authentication & Routing
- **Auth Provider:** `src/components/auth/AuthProvider.tsx`
- **Protected Routes:** Require authentication for core features
- **Public Routes:** Home, About, Services accessible to all

### UI Components
- **Design System:** Shadcn/UI with custom Copper Reels theming
- **Animations:** Framer Motion for smooth transitions
- **Responsive:** Mobile-first design approach

## 🗂️ Key Files & Components

### Critical Production Files
```
src/
├── pages/
│   ├── ScriptBuilder-enhanced.tsx     # ACTIVE script builder (not ScriptBuilder.tsx)
│   ├── VideoPlanning-enhanced.tsx     # Planning workflow
│   ├── Ideation-enhanced.tsx          # Idea generation
│   └── Foundation-new.tsx             # Foundation setup
├── store/
│   └── useAppStore.ts                 # Global state management
├── lib/
│   └── gemini.ts                      # AI integration
└── components/
    ├── AppHeader.tsx                  # Navigation (visible on all pages)
    └── Footer.tsx                     # Contact info & links
```

### Important Notes
- **Script Builder:** The production app uses `ScriptBuilder-enhanced.tsx`, NOT `ScriptBuilder.tsx`
- **Store Properties:** Use `currentScript`, not `scriptData` (fixed in latest version)
- **Thumbnail Property:** IdeaCard uses `thumbnail`, not `thumbnailUrl`
- **Team Photos:** Located in `src/assets/team-photos/` - showcasing company culture and journey
- **Uncommitted Changes:** Several pages have pending updates (About, Services, Index-new) that need review

## 🌐 Deployment

### Environment
- **Framework:** Vite + React + TypeScript
- **Hosting:** Vercel
- **Database:** Supabase
- **AI:** Google Gemini API

### URLs
- **Production:** https://copper-flow-studio-1yas5yzrp-arvind-sarins-projects.vercel.app
- **Local Dev:** http://localhost:8080

### Commands
```bash
# Development
npm run dev

# Build
npm run build

# Deploy to Vercel
npx vercel --prod
```

## 🐛 Known Issues & Troubleshooting

### Recent Fixes Applied
1. **Script Generation Hanging:** Added 20-second timeouts and fallback templates
2. **Missing Data Between Steps:** Fixed store property mismatches (scriptData → currentScript)
3. **Navigation Consistency:** Header now visible on all pages with proper public/private filtering
4. **Property Mismatches:** Fixed IdeaCard property references

### If Script Generation Still Fails
1. Check if `selectedIdea` and `currentScript` are properly set in store
2. Verify Gemini API key is configured
3. Check browser console for timeout errors
4. Script will fall back to template structure if API fails

### If Data Flow Issues Occur
1. Check store persistence in browser localStorage
2. Verify component is reading correct store properties
3. Check for TypeScript errors in component props

## 📞 Contact & Team

### Project Details
- **Company:** Copper Reels
- **Contact:** arvind@copperreels.com
- **Phone:** +1 (800) 829-4933  
- **Address:** 4060 Spring Valley Rd, Suite 202, Farmers Branch, TX 75244

### Technical Owner
- **Arvind Sarin** - Founder, UT Austin MBA, Texas A&M MS
- **Company Background:** Copper Digital experience

## 🔄 Development Workflow

### For New Developers
1. Clone the repository
2. Run `npm install`
3. Set up environment variables (Gemini API key, Supabase config)
4. Run `npm run dev` for local development
5. Test the full user flow: Foundation → Ideation → Planning → Script Builder

### Making Changes
1. Always test the complete user flow after changes
2. Pay attention to store state management (Zustand persistence)
3. The store persists to localStorage, so clear browser storage when testing state changes
4. Use TypeScript strictly - the interfaces in the store are critical for data flow

### Debugging Data Flow
1. Check browser dev tools → Application → Local Storage → copper-reels-storage
2. Use React DevTools to inspect Zustand store state
3. Check console for any AI API errors or timeout messages

## 📈 Future Roadmap

### Immediate Priorities
1. Review and commit pending changes (About, Services, Index-new pages)
2. Test full user flow with updated pages
3. Verify team photo assets are properly displayed
4. Enhanced error handling for AI timeouts
5. Better fallback content generation
6. Improved user onboarding flow
7. Performance optimization for large scripts

### Feature Enhancements
1. Video editing integration
2. Analytics and performance tracking
3. Team collaboration features
4. Enhanced AI personalization

---

**Last Updated:** August 21, 2025
**Version:** 2.1.0 (Post Data Flow Fix)
**Status:** Production Ready ✅