CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON restaurants
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE restaurants (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    website VARCHAR(50) NOT NULL,
    phone BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

SELECT restaurants.id, restaurants.name, restaurants.website, restaurants.phone, tags FROM restaurants LEFT JOIN (SELECT restaurant_tags.restaurant_id, ARRAY_AGG(json_build_object('id', restaurant_tags.tag_id, 'title', tags.title, 'type', tags.type)) as tags FROM restaurant_tags LEFT JOIN tags ON restaurant_tags.tag_id = tags.id GROUP BY restaurant_tags.restaurant_id) as tags ON restaurants.id = tags.restaurant_id;

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE users (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TYPE order_status AS enum ('processing', 'received', 'preparing', 'delivery');

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE orders (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    is_delivery BOOLEAN NOT NULL,
    status order_status NOT NULL DEFAULT 'processing',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    item_id uuid NOT NULL,
    FOREIGN KEY (item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    item_price NUMERIC(10, 2) NOT NULL
);

SELECT orders.id, orders.restaurant_id, orders.user_id, orders.is_delivery, orders.status, orders.delivery_address, orders.total_amount, (SELECT json_build_object('order_items_id', order_items.id, 'item_id', order_items.item_id, 'quantity', order_items.quantity, 'item_price', order_items.item_price) AS order_items FROM order_items) FROM orders;

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON addresses
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE addresses (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    address_1 VARCHAR(50) NOT NULL,
    address_2 VARCHAR(50),
    address_3 VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    town VARCHAR(50),
    postcode VARCHAR(10) NOT NULL,
    country VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()

    CONSTRAINT either_id check ((restaurant_id IS NOT NULL OR user_id IS NOT NULL) AND (NOT(restaurant_id IS NOT NULL AND user_id IS NOT NULL)))
);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE reviews (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 0 AND rating <= 5) NOT NULL,
    review VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON menu_sections
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE menu_sections (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(25),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE menu_items (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id uuid NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menu_sections(id) ON DELETE CASCADE,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE menu_item_options (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id uuid NOT NULL,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(25) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TYPE tag_type AS enum ('cuisine', 'dishes', 'dietary');

CREATE TABLE tags (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(25) NOT NULL,
    type tag_type NOT NULL
);

CREATE TABLE restaurant_tags (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TYPE notification_type AS enum ('informational', 'success', 'warning', 'error');

CREATE TABLE notifications (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NULL,
    description VARCHAR(255),
    link VARCHAR(30),
    is_read BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON restaurant_users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE restaurant_users (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL
);

CREATE TYPE user_addresses_type AS enum ('billing', 'delivery');

CREATE TABLE user_addresses (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    address_id uuid NOT NULL,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE,
    type user_addresses_type NOT NULL,
    is_primary BOOLEAN DEFAULT false
);

CREATE TABLE restaurant_addresses (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    address_id uuid NOT NULL,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
);

SELECT 1 AS access FROM (SELECT user_addresses.address_id FROM user_addresses WHERE user_addresses.address_id = '2c1622c3-743e-451b-a1fb-fb8942bab3af' AND user_addresses.user_id = 'bbaeee71-7748-4992-ae0c-a4b7fa85dc94' UNION ALL SELECT restaurant_addresses.address_id FROM restaurant_addresses JOIN restaurant_users ON restaurant_users.restaurant_id = restaurant_addresses.restaurant_id WHERE restaurant_addresses.address_id = '2c1622c3-743e-451b-a1fb-fb8942bab3af' AND restaurant_users.user_id = 'bbaeee71-7748-4992-ae0c-a4b7fa85dc94' AND restaurant_users.role = 'OWNER') LIMIT 1;

SELECT 1 AS access FROM (SELECT restaurant_users.restaurant_id FROM restaurant_users JOIN restaurants ON restaurants.id = restaurant_users.restaurant_id WHERE user_id = 'bbaeee71-7748-4992-ae0c-a4b7fa85dc94' AND restaurant_id = (SELECT restaurant_id FROM reviews WHERE reviews.id = 'b420fd13-0c37-4093-a1d3-ad20d5a3b5f0'));