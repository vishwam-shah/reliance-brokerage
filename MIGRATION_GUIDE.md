# Next.js 16 Migration Guide

## Project Structure

This project has been converted from static HTML to a modern Next.js 16 application with TypeScript and a component-based architecture.

### Directory Structure

```
src/
├── app/                          # Next.js App Router (pages & layouts)
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles & design system
│   ├── sign-in/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── listings/
│   │   └── page.tsx
│   ├── valuations/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── how-it-works/
│   │   └── page.tsx
│   ├── legal-hub/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   └── FormInput.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   │
│   └── sections/                 # Page section components
│       ├── HeroSection.tsx
│       ├── KPISection.tsx
│       ├── ProcessSection.tsx
│       ├── ValuesSection.tsx
│       └── CTASection.tsx
│
├── hooks/                        # Custom React hooks
│   └── useLanguage.ts           # Language switching hook
│
├── types/                        # TypeScript type definitions
│   └── index.ts
│
├── data/                         # Static data
│   └── translations.json        # i18n translations
│
└── lib/                          # Utility functions
```

## Design System

The design system is fully integrated using:

- **Tailwind CSS** - For utility-first styling
- **CSS-in-JS** - Global styles in `src/app/globals.css`
- **Design Tokens** - Defined in `tailwind.config.js`

### Design Tokens

All design tokens from the original CSS are now available as Tailwind utilities:

```typescript
// Colors
text-primary, bg-primary, text-on-primary
text-surface, bg-surface, text-on-surface
text-accent, bg-accent, text-on-accent

// Typography
font-headline, font-body, font-label
text-display-lg, text-headline-sm, text-body-md, text-label-xs

// Spacing
p-4, m-8, gap-6 (uses token system)

// Shadows
shadow-ambient, shadow-modal, shadow-card
```

## Key Features

### 1. Component-Based Architecture

- **UI Components** - Reusable, isolated components (Button, FormInput)
- **Layout Components** - Navigation, Footer
- **Section Components** - Page sections (HeroSection, KPISection, etc.)
- **Page Components** - Full pages using the App Router

### 2. Language Switching

The `useLanguage` hook provides:
- Multi-language support (English, Chinese)
- LocalStorage persistence
- Cross-tab synchronization

```typescript
const { currentLang, switchLanguage, translate: t } = useLanguage();

// Use translations
t('nav.listings')  // Returns translated text
switchLanguage('zh') // Switch language
```

### 3. Form Validation

Built-in form validation with:
- Error state management
- Custom error messages
- Accessibility features (aria-invalid, aria-describedby)

```typescript
<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

### 4. Responsive Design

All pages are fully responsive using Tailwind's breakpoints:
- Mobile-first approach
- Tailwind classes for responsive design
- Proper viewport meta tags

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

1. **Add New Pages**: Create new folders in `src/app/` with a `page.tsx` file
2. **Create Components**: Add to `src/components/` organized by type
3. **Add Translations**: Update `src/data/translations.json`
4. **Custom Hooks**: Create in `src/hooks/`

## Styling Guidelines

### Using Tailwind Classes

```typescript
// Standard classes
<div className="flex gap-4 p-8 bg-surface text-on-surface">

// Design system tokens
<button className="btn btn-primary btn-lg">
<div className="stat-card">
<h1 className="display-hero">
```

### Custom Styles

If you need custom styles:
1. Add to `src/app/globals.css` in the `@layer` directive
2. Or use component-specific Tailwind classes

## Migration from HTML

### What Was Changed

1. **Static HTML** → **Dynamic React Components**
2. **Vanilla JS** → **React Hooks** (useLanguage)
3. **CSS + Tailwind CDN** → **Tailwind + PostCSS**
4. **Browser LocalStorage** → **React State + LocalStorage Hook**

### Performance Optimizations

- Next.js image optimization
- Code splitting
- CSS optimization
- Static generation where possible
- Metadata for SEO

## TypeScript

This project uses strict TypeScript. All files use `.ts` or `.tsx` extensions.

### Common Type Patterns

```typescript
// Component Props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Form Data
interface FormData {
  email: string;
  password: string;
}
```

## Best Practices

### Component Organization

✅ **Good**
```typescript
// Organized, focused component
const Button = ({ variant, size, children }: ButtonProps) => {
  return <button className={`btn btn-${variant}`}>{children}</button>;
};
```

❌ **Avoid**
```typescript
// Too much logic, mixing concerns
const ComplexComponent = () => {
  // API calls, state management, rendering all mixed
};
```

### State Management

- Use `useState` for local component state
- Use context/hooks for global state (language, user)
- Avoid prop drilling with custom hooks

### Performance

- Use `'use client'` directive only when needed
- Prefer server components when possible
- Memoize expensive computations
- Lazy load images with Next.js Image

## Deployment

### Building for Production

```bash
npm run build
```

### Environment Variables

Create a `.env.local` file for development:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Deployment Platforms

This project works with:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting

## Troubleshooting

### Page Not Loading

1. Check file is in `src/app/` with correct structure
2. Ensure `page.tsx` exists in the route directory
3. Verify imports are correct

### Styling Not Applying

1. Check Tailwind classes are spelled correctly
2. Verify `src/app/globals.css` is imported
3. Restart dev server

### Language Not Switching

1. Check translations.json has all keys
2. Verify `useLanguage` hook is called
3. Check browser's localStorage is enabled

## Next Steps

### Additional Features to Consider

1. **API Routes** - Create `src/app/api/` routes for backend
2. **Database Integration** - Add database client (Prisma, etc.)
3. **Authentication** - Implement with NextAuth.js or similar
4. **Testing** - Add Jest, React Testing Library
5. **Analytics** - Integrate analytics tracking

### Maintenance

- Keep Next.js and dependencies updated
- Monitor performance with Web Vitals
- Add E2E tests with Playwright
- Document any custom patterns

## Support

For questions about:
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
