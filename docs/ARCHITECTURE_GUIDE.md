# Copper Reels Architecture & Data Flow Guide

## Table of Contents
1. [Overview](#overview)
2. [Application Architecture](#application-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [State Management](#state-management)
5. [User Preferences & Persistence](#user-preferences--persistence)
6. [API Integration](#api-integration)
7. [Component Hierarchy](#component-hierarchy)

## Overview

Copper Reels is a React-based YouTube content creation platform that helps creators generate viral content using AI. The application follows a modern client-server architecture with real-time data synchronization.

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├───────────────┬───────────────┬─────────────────────────────┤
│   UI Layer    │  State Layer  │      Service Layer          │
│               │               │                             │
│  Components   │   Zustand     │   API Clients               │
│  - Pages      │   Store       │   - Supabase Client         │
│  - Widgets    │               │   - Gemini AI Client        │
│  - Forms      │   Context     │   - Storage Service         │
│               │   Providers   │                             │
└───────────────┴───────────────┴─────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │         Network Layer               │
        │    (HTTP/WebSocket Connections)     │
        └─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
├─────────────────────┬────────────────────────────────────────┤
│    Supabase        │         External APIs                   │
│  - PostgreSQL      │      - Google Gemini AI                 │
│  - Auth Service    │      - YouTube Data API                 │
│  - Realtime        │      - Analytics Services               │
│  - Storage         │                                         │
└────────────────────┴────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Authentication Flow

```
User Login/Signup
      │
      ▼
┌─────────────┐
│  Auth Page  │
└─────────────┘
      │
      ├──── Email/Password ────┐
      │                        ▼
      │               ┌──────────────────┐
      │               │ Supabase Auth   │
      │               └──────────────────┘
      │                        │
      │                        ├─── Success ──→ Store User Session
      │                        │                       │
      │                        └─── Error ────→ Show Error Message
      │                                               │
      ▼                                               ▼
┌──────────────┐                            ┌──────────────────┐
│ Onboarding   │◄────────────────────────────│   Dashboard      │
└──────────────┘                            └──────────────────┘
```

### 2. Content Generation Flow

```
User Input (Idea/Topic)
         │
         ▼
┌──────────────────┐
│  Chat Interface  │
└──────────────────┘
         │
         ├──── Parse Intent
         │        │
         ▼        ▼
   Foundation   Ideas/Scripts/Thumbnails
      Check           │
         │            ▼
         │     ┌──────────────────┐
         │     │  Gemini AI API   │
         │     └──────────────────┘
         │            │
         │            ├──── Generate Content
         │            │
         ▼            ▼
┌──────────────────────────────┐
│   Store in Zustand State     │
│   - currentIdea               │
│   - generatedScript           │
│   - thumbnailConcepts         │
└──────────────────────────────┘
         │
         ├──── Save to Database
         │
         ▼
┌──────────────────────────────┐
│     Supabase Database         │
│   Tables:                     │
│   - channels                  │
│   - video_ideas               │
│   - scripts                   │
│   - thumbnails                │
└──────────────────────────────┘
```

### 3. Foundation Setup Flow

```
New User
    │
    ▼
┌─────────────────────┐
│ Foundation Builder  │
└─────────────────────┘
    │
    ├── Step 1: Channel Info
    │   └── Name, Niche, Goals
    │
    ├── Step 2: Umbrella Statement
    │   └── "I help [audience] achieve [result]"
    │
    ├── Step 3: Audience Avatar
    │   └── Demographics, Psychographics
    │
    ├── Step 4: Content Pillars
    │   └── Main topics/themes
    │
    ▼
┌─────────────────────┐
│  Validate & Store   │
└─────────────────────┘
    │
    ├── Local State (Zustand)
    │   └── useAppStore.setFoundationData()
    │
    └── Database (Supabase)
        └── channels, audience_avatars, pillars tables
```

## State Management

### Zustand Store Structure

```javascript
useAppStore = {
  // User Data
  user: {
    id: string,
    email: string,
    profile: {...}
  },
  
  // Foundation Data
  foundationData: {
    channelName: string,
    umbrellaStatement: string,
    audience: {
      demographics: {...},
      psychographics: {...}
    },
    pillars: [...]
  },
  
  // Content Generation
  currentIdea: {
    title: string,
    concept: string,
    hooks: [...]
  },
  
  generatedScript: {
    bricks: [...],
    totalDuration: number,
    wordCount: number
  },
  
  // UI State
  isLoading: boolean,
  activeTab: string,
  sidebarOpen: boolean,
  
  // Actions
  setUser: (user) => set({ user }),
  setFoundationData: (data) => set({ foundationData: data }),
  generateIdea: async (topic) => {...},
  saveScript: async (script) => {...}
}
```

### Data Persistence Strategy

```
┌──────────────────────────────────────────────┐
│           User Preferences Storage           │
├──────────────────────────────────────────────┤
│                                              │
│  1. Critical Data (Database)                │
│     - User profile                          │
│     - Channel settings                      │
│     - Generated content                     │
│     - Team memberships                      │
│                                              │
│  2. Session Data (Zustand)                  │
│     - Current working state                 │
│     - UI preferences                        │
│     - Temporary selections                  │
│                                              │
│  3. Local Storage                           │
│     - Theme preference                      │
│     - Layout settings                       │
│     - Recent searches                       │
│     - Draft content                         │
│                                              │
│  4. Cookies                                 │
│     - Authentication tokens                 │
│     - Session identifiers                   │
│                                              │
└──────────────────────────────────────────────┘
```

## API Integration

### Service Layer Architecture

```
Frontend Components
        │
        ▼
┌─────────────────────────┐
│   Service Abstraction   │
├─────────────────────────┤
│  - authService          │
│  - contentService       │
│  - aiService            │
│  - storageService       │
└─────────────────────────┘
        │
        ├──── API Calls
        │
        ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│    Supabase Client      │     │    Gemini AI Client     │
├─────────────────────────┤     ├─────────────────────────┤
│  - Authentication       │     │  - Text Generation      │
│  - Database CRUD        │     │  - Content Analysis     │
│  - Real-time Updates    │     │  - Prompt Processing    │
│  - File Storage         │     │                         │
└─────────────────────────┘     └─────────────────────────┘
```

## Component Hierarchy

```
App.tsx
│
├── AuthProvider (Context)
│   │
│   ├── Public Routes
│   │   ├── Landing Page
│   │   ├── Auth Page
│   │   └── About/Services
│   │
│   └── Protected Routes
│       ├── Dashboard
│       ├── Foundation Builder
│       ├── Chat Interface (AI Studio)
│       ├── Ideation
│       ├── Script Builder
│       ├── Pattern Bank
│       └── Settings
│
├── AppHeader (Navigation)
│   ├── Logo
│   ├── Nav Menu
│   └── User Menu
│
├── HistorySidebar
│   └── Recent Activities
│
└── Footer
```

## Best Practices for User Preferences

### 1. **Hierarchical Storage**
```
Immediate (Memory) → Session (Zustand) → Persistent (Database)
```

### 2. **Sync Strategy**
- **Optimistic Updates**: Update UI immediately, sync with backend
- **Debouncing**: Batch preference updates to reduce API calls
- **Conflict Resolution**: Server state takes precedence

### 3. **Preference Categories**

| Category | Storage Location | Sync Frequency |
|----------|-----------------|----------------|
| UI Theme | LocalStorage | On Change |
| Content Filters | Zustand + DB | Debounced (500ms) |
| AI Settings | Database | On Save |
| Team Preferences | Database | Real-time |
| Draft Content | LocalStorage + DB | Auto-save (30s) |

### 4. **Team Implementation Considerations**

```
Team Structure:
│
├── Team
│   ├── ID
│   ├── Name
│   ├── Owner
│   └── Settings
│
├── Members
│   ├── User ID
│   ├── Role (Owner/Admin/Editor/Viewer)
│   ├── Permissions
│   └── Join Date
│
└── Shared Resources
    ├── Channel Settings
    ├── Content Library
    ├── Brand Assets
    └── Analytics
```

## Data Security & Privacy

```
┌──────────────────────────────────────────────┐
│           Security Layers                     │
├──────────────────────────────────────────────┤
│                                              │
│  1. Authentication                           │
│     └── Supabase Auth (JWT tokens)          │
│                                              │
│  2. Authorization                            │
│     └── Row Level Security (RLS)            │
│                                              │
│  3. Data Encryption                          │
│     ├── In Transit (HTTPS/WSS)              │
│     └── At Rest (Database encryption)       │
│                                              │
│  4. API Security                             │
│     ├── Rate Limiting                       │
│     ├── CORS Policy                         │
│     └── API Key Management                  │
│                                              │
└──────────────────────────────────────────────┘
```

## Performance Optimization

### Caching Strategy
```
1. Browser Cache
   └── Static Assets (Images, CSS, JS)

2. Application Cache
   ├── API Responses (React Query)
   ├── Computed Values (useMemo)
   └── Component State (React.memo)

3. Database Cache
   └── Materialized Views for Analytics
```

### Code Splitting
```
- Route-based splitting (React.lazy)
- Component lazy loading
- Dynamic imports for heavy libraries
```

## Future Enhancements

1. **WebSocket Integration** for real-time collaboration
2. **Offline Mode** with service workers
3. **GraphQL** for efficient data fetching
4. **Microservices** for scalability
5. **Redis Cache** for session management

---

## Summary

The Copper Reels architecture follows modern web development best practices:
- **Separation of Concerns**: Clear boundaries between UI, State, and Data layers
- **Scalability**: Modular design allows for easy feature additions
- **Performance**: Optimized caching and lazy loading strategies
- **Security**: Multi-layered security approach
- **User Experience**: Real-time updates and optimistic UI patterns

This architecture ensures a robust, scalable, and maintainable application that can grow with user needs.