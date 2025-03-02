-- Function to get beauty products with filters
CREATE OR REPLACE FUNCTION get_beauty_products(
    category_filter text DEFAULT NULL,
    search_query text DEFAULT NULL
)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT jsonb_build_object(
        'id', bp.id,
        'title', bp.title,
        'description', bp.description,
        'price', bp.price,
        'category', bp.category,
        'condition', bp.condition,
        'brand', bp.brand,
        'images', bp.images,
        'created_at', bp.created_at,
        'updated_at', bp.updated_at,
        'seller_id', bp.seller_id,
        'seller', jsonb_build_object(
            'id', p.id,
            'username', p.username,
            'avatar_url', p.avatar_url,
            'rating', p.rating
        ),
        'location', jsonb_build_object(
            'id', l.id,
            'city', l.city,
            'state', l.state,
            'country', l.country,
            'latitude', l.latitude,
            'longitude', l.longitude
        ),
        'status', bp.status,
        'features', bp.features,
        'expiry_date', bp.expiry_date,
        'ingredients', bp.ingredients,
        'quantity', bp.quantity,
        'views', bp.views,
        'saved_count', bp.saved_count
    )
    FROM beauty_products bp
    INNER JOIN profiles p ON p.id = bp.seller_id
    INNER JOIN locations l ON l.id = bp.location_id
    WHERE bp.status = 'available'
    AND (category_filter IS NULL OR bp.category = category_filter)
    AND (search_query IS NULL OR bp.title ILIKE '%' || search_query || '%')
    ORDER BY bp.created_at DESC;
END;
$$;
