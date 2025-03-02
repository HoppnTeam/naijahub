-- Create tables for monitoring
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  source TEXT NOT NULL,
  severity TEXT NOT NULL,
  stack TEXT,
  metadata JSONB,
  user_id UUID REFERENCES public.profiles(id),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  value FLOAT NOT NULL,
  name TEXT NOT NULL,
  metadata JSONB,
  user_id UUID REFERENCES public.profiles(id),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS error_logs_created_at_idx ON public.error_logs (created_at);
CREATE INDEX IF NOT EXISTS error_logs_severity_idx ON public.error_logs (severity);
CREATE INDEX IF NOT EXISTS error_logs_source_idx ON public.error_logs (source);
CREATE INDEX IF NOT EXISTS performance_metrics_created_at_idx ON public.performance_metrics (created_at);
CREATE INDEX IF NOT EXISTS performance_metrics_type_idx ON public.performance_metrics (type);

-- Create function to get database statistics
CREATE OR REPLACE FUNCTION public.get_database_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Get table sizes
  WITH table_sizes AS (
    SELECT
      table_name,
      pg_table_size(quote_ident(table_name)) as size_bytes,
      pg_total_relation_size(quote_ident(table_name)) as total_size_bytes
    FROM
      information_schema.tables
    WHERE
      table_schema = 'public'
  ),
  -- Get row counts
  row_counts AS (
    SELECT
      table_name,
      (SELECT reltuples::bigint FROM pg_class WHERE oid = (quote_ident(table_name)::regclass)) as estimated_row_count
    FROM
      information_schema.tables
    WHERE
      table_schema = 'public'
  )
  SELECT 
    jsonb_build_object(
      'table_stats', (
        SELECT 
          jsonb_agg(
            jsonb_build_object(
              'table_name', ts.table_name,
              'size_bytes', ts.size_bytes,
              'size_mb', round((ts.size_bytes::numeric / 1024 / 1024)::numeric, 2),
              'total_size_bytes', ts.total_size_bytes,
              'total_size_mb', round((ts.total_size_bytes::numeric / 1024 / 1024)::numeric, 2),
              'estimated_row_count', rc.estimated_row_count
            )
          )
        FROM 
          table_sizes ts
        JOIN 
          row_counts rc ON ts.table_name = rc.table_name
      ),
      'database_size', (
        SELECT 
          pg_database_size(current_database())
      ),
      'database_size_mb', (
        SELECT 
          round((pg_database_size(current_database())::numeric / 1024 / 1024)::numeric, 2)
      ),
      'active_connections', (
        SELECT 
          count(*) 
        FROM 
          pg_stat_activity 
        WHERE 
          datname = current_database()
      ),
      'transaction_stats', (
        SELECT 
          jsonb_build_object(
            'commits', sum(xact_commit),
            'rollbacks', sum(xact_rollback)
          )
        FROM 
          pg_stat_database
        WHERE 
          datname = current_database()
      )
    ) INTO result;

  RETURN result;
END;
$$;

-- Create function to get server statistics (simulated)
CREATE OR REPLACE FUNCTION public.get_server_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- This is a simplified version since we don't have direct access to server metrics
  -- In a real environment, you would collect these metrics from your hosting provider's API
  
  -- Get active connections as a proxy for server load
  SELECT 
    jsonb_build_object(
      'active_connections', (
        SELECT 
          count(*) 
        FROM 
          pg_stat_activity 
        WHERE 
          datname = current_database()
      ),
      'connection_states', (
        SELECT 
          jsonb_object_agg(state, count)
        FROM (
          SELECT 
            state, 
            count(*) 
          FROM 
            pg_stat_activity 
          WHERE 
            datname = current_database()
          GROUP BY 
            state
        ) states
      ),
      -- Simulated metrics (would be real in production)
      'simulated_metrics', jsonb_build_object(
        'cpu_usage', random() * 100,
        'memory_usage', random() * 100,
        'disk_usage', random() * 100,
        'network_in', random() * 1000,
        'network_out', random() * 1000
      )
    ) INTO result;

  RETURN result;
END;
$$;

-- Create RLS policies for the new tables
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert logs
CREATE POLICY "Allow authenticated users to insert error logs"
  ON public.error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert performance metrics"
  ON public.performance_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only allow admins to read logs
CREATE POLICY "Only admins can read error logs"
  ON public.error_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM public.admin_roles WHERE role = 'admin'
  ));

CREATE POLICY "Only admins can read performance metrics"
  ON public.performance_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM public.admin_roles WHERE role = 'admin'
  ));
