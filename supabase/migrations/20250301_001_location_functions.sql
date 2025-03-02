-- Function to create a location
CREATE OR REPLACE FUNCTION create_location(
    lat double precision,
    long double precision,
    city_name text,
    state_name text,
    country_name text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_location jsonb;
BEGIN
    IF NOT (SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid())) THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    INSERT INTO locations (
        latitude,
        longitude,
        city,
        state,
        country
    )
    VALUES (
        lat,
        long,
        city_name,
        state_name,
        country_name
    )
    RETURNING jsonb_build_object(
        'id', id,
        'latitude', latitude,
        'longitude', longitude,
        'city', city,
        'state', state,
        'country', country,
        'created_at', created_at
    ) INTO new_location;

    RETURN new_location;
END;
$$;
