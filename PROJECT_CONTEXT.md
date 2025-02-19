# NaijaHub Project Context

## Project Overview
NaijaHub is a modern web platform connecting Nigerians worldwide through community engagement, content sharing, and e-commerce. The platform serves as a contemporary alternative to existing Nigerian online communities.

## Technical Stack
- Frontend: React 18 with TypeScript, Vite, Shadcn/UI, Tailwind CSS
- Backend: Supabase (PostgreSQL)
- State Management: Tanstack Query
- Authentication: Supabase Auth
- Styling: Tailwind CSS with Shadcn/UI components

## Key Development Rules
1. Always check existing components before creating new ones
2. Use existing Supabase database schema
3. Follow established routing patterns
4. Maintain TypeScript type safety
5. Implement changes incrementally

## Project Structure
```typescript
src/
  ├── components/
  │   ├── ui/
  │   ├── layout/
  │   └── [category]/
  ├── pages/
  │   └── categories/
  ├── routes/
  ├── types/
  ├── lib/
  └── constants/
```

## Current Features
- User authentication
- Content categories (News, Entertainment, Fashion & Beauty, etc.)
- Post creation and management
- Comments and likes system
- Professional profiles
- Basic marketplace functionality

## Development Guidelines
1. **Component Creation**: Reuse existing components when possible
2. **Database Operations**: Use existing schema, no direct migrations
3. **Routing**: Follow established patterns, avoid duplicates
4. **Type Safety**: Maintain strict TypeScript usage
5. **Error Handling**: Implement comprehensive error management

## Current Focus Areas
1. Fashion & Beauty category features
2. Marketplace integration
3. Professional services booking
4. Business dashboard implementation

## Documentation Files
- DEVELOPMENT_PROGRESS.md: Project status tracking
- APP_SUMMARY.md: Application overview
- CODING_RULES.md: Development guidelines

## Important Conventions
1. **File Naming**:
   - Components: PascalCase
   - Utilities: camelCase
   - Pages: kebab-case

2. **Code Style**:
   - Use TypeScript strictly
   - Follow existing patterns
   - Maintain component hierarchy

3. **Git Workflow**:
   - Make atomic commits
   - Document changes
   - Follow existing branch structure

## Security Requirements
1. Implement proper authentication
2. Use Row Level Security (RLS)
3. Sanitize user inputs
4. Follow security best practices

## Performance Guidelines
1. Optimize image loading
2. Implement code splitting
3. Use proper caching strategies
4. Monitor bundle size
