# Copper Reels Design Guidelines

## Color Palette

### Primary Colors
- **Primary Green**: `#4CAF84` - Main brand color
- **Primary Blue**: `#29B6F6` - Secondary brand color
- **Primary Purple**: `#8B5CF6` - Accent color for special features

### Gradient Colors
- **Primary Gradient**: `from-[#4CAF84] to-[#29B6F6]`
- **Purple Gradient**: `from-purple-600 to-pink-600`

## Button Hierarchy

### Primary Action Buttons (CTAs)
- **Style**: `bg-gradient-primary` or solid primary color
- **Usage**: Main calls-to-action like "Get Started", "Start Creating Now", "Generate Ideas"
- **Color**: Primary gradient (`from-[#4CAF84] to-[#29B6F6]`)
- **Hover**: Add shadow-glow effect

### Secondary Action Buttons
- **Style**: `variant="secondary"`
- **Usage**: Secondary actions like "Learn More", "View Demo"
- **Color**: Muted background with primary text

### Ghost Buttons
- **Style**: `variant="ghost"`
- **Usage**: Tertiary actions, navigation items
- **Color**: Transparent background with text color

### Outline Buttons
- **Style**: `variant="outline"`
- **Usage**: Alternative actions, form controls
- **Color**: Border with transparent background

## Typography

### Headings
- **H1**: 5xl-6xl, bold, used for hero sections
- **H2**: 3xl-4xl, bold, section headers
- **H3**: xl-2xl, semibold, subsection headers
- **H4**: lg-xl, semibold, card headers

### Case Conventions
- **Titles**: Title Case for main headings
- **Sentences**: Sentence case for descriptions and body text
- **CTAs**: Title Case for button text (e.g., "Get Started", "Learn More")

## Spacing

### Navigation
- **Logo to Nav**: 8 spacing units (`ml-8`)
- **Between Nav Items**: 2 spacing units (`gap-2`)
- **Header Height**: 16 units (`h-16`)

## Icons

### Feature Icons
- **Foundation**: Lightbulb
- **Ideas**: FileText
- **Publish & Grow**: Rocket
- **Scale & Optimize**: TrendingUp

## Consistency Rules

1. **Primary CTAs** should always use the primary gradient
2. **Navigation** should maintain consistent spacing regardless of login state
3. **Forms** should include visual feedback (eye icons for passwords)
4. **Logos** should be clickable and navigate to home
5. **Sections** should not duplicate content unnecessarily