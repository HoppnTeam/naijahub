-- Create beauty_marketplace_orders table
CREATE TABLE IF NOT EXISTS beauty_marketplace_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    contact_info JSONB NOT NULL,
    payment_details JSONB,
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
    CONSTRAINT valid_payment_method CHECK (payment_method IN ('card', 'bank', 'delivery'))
);

-- Create beauty_marketplace_order_items table
CREATE TABLE IF NOT EXISTS beauty_marketplace_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES beauty_marketplace_orders(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES beauty_products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_price CHECK (price >= 0)
);

-- Add RLS policies for orders
ALTER TABLE beauty_marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Policy for viewing own orders
CREATE POLICY "Users can view own orders" ON beauty_marketplace_orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for creating orders
CREATE POLICY "Users can create orders" ON beauty_marketplace_orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for updating own orders
CREATE POLICY "Users can update own orders" ON beauty_marketplace_orders
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Add RLS policies for order items
ALTER TABLE beauty_marketplace_order_items ENABLE ROW LEVEL SECURITY;

-- Policy for viewing own order items (via order_id)
CREATE POLICY "Users can view own order items" ON beauty_marketplace_order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM beauty_marketplace_orders
            WHERE beauty_marketplace_orders.id = beauty_marketplace_order_items.order_id
            AND beauty_marketplace_orders.user_id = auth.uid()
        )
    );

-- Policy for creating order items
CREATE POLICY "Users can create order items" ON beauty_marketplace_order_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM beauty_marketplace_orders
            WHERE beauty_marketplace_orders.id = beauty_marketplace_order_items.order_id
            AND beauty_marketplace_orders.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp for orders
CREATE TRIGGER update_beauty_marketplace_orders_updated_at
    BEFORE UPDATE
    ON beauty_marketplace_orders
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beauty_marketplace_orders_user ON beauty_marketplace_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_beauty_marketplace_orders_status ON beauty_marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_beauty_marketplace_order_items_order ON beauty_marketplace_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_beauty_marketplace_order_items_listing ON beauty_marketplace_order_items(listing_id);
