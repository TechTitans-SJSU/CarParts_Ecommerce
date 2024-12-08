-- Create Products Table
CREATE TABLE IF NOT EXISTS Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    inventory INTEGER NOT NULL DEFAULT 0
);

-- Create UserOrder Table (replacing orders)
CREATE TABLE IF NOT EXISTS userorders (
     order_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    total_amount DECIMAL(10,2),
    shipping_address TEXT,
    city VARCHAR(100),
    zip_code VARCHAR(20),
    status VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    payment_details VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create OrderItems Table
CREATE TABLE IF NOT EXISTS OrderItems (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES userorder(order_id),
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Notification function
CREATE OR REPLACE FUNCTION notify_order_created()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'userorders_notifications',
        json_build_object(
            'order_id', NEW.order_id,
            'user_id', NEW.user_id,
            'total_amount', NEW.total_amount,
            'shipping_address', NEW.shipping_address,
            'city', NEW.city,
            'zip_code', NEW.zip_code,
            'status', NEW.status,
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'email', NEW.email,
            'payment_details', NEW.payment_details,
            'created_at', NEW.created_at
        )::text
    );
    RETURN NEW;
END;
$$
 LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS order_created_trigger ON userorders;

-- Create new trigger
CREATE TRIGGER order_created_trigger
    AFTER INSERT ON userorders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_created();