-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Policy for viewing locations
CREATE POLICY "Anyone can view locations" ON locations
    FOR SELECT
    USING (true);

-- Policy for creating locations
CREATE POLICY "Authenticated users can create locations" ON locations
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Create index for spatial queries
CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations USING gist (
    ll_to_earth(latitude, longitude)
);
