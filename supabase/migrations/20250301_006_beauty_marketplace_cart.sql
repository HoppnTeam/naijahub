-- Create beauty_marketplace_cart_items table
CREATE TABLE IF NOT EXISTS beauty_marketplace_cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES beauty_products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    UNIQUE(user_id, listing_id)
);

-- Add RLS policies for cart items
ALTER TABLE beauty_marketplace_cart_items ENABLE ROW LEVEL SECURITY;

-- Policy for viewing own cart items
CREATE POLICY "Users can view own cart items" ON beauty_marketplace_cart_items
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for adding items to cart
CREATE POLICY "Users can add items to cart" ON beauty_marketplace_cart_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for updating own cart items
CREATE POLICY "Users can update own cart items" ON beauty_marketplace_cart_items
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for removing items from cart
CREATE POLICY "Users can remove items from cart" ON beauty_marketplace_cart_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beauty_marketplace_cart_items_user ON beauty_marketplace_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_beauty_marketplace_cart_items_listing ON beauty_marketplace_cart_items(listing_id);
