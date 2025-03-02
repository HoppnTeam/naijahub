# Error Handling Guide

This guide explains the error handling system implemented in the NaijaHub application, including best practices and how to use the provided utilities.

## Overview

NaijaHub implements a comprehensive error handling system designed to:

1. Provide consistent error handling across the application
2. Improve user experience with meaningful error messages
3. Log errors for monitoring and debugging
4. Handle different types of errors (network, database, authentication, etc.)
5. Support retry mechanisms for transient failures

## Error Handling Architecture

The error handling system consists of several components:

1. **Centralized Error Handling Utility**: Located at `/src/lib/error-handling.ts`
2. **Error Monitoring System**: Located at `/src/lib/monitoring.ts`
3. **Component-Level Error Boundaries**: React error boundaries to isolate failures
4. **Toast Notifications**: User-friendly error messages via toast notifications
5. **React Query Error Handling**: Custom error handlers for data fetching

## Core Error Handling Functions

### `handleAsyncError`

The `handleAsyncError` function is the primary utility for handling asynchronous errors:

```typescript
import { handleAsyncError } from '@/lib/error-handling';

try {
  await someAsyncOperation();
} catch (error) {
  handleAsyncError(error, "Failed to perform operation");
}
```

This function:
- Logs the error to the monitoring system
- Displays a user-friendly toast notification
- Formats the error for consistent handling

### `withErrorHandling` Higher-Order Function

The `withErrorHandling` function wraps async operations with error handling:

```typescript
import { withErrorHandling } from '@/lib/error-handling';

const fetchDataSafely = withErrorHandling(
  fetchData,
  "Failed to fetch data"
);

// Now you can use fetchDataSafely without try/catch
const result = await fetchDataSafely(id);
```

### Supabase-Specific Error Handling

For Supabase operations, use the specialized error handlers:

```typescript
import { handleSupabaseError } from '@/lib/error-handling';

const { data, error } = await supabase.from('table').select('*');

if (error) {
  handleSupabaseError(error, "Failed to fetch data");
  return;
}
```

## Component-Level Error Handling

### Using Error Boundaries

Wrap components that might fail in an ErrorBoundary:

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightFail />
</ErrorBoundary>
```

### Creating Error UI Components

Create consistent error states for components:

```tsx
const ErrorState = ({ message, onRetry }) => (
  <div className="error-container">
    <p className="error-message">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    )}
  </div>
);
```

## React Query Integration

NaijaHub uses React Query with custom error handlers:

```typescript
// In App.tsx or query client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        errorHandler: (error: Error) => {
          handleAsyncError(error, "Failed to fetch data");
        }
      }
    },
    mutations: {
      retry: 1,
      meta: {
        errorHandler: (error: Error) => {
          handleAsyncError(error, "Failed to update data");
        }
      }
    },
  },
});
```

## Error Logging and Monitoring

Errors are automatically logged to the monitoring system:

```typescript
import { logError, ErrorSeverity, ErrorSource } from '@/lib/monitoring';

logError({
  message: "Something went wrong",
  source: ErrorSource.CLIENT,
  severity: ErrorSeverity.ERROR,
  stack: error.stack,
  metadata: { additionalInfo: "context" }
});
```

## Best Practices

### 1. Always Use the Provided Utilities

Instead of:
```typescript
try {
  await someAsyncOperation();
} catch (error) {
  console.error(error);
  // Show some error UI
}
```

Use:
```typescript
try {
  await someAsyncOperation();
} catch (error) {
  handleAsyncError(error, "Failed to perform operation");
}
```

### 2. Provide Meaningful Error Messages

Bad:
```typescript
handleAsyncError(error, "Error");
```

Good:
```typescript
handleAsyncError(error, "Failed to update your profile");
```

### 3. Add Context to Errors

```typescript
handleAsyncError(error, "Failed to update your profile", {
  userId: user.id,
  attemptedFields: ['name', 'bio']
});
```

### 4. Use Component-Level Error Boundaries

Wrap complex components in error boundaries to prevent the entire app from crashing:

```tsx
<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>
```

### 5. Implement Retry Mechanisms for Transient Failures

```tsx
const { data, error, refetch } = useQuery(['key'], fetchData, {
  retry: 1,
  onError: (error) => handleAsyncError(error, "Failed to load data")
});

if (error) {
  return <ErrorState message="Failed to load data" onRetry={refetch} />;
}
```

### 6. Handle Different Error Types Appropriately

```typescript
try {
  await someAsyncOperation();
} catch (error) {
  if (error instanceof NetworkError) {
    handleAsyncError(error, "Network connection issue. Please check your internet connection.");
  } else if (error instanceof AuthError) {
    handleAsyncError(error, "Authentication error. Please log in again.");
    // Redirect to login
    navigate('/login');
  } else {
    handleAsyncError(error, "An unexpected error occurred.");
  }
}
```

## Common Error Patterns

### Form Submission Errors

```tsx
const handleSubmit = async (formData) => {
  try {
    setIsSubmitting(true);
    await submitForm(formData);
    toast.success("Form submitted successfully!");
  } catch (error) {
    handleAsyncError(error, "Failed to submit form");
  } finally {
    setIsSubmitting(false);
  }
};
```

### Data Fetching Errors

```tsx
const { data, error, isLoading } = useQuery(
  ['posts', postId],
  () => fetchPost(postId),
  {
    onError: (error) => handleAsyncError(error, "Failed to load post")
  }
);

if (isLoading) return <Spinner />;
if (error) return <ErrorState message="Failed to load post" />;
```

### Authentication Errors

```tsx
const login = async (credentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    
    if (error) {
      if (error.status === 400) {
        return { error: "Invalid email or password" };
      } else {
        handleSupabaseError(error, "Login failed");
        return { error: "Login failed" };
      }
    }
    
    return { user: data.user };
  } catch (error) {
    handleAsyncError(error, "An unexpected error occurred during login");
    return { error: "Login failed" };
  }
};
```

## Conclusion

By following these error handling patterns and using the provided utilities, you can ensure that:

1. Errors are consistently handled throughout the application
2. Users receive meaningful feedback when errors occur
3. Developers have access to detailed error information for debugging
4. The application remains stable even when errors occur

For more information, refer to:
- [Monitoring Documentation](../monitoring.md)
- [React Error Boundary Documentation](https://reactjs.org/docs/error-boundaries.html)
- [React Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-functions)
