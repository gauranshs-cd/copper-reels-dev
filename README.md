# Copper Reels - AI-Powered YouTube Content Creation System

## 🚀 Live at copperreels.com

An advanced YouTube content creation platform powered by the YouTube Growth System (YTGS) methodology, integrating psychological frameworks from Eugene Schwartz, Robert Cialdini, Russell Brunson, and more.

## ✨ Key Features

### 1. **Advanced AI Generation** 
- **YTGS-Enhanced Prompts**: Sophisticated prompts incorporating market sophistication analysis, psychological triggers, and viral mechanics
- **Google Gemini Integration**: Fast, reliable AI generation with custom prompt support
- **Pattern Banking**: Learn from viral content patterns and apply them to your niche

### 2. **Search History (ChatGPT-style)**
- Complete history of all generated content
- Filter by type (ideas, scripts, patterns)
- One-click to revisit any previous generation
- Persistent storage in localStorage

### 3. **Custom Pattern Bank**
- Add your own viral patterns
- Categories: Titles, Thumbnails, Hooks, Power Words
- Tag and organize patterns
- Automatically integrated into AI generation

### 4. **Magic Title Generator**
- Floating button for instant title generation
- Combines Pattern Bank data with AI
- Generates 5 psychologically-optimized titles
- One-click to apply to selected ideas

### 5. **Visual Script Editor**
- Drag-and-drop script "bricks"
- YTGS methodology: Intro → Middle → Example → Application → Outro
- Editable components with live preview
- Export to text file or JSON

### 6. **Thumbnail Brief Generation**
- Visual psychology optimization
- Mobile-optimized preview
- Color mood and composition guidance
- Automatic generation for each idea

## 🛠 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **State**: Zustand with localStorage persistence
- **AI**: Google Gemini 1.5 Flash
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Animation**: Framer Motion

## 📦 Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd copper-flow-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev
```

## 🌐 Deployment Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to copperreels.com via Vercel.

## 🧠 AI Enhancement Details

### YTGS Methodology Integration
The system now incorporates:

1. **Market Sophistication Analysis** (Eugene Schwartz's 5 stages)
2. **Psychological Triggers** (Cialdini's influence principles)
3. **Value Ladder Engineering** (Russell Brunson)
4. **Narrative Transportation** (Donald Miller's StoryBrand)
5. **BENS Framework**: Big, Easy, New, Safe

### Enhanced Generation Process

#### Foundation Generation
- Deep avatar psychographics
- Pain point hierarchy
- False belief matrix
- Cognitive bias mapping

#### Idea Generation
- Pattern bank integration
- Traffic source optimization (Homepage/Search/Suggested)
- Viral mechanics employment
- BENS scoring for each idea

#### Title Generation
- Psychological trigger mapping
- Power word integration
- Pattern structure application
- CTR prediction

#### Script Generation
- YTGS Brick System
- South Park story scaffold
- Retention optimization
- Show don't tell implementation

## 🔐 Admin Features

Admin users (arvind@copperdigital.com) can:
- Edit AI prompts in real-time
- Access advanced analytics
- Manage pattern bank
- View all user generations

## 📊 Database Schema

The app uses Supabase with:
- User authentication
- Session tracking
- Generation logging
- Custom patterns storage

## 🚦 API Limits

- **Gemini Free Tier**: 50 requests/day
- **Supabase Free Tier**: 500MB database, 50,000 monthly active users

## 🐛 Troubleshooting

### DNS Issues
- Check propagation: https://dnschecker.org
- Verify Squarespace records
- Re-add domain in Vercel if needed

### API Errors
- Check API key validity
- Monitor quota usage
- Fallback to cached patterns if API fails

## 📝 License

Proprietary - Copper Digital © 2024

## 🤝 Support

For issues or questions:
- GitHub Issues: [your-repo-url]/issues
- Email: arvind@copperdigital.com

---

Built with ❤️ by Copper Digital - Transforming healthcare businesses through scientifically-proven systems
