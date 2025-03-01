-- Create beauty_products table
CREATE TABLE IF NOT EXISTS beauty_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    brand TEXT,
    images TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'available',
    features TEXT[],
    expiry_date DATE,
    ingredients TEXT[],
    quantity INTEGER NOT NULL DEFAULT 1,
    views INTEGER NOT NULL DEFAULT 0,
    saved_count INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT valid_category CHECK (category IN ('skincare', 'haircare', 'nails', 'makeup', 'fragrance', 'tools', 'other')),
    CONSTRAINT valid_condition CHECK (condition IN ('new', 'like-new', 'good', 'fair')),
    CONSTRAINT valid_status CHECK (status IN ('available', 'sold', 'pending')),
    CONSTRAINT positive_price CHECK (price >= 0),
    CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- Add RLS policies
ALTER TABLE beauty_products ENABLE ROW LEVEL SECURITY;

-- Policy for viewing available products
CREATE POLICY "View available products" ON beauty_products
    FOR SELECT
    USING (status = 'available');

-- Policy for creating products
CREATE POLICY "Users can create products" ON beauty_products
    FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

-- Policy for updating own products
CREATE POLICY "Users can update own products" ON beauty_products
    FOR UPDATE
    USING (auth.uid() = seller_id);

-- Policy for deleting own products
CREATE POLICY "Users can delete own products" ON beauty_products
    FOR DELETE
    USING (auth.uid() = seller_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_beauty_products_updated_at
    BEFORE UPDATE
    ON beauty_products
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_beauty_products_category ON beauty_products(category);
CREATE INDEX IF NOT EXISTS idx_beauty_products_status ON beauty_products(status);
CREATE INDEX IF NOT EXISTS idx_beauty_products_seller ON beauty_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_beauty_products_location ON beauty_products(location_id);

-- Create saved_beauty_products table for wishlist functionality
CREATE TABLE IF NOT EXISTS saved_beauty_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES beauty_products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, product_id)
);

-- Add RLS policies for saved products
ALTER TABLE saved_beauty_products ENABLE ROW LEVEL SECURITY;

-- Policy for viewing own saved products
CREATE POLICY "Users can view own saved products" ON saved_beauty_products
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy for saving products
CREATE POLICY "Users can save products" ON saved_beauty_products
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for unsaving products
CREATE POLICY "Users can unsave products" ON saved_beauty_products
    FOR DELETE
    USING (auth.uid() = user_id);
