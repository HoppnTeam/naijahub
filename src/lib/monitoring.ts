import { supabase } from '@/integrations/supabase/client';

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error source types
export enum ErrorSource {
  CLIENT = 'client',
  SERVER = 'server',
  DATABASE = 'database',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication'
}

// Performance metric types
export enum MetricType {
  PAGE_LOAD = 'page_load',
  API_RESPONSE = 'api_response',
  COMPONENT_RENDER = 'component_render',
  DATABASE_QUERY = 'database_query',
  RESOURCE_LOAD = 'resource_load'
}

interface ErrorLog {
  message: string;
  source: ErrorSource;
  severity: ErrorSeverity;
  stack?: string;
  metadata?: Record<string, any>;
  user_id?: string;
  url?: string;
}

interface PerformanceMetric {
  type: MetricType;
  value: number; // Duration in milliseconds
  name: string;
  metadata?: Record<string, any>;
  user_id?: string;
  url?: string;
}

/**
 * Log an error to the database
 */
export const logError = async (errorData: ErrorLog): Promise<void> => {
  try {
    await supabase.from('error_logs').insert({
      message: errorData.message,
      source: errorData.source,
      severity: errorData.severity,
      stack: errorData.stack,
      metadata: errorData.metadata,
      user_id: errorData.user_id,
      url: errorData.url || window.location.href
    });
    
    // For critical errors, we might want to notify administrators
    if (errorData.severity === ErrorSeverity.CRITICAL) {
      // This could be implemented with a webhook or email service
      console.error('CRITICAL ERROR:', errorData.message);
    }
  } catch (error) {
    // Fallback to console if we can't log to the database
    console.error('Failed to log error to database:', error);
    console.error('Original error:', errorData);
  }
};

/**
 * Log a performance metric to the database
 */
export const logPerformanceMetric = async (metricData: PerformanceMetric): Promise<void> => {
  try {
    await supabase.from('performance_metrics').insert({
      type: metricData.type,
      value: metricData.value,
      name: metricData.name,
      metadata: metricData.metadata,
      user_id: metricData.user_id,
      url: metricData.url || window.location.href
    });
  } catch (error) {
    console.error('Failed to log performance metric:', error);
  }
};

/**
 * Measure the performance of a function
 */
export const measurePerformance = async <T>(
  fn: () => Promise<T>,
  metricType: MetricType,
  name: string,
  metadata?: Record<string, any>,
  user_id?: string
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    
    // Log the performance metric asynchronously
    logPerformanceMetric({
      type: metricType,
      value: duration,
      name,
      metadata,
      user_id
    }).catch(console.error);
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Log the performance metric even if the function failed
    logPerformanceMetric({
      type: metricType,
      value: duration,
      name,
      metadata: { ...metadata, error: true },
      user_id
    }).catch(console.error);
    
    throw error;
  }
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = (): void => {
  // Monitor page load performance
  window.addEventListener('load', () => {
    if (window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      logPerformanceMetric({
        type: MetricType.PAGE_LOAD,
        value: pageLoadTime,
        name: document.title || window.location.pathname,
        metadata: {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          request: perfData.responseStart - perfData.requestStart,
          response: perfData.responseEnd - perfData.responseStart,
          dom: perfData.domComplete - perfData.domLoading,
          domInteractive: perfData.domInteractive - perfData.navigationStart,
          firstPaint: perfData.domContentLoadedEventStart - perfData.navigationStart
        }
      }).catch(console.error);
    }
  });
  
  // Monitor unhandled errors
  window.addEventListener('error', (event) => {
    logError({
      message: event.message || 'Unhandled error',
      source: ErrorSource.CLIENT,
      severity: ErrorSeverity.ERROR,
      stack: event.error?.stack,
      url: event.filename
    }).catch(console.error);
  });
  
  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    logError({
      message: error?.message || 'Unhandled promise rejection',
      source: ErrorSource.CLIENT,
      severity: ErrorSeverity.ERROR,
      stack: error?.stack,
    }).catch(console.error);
  });
  
  // Override fetch to monitor API calls
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    const startTime = performance.now();
    try {
      const response = await originalFetch(input, init);
      const duration = performance.now() - startTime;
      
      // Only log API calls to our own backend
      const url = typeof input === 'string' ? input : input.url;
      if (url.includes('supabase.co')) {
        logPerformanceMetric({
          type: MetricType.API_RESPONSE,
          value: duration,
          name: url,
          metadata: {
            status: response.status,
            ok: response.ok
          }
        }).catch(console.error);
      }
      
      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      const url = typeof input === 'string' ? input : input.url;
      
      logError({
        message: `Fetch error: ${error.message}`,
        source: ErrorSource.NETWORK,
        severity: ErrorSeverity.ERROR,
        stack: error.stack,
        metadata: { url }
      }).catch(console.error);
      
      logPerformanceMetric({
        type: MetricType.API_RESPONSE,
        value: duration,
        name: url,
        metadata: { error: true }
      }).catch(console.error);
      
      throw error;
    }
  };
};

