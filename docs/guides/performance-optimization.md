# Performance Optimization Guide

This guide outlines the performance optimization strategies implemented in the NaijaHub application and provides best practices for maintaining and improving application performance.

## Overview

NaijaHub implements several performance optimization techniques to ensure a fast, responsive user experience:

1. **Code Splitting & Lazy Loading**: Reduces initial bundle size
2. **React Query Caching**: Minimizes redundant network requests
3. **Component Optimization**: Reduces unnecessary renders
4. **Image Optimization**: Ensures fast loading of visual content
5. **PWA Capabilities**: Enables offline access and faster subsequent loads

## Code Splitting & Lazy Loading

### Implementation

NaijaHub uses React's `lazy` and `Suspense` for code splitting:

```tsx
import React, { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner';

// Lazy load route components
const HomePage = lazy(() => import('@/pages/HomePage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const MarketplacePage = lazy(() => import('@/pages/MarketplacePage'));

// In your router
<Routes>
  <Route 
    path="/" 
    element={
      <Suspense fallback={<Spinner />}>
        <HomePage />
      </Suspense>
    } 
  />
  <Route 
    path="/category/:categoryId" 
    element={
      <Suspense fallback={<Spinner />}>
        <CategoryPage />
      </Suspense>
    } 
  />
  {/* Other routes */}
</Routes>
```

### Best Practices

1. **Route-Based Splitting**: Lazy load at the route level for the most significant impact
2. **Feature-Based Splitting**: Lazy load large features that aren't immediately needed
3. **Consistent Loading Experience**: Use the same loading component across lazy-loaded components
4. **Error Boundaries**: Wrap lazy-loaded components in error boundaries

```tsx
// Example of feature-based splitting
const AdminDashboard = lazy(() => import('@/components/admin/Dashboard'));

// In your component
{isAdmin && (
  <Suspense fallback={<Spinner />}>
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  </Suspense>
)}
```

## React Query Optimization

NaijaHub uses Tanstack Query (React Query) for data fetching with optimized settings:

### Query Client Configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Query Key Structure

NaijaHub uses a consistent query key structure:

```tsx
// Entity-based keys
useQuery(['users', userId], () => fetchUser(userId));
useQuery(['posts', { categoryId, page }], () => fetchPosts(categoryId, page));

// Action-based keys
useQuery(['auth', 'currentUser'], getCurrentUser);
```

### Prefetching Data

Prefetch data for common navigation paths:

```tsx
// In a component that links to user profiles
const prefetchUserProfile = (userId) => {
  queryClient.prefetchQuery(
    ['users', userId], 
    () => fetchUser(userId),
    { staleTime: 5 * 60 * 1000 }
  );
};

// Trigger on hover
<div onMouseEnter={() => prefetchUserProfile(user.id)}>
  <UserPreview user={user} />
</div>
```

## Component Optimization

### Memoization

Use React's memoization features to prevent unnecessary renders:

```tsx
// Memoize components
const MemoizedComponent = React.memo(MyComponent);

// Memoize callback functions
const handleClick = useCallback(() => {
  // Function logic
}, [dependency1, dependency2]);

// Memoize computed values
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

### Component Splitting

Split large components into smaller, focused components:

```tsx
// Instead of one large component
const ProfilePage = () => {
  // Lots of logic and UI
};

// Split into smaller components
const ProfilePage = () => (
  <div>
    <ProfileHeader />
    <ProfileStats />
    <ProfileContent />
    <ProfileActions />
  </div>
);
```

### Virtual Lists

For long lists, use virtualization:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedList = ({ items }) => {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Image Optimization

### Responsive Images

Use responsive images with appropriate sizes:

```tsx
<img
  src={smallImage}
  srcSet={`${smallImage} 400w, ${mediumImage} 800w, ${largeImage} 1200w`}
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description"
  loading="lazy"
/>
```

### Image Loading Strategies

1. **Lazy Loading**: Use the `loading="lazy"` attribute for images below the fold
2. **Priority Loading**: Use `priority` for critical above-the-fold images
3. **Placeholder Images**: Use low-quality image placeholders (LQIP) for a better loading experience

```tsx
// Example of a component with LQIP
const OptimizedImage = ({ src, alt, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="image-container">
      {!isLoaded && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'image-loaded' : 'image-loading'}
      />
    </div>
  );
};
```

## PWA Optimization

NaijaHub implements Progressive Web App features for better performance:

### Service Worker

The service worker caches assets and API responses for faster loading and offline access:

```js
// In service-worker.js
const CACHE_NAME = 'naijahub-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  // Other assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### Offline Support

NaijaHub provides offline support with appropriate UI feedback:

```tsx
// OfflineIndicator component
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (isOnline) return null;
  
  return (
    <div className="offline-indicator">
      You are currently offline. Some features may be unavailable.
    </div>
  );
};
```

## Database Query Optimization

### Optimized Supabase Queries

1. **Select Only Needed Columns**:

```typescript
// Instead of
const { data } = await supabase.from('posts').select('*');

// Select only what you need
const { data } = await supabase.from('posts').select('id, title, created_at');
```

2. **Use Pagination**:

```typescript
const { data } = await supabase
  .from('posts')
  .select('id, title, created_at')
  .range(0, 9); // First 10 items (0-9)
```

3. **Use Indexes**:

Ensure that frequently queried columns have indexes:

```sql
-- In your migration
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON public.posts (user_id);
```

## Monitoring Performance

NaijaHub includes performance monitoring:

```typescript
import { logPerformance } from '@/lib/monitoring';

// Measure component render time
const Component = () => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      logPerformance({
        component: 'Component',
        duration,
        type: 'render'
      });
    };
  }, []);
  
  // Component logic
};

// Measure function execution time
const measurePerformance = (fn, name) => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const duration = performance.now() - start;
    
    logPerformance({
      function: name,
      duration,
      type: 'execution'
    });
    
    return result;
  };
};

// Usage
const optimizedFunction = measurePerformance(myFunction, 'myFunction');
```

## Performance Checklist

Use this checklist when developing new features:

1. **Bundle Size**: Will this feature significantly increase the bundle size?
2. **Render Performance**: Does this component render efficiently?
3. **Network Requests**: Are API calls optimized and cached appropriately?
4. **Memory Usage**: Does this feature cause memory leaks?
5. **Offline Support**: Does this feature work offline or degrade gracefully?
6. **Mobile Performance**: Is performance acceptable on low-end mobile devices?

## Tools for Performance Analysis

- **Lighthouse**: Audit web app performance
- **Chrome DevTools Performance Tab**: Analyze runtime performance
- **React DevTools Profiler**: Measure component render times
- **Bundle Analyzer**: Analyze bundle size and composition

## Conclusion

By following these performance optimization strategies, you can ensure that NaijaHub remains fast and responsive even as the application grows in complexity and user base.

Remember that performance optimization is an ongoing process. Regularly monitor performance metrics and address issues as they arise.

For more information, refer to:
- [React Performance Documentation](https://reactjs.org/docs/optimizing-performance.html)
- [Tanstack Query Optimization](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [Web Vitals](https://web.dev/vitals/)
