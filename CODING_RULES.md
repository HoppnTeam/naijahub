# NaijaHub Development Rules & Guidelines

## 1. Database Management (Supabase)

### Schema Rules
- ✅ Use existing tables and relationships
- ❌ No new migrations without explicit approval
- ✅ Verify RLS policies before modifications
- ✅ Follow established naming conventions

### Data Operations
- ✅ Use type-safe Supabase queries
- ✅ Implement proper error handling
- ✅ Maintain referential integrity
- ❌ No direct database modifications

## 2. Routing Management

### Route Creation
- ✅ Check existing routes first
- ✅ Use consistent route naming patterns
- ❌ No duplicate routes
- ✅ Maintain route hierarchy

### Route Structure
```typescript
categories/
  ├── [category]/
  │   ├── index.tsx
  │   ├── create.tsx
  │   └── [id].tsx
  └── index.tsx
```

### Route Guidelines
1. Use semantic route names
2. Implement proper route guards
3. Maintain type safety in route parameters
4. Follow existing route patterns

## 3. Component Management

### Component Creation
- ✅ Reuse existing components
- ✅ Follow component directory structure
- ❌ No duplicate components
- ✅ Maintain component hierarchy

### Component Structure
```typescript
components/
  ├── ui/
  ├── layout/
  ├── features/
  └── [category]/
      ├── components/
      └── index.tsx
```

## 4. Type Safety

### TypeScript Rules
- ✅ Use strict type checking
- ✅ Define interfaces for all data structures
- ❌ No 'any' types without justification
- ✅ Maintain type documentation

### Type Guidelines
1. Export types from dedicated files
2. Use type inference where appropriate
3. Implement proper error types
4. Follow existing type patterns

## 5. State Management

### Data Fetching
- ✅ Use Tanstack Query for API calls
- ✅ Implement proper loading states
- ✅ Handle error states appropriately
- ✅ Cache responses when possible

### State Guidelines
1. Use local state for UI-only state
2. Implement proper loading indicators
3. Handle error states gracefully
4. Follow existing patterns

## 6. Code Style

### Naming Conventions
- Components: PascalCase
- Functions: camelCase
- Types/Interfaces: PascalCase
- Files: kebab-case
- CSS Classes: kebab-case

### File Structure
```typescript
// Component files
import statements
type definitions
component definition
styled components
exports

// Utility files
import statements
type definitions
function definitions
exports
```

## 7. Error Handling

### Error Guidelines
1. Use Error Boundary components
2. Implement proper error logging
3. Show user-friendly error messages
4. Follow existing error patterns

### Error Types
```typescript
type ApiError = {
  message: string;
  code: number;
  details?: Record<string, unknown>;
};
```

## 8. Testing

### Test Guidelines
1. Write unit tests for utilities
2. Test component rendering
3. Test error states
4. Follow existing test patterns

## 9. Performance

### Performance Rules
- ✅ Implement proper code splitting
- ✅ Optimize image loading
- ✅ Use proper caching strategies
- ✅ Monitor bundle size

## 10. Security

### Security Guidelines
1. Implement proper authentication
2. Use RLS policies
3. Sanitize user input
4. Follow security best practices

## 11. Workflow

### Development Process
1. Review existing implementation
2. Propose changes incrementally
3. Test thoroughly
4. Document changes

### Change Management
- ✅ Make atomic commits
- ✅ Document breaking changes
- ✅ Update relevant documentation
- ✅ Test before deployment

## 12. Documentation

### Documentation Rules
- ✅ Document new features
- ✅ Update existing documentation
- ✅ Include code examples
- ✅ Maintain type documentation

## 13. Deployment

### Deployment Guidelines
1. Test in development
2. Verify in staging
3. Deploy to production
4. Monitor for issues

## 14. Maintenance

### Maintenance Rules
- ✅ Regular dependency updates
- ✅ Code cleanup
- ✅ Performance monitoring
- ✅ Security patches