/**
 * Get database performance statistics
 */
export const getDatabaseStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_database_stats');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to get database stats:', error);
    throw error;
  }
};

/**
 * Get server load statistics
 */
export const getServerStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_server_stats');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to get server stats:', error);
    throw error;
  }
};

/**
 * Get error statistics
 */
export const getErrorStats = async (days = 7) => {
  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
    
    if (error) throw error;
    
    // Group errors by source and severity
    const groupedBySource = data.reduce((acc, log) => {
      if (!acc[log.source]) {
        acc[log.source] = 0;
      }
      acc[log.source]++;
      return acc;
    }, {});
    
    const groupedBySeverity = data.reduce((acc, log) => {
      if (!acc[log.severity]) {
        acc[log.severity] = 0;
      }
      acc[log.severity]++;
      return acc;
    }, {});
    
    // Group by day
    const groupedByDay = data.reduce((acc, log) => {
      const day = new Date(log.created_at).toLocaleDateString();
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day]++;
      return acc;
    }, {});
    
    return {
      total: data.length,
      bySource: Object.entries(groupedBySource).map(([source, count]) => ({ source, count })),
      bySeverity: Object.entries(groupedBySeverity).map(([severity, count]) => ({ severity, count })),
      byDay: Object.entries(groupedByDay).map(([day, count]) => ({ day, count })),
      recentErrors: data.slice(0, 10) // Return 10 most recent errors
    };
  } catch (error) {
    console.error('Failed to get error stats:', error);
    throw error;
  }
};

/**
 * Get performance metrics statistics
 */
export const getPerformanceStats = async (days = 7) => {
  try {
    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
    
    if (error) throw error;
    
    // Group metrics by type
    const groupedByType = data.reduce((acc, metric) => {
      if (!acc[metric.type]) {
        acc[metric.type] = [];
      }
      acc[metric.type].push(metric);
      return acc;
    }, {});
    
    // Calculate averages for each type
    const averagesByType = Object.entries(groupedByType).map(([type, metrics]) => {
      const values = metrics.map(m => m.value);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      return {
        type,
        average: avg,
        min,
        max,
        count: values.length
      };
    });
    
    // Group by day and type for trends
    const metricsByDay = data.reduce((acc, metric) => {
      const day = new Date(metric.created_at).toLocaleDateString();
      if (!acc[day]) {
        acc[day] = {};
      }
      if (!acc[day][metric.type]) {
        acc[day][metric.type] = [];
      }
      acc[day][metric.type].push(metric.value);
      return acc;
    }, {});
    
    const trendData = Object.entries(metricsByDay).map(([day, types]) => {
      const result = { day };
      Object.entries(types).forEach(([type, values]) => {
        const sum = values.reduce((a, b) => a + b, 0);
        result[type] = sum / values.length;
      });
      return result;
    });
    
    return {
      averages: averagesByType,
      trends: trendData
    };
  } catch (error) {
    console.error('Failed to get performance stats:', error);
    throw error;
  }
};
