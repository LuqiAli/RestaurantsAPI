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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON menu_item_sections
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE menu_item_sections (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id uuid NOT NULL,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(25),
    required BOOLEAN NOT NULL DEFAULT FALSE,
    multiple BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON menu_item_options
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE menu_item_options (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_section_id uuid NOT NULL,
    FOREIGN KEY (menu_item_section_id) REFERENCES menu_item_sections(id) ON DELETE CASCADE,
    restaurant_id uuid NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(25) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

CREATE TABLE order_item_options (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    item_option_id uuid NOT NULL,
    FOREIGN KEY (item_option_id) REFERENCES menu_item_options(id) ON DELETE CASCADE,
    item_option_name VARCHAR(100) NOT NULL,
    item_option_price NUMERIC(10, 2) NOT NULL
);

-- CREATE TABLE menu_item_option_sections (
--     id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
--     restaurant_id uuid NOT NULL, 
--     FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
--     menu_item_id uuid NOT NULL,
--     FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
--     name VARCHAR(100) NOT NULL,
--     min_select INT DEFAULT 0 NOT NULL,
--     max_select INT NOT NULL,
--     position INT NOT NULL
-- );

CREATE TRIGGER set_timestamp 
BEFORE UPDATE ON order_addresses
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE TABLE order_addresses (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    address_1 VARCHAR(50) NOT NULL,
    address_2 VARCHAR(50),
    address_3 VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    town VARCHAR(50),
    postcode VARCHAR(10) NOT NULL,
    country VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT 1 AS access FROM (SELECT user_addresses.address_id FROM user_addresses WHERE user_addresses.address_id = '2c1622c3-743e-451b-a1fb-fb8942bab3af' AND user_addresses.user_id = 'bbaeee71-7748-4992-ae0c-a4b7fa85dc94' UNION ALL SELECT restaurant_addresses.address_id FROM restaurant_addresses JOIN restaurant_users ON restaurant_users.restaurant_id = restaurant_addresses.restaurant_id WHERE restaurant_addresses.address_id = '2c1622c3-743e-451b-a1fb-fb8942bab3af' AND restaurant_users.user_id = 'bbaeee71-7748-4992-ae0c-a4b7fa85dc94' AND restaurant_users.role = 'OWNER') LIMIT 1;

SELECT 1 AS access FROM (SELECT restaurant_users.restaurant_id FROM restaurant_users JOIN restaurants ON restaurants.id = restaurant_users.restaurant_id WHERE user_id = 'bbaeee71-7748-4992-ae0c-a4b7fa85dc94' AND restaurant_id = (SELECT restaurant_id FROM reviews WHERE reviews.id = 'b420fd13-0c37-4093-a1d3-ad20d5a3b5f0'));

SELECT orders.id, orders.restaurant_id, orders.user_id, orders.is_delivery, orders.status, orders.delivery_address, orders.total_amount, order_items FROM orders LEFT JOIN (SELECT order_items.order_id, ARRAY_AGG(json_build_object('order_items_id', order_items.id, 'item_id', order_items.item_id, 'name', order_items.item_name, 'quantity', order_items.quantity, 'item_price', order_items.item_price, 'item_options', item_options)) AS order_items FROM order_items LEFT JOIN (SELECT order_item_options.item_id, order_item_options.order_id, ARRAY_AGG(json_build_object('order_item_options_id', order_item_options.id, 'id', order_item_options.item_option_id, 'name', order_item_options.item_option_name, 'price', order_item_options.item_option_price)) as item_options FROM order_item_options GROUP BY order_item_options.item_id, order_item_options.order_id) as item_options ON item_options.order_id = order_items.order_id AND item_options.item_id = order_items.item_id GROUP BY order_items.order_id) as order_items ON order_items.order_id = orders.id;

SELECT
    menu_item_options.restaurant_id,
    menu_item_options.menu_item_id,
    ARRAY_AGG(
        json_build_object(
            'id', menu_item_options.id,
            'name', menu_item_options.name,
            'price', menu_item_options.price,
            'required', menu_item_options.required

        )
    ) as item_options
FROM
    menu_item_options
GROUP BY menu_item_options.restaurant_id, menu_item_options.menu_item_id;

SELECT
    menu_items.restaurant_id,
    menu_items.menu_id,
    ARRAY_AGG(
        json_build_object(
            'id', menu_items.id,
            'name', menu_items.name,
            'description', menu_items.description,
            'price', menu_items.price,
            'item_options', item_options
        )
    ) as items
FROM
    menu_items
LEFT JOIN
    (SELECT
        menu_item_options.restaurant_id,
        menu_item_options.menu_item_id,
        ARRAY_AGG(
            json_build_object(
                'id', menu_item_options.id,
                'name', menu_item_options.name,
                'price', menu_item_options.price,
                'required', menu_item_options.required

            )
        ) as item_options
    FROM
        menu_item_options
    GROUP BY menu_item_options.restaurant_id, menu_item_options.menu_item_id
) as item_options
ON menu_items.restaurant_id = item_options.restaurant_id AND menu_items.id = item_options.menu_item_id
GROUP BY menu_items.restaurant_id, menu_items.menu_id;








SELECT t1.id, t1.name, t1.website, t1.phone, t1.tags, t2.address, t3.avg_rating FROM (SELECT  restaurants.id,  restaurants.name, restaurants.website, restaurants.phone, tags FROM restaurants LEFT JOIN (SELECT restaurant_tags.restaurant_id, ARRAY_AGG(json_build_object('id', restaurant_tags.tag_id, 'title', tags.title, 'type', tags.type)) as tags FROM restaurant_tags LEFT JOIN tags ON restaurant_tags.tag_id = tags.id GROUP BY restaurant_tags.restaurant_id) as tags ON restaurants.id = tags.restaurant_id) as t1 LEFT JOIN (SELECT restaurants.id, address FROM restaurants LEFT JOIN (SELECT restaurant_addresses.restaurant_id, ARRAY_AGG(json_build_object('id', addresses.id, 'address_1', addresses.address_1, 'address_2', addresses.address_2, 'address_3', addresses.address_3, 'city', addresses.city, 'town', addresses.town, 'postcode', addresses.postcode, 'country', addresses.country)) as address FROM restaurant_addresses LEFT JOIN addresses ON restaurant_addresses.address_id = addresses.id GROUP BY restaurant_addresses.restaurant_id) as addresse ON restaurants.id = addresse.restaurant_id) as t2 ON t1.id = t2.id LEFT JOIN (SELECT  restaurants.id, COALESCE(AVG(reviews.rating)::NUMERIC(10, 1), 0) as avg_rating FROM restaurants LEFT JOIN reviews ON restaurants.id = reviews.restaurant_id GROUP BY restaurants.id) as t3 ON t1.id = t3.id;



SELECT  
    restaurants.id,  
    COALESCE(AVG(reviews.rating), 0) as avg_rating
FROM 
    restaurants 
LEFT JOIN reviews
ON restaurants.id = reviews.restaurant_id
GROUP BY restaurants.id;

SELECT 
    order_addresses.order_id,
    ARRAY_AGG(
        json_build_object(
            'address_1', order_addresses.address_1,
            'address_2', order_addresses.address_2,
            'address_3', order_addresses.address_3,
            'city', order_addresses.city,
            'town', order_addresses.town,
            'postcode', order_addresses.postcode,
            'country', order_addresses.country
        )
    ) as address
FROM
    order_addresses
GROUP BY
    order_addresses.order_id;

SELECT order_addresses.order_id, ARRAY_AGG(json_build_object('address_1', order_addresses.address_1, 'address_2', order_addresses.address_2, 'address_3', order_addresses.address_3, 'city', order_addresses.city, 'town', order_addresses.town, 'postcode', order_addresses.postcode, 'country', order_addresses.country)) AS address FROM order_addresses GROUP BY order_addresses.order_id;

SELECT
    menu_item_sections.menu_item_id,
    menu_item_sections.id,
    menu_item_sections.name,
    menu_item_sections.required,
    menu_item_sections.multiple,
    item_options
FROM 
    menu_item_sections
LEFT JOIN (
    SELECT
        menu_item_options.menu_item_section_id,
        ARRAY_AGG(
            json_build_object(
                'id', menu_item_options.id,
                'name', menu_item_options.name,
                'price', menu_item_options.price
            )
        ) 
        as item_options
    FROM 
        menu_item_options
    GROUP BY
        menu_item_options.menu_item_section_id
) 
AS 
    item_options
ON 
    item_options.menu_item_section_id = menu_item_sections.id;



SELECT
    menu_items.menu_id,
    menu_items.id,
    menu_items.name,
    menu_items.description,
    menu_items.price,
    sectiones.item_sections
FROM
    menu_items
LEFT JOIN (
    SELECT
        item_sections.menu_item_id,
        ARRAY_AGG(
            json_build_object(
                'id', item_sections.id,
                'name', item_sections.name,
                'required', item_sections.required,
                'multiple', item_sections.multiple,
                'item_options', item_options
            )
        )
        as item_sections
    FROM (
        SELECT
            menu_item_sections.menu_item_id,
            menu_item_sections.id,
            menu_item_sections.name,
            menu_item_sections.required,
            menu_item_sections.multiple,
            item_options
        FROM 
            menu_item_sections
        LEFT JOIN (
            SELECT
                menu_item_options.menu_item_section_id,
                ARRAY_AGG(
                    json_build_object(
                        'id', menu_item_options.id,
                        'name', menu_item_options.name,
                        'price', menu_item_options.price
                    )
                ) 
                as item_options
            FROM 
                menu_item_options
            GROUP BY
                menu_item_options.menu_item_section_id
        ) 
        AS 
            item_options
        ON 
            item_options.menu_item_section_id = menu_item_sections.id  
    ) as item_sections
    GROUP BY 
        item_sections.menu_item_id
) as sectiones
ON sectiones.menu_item_id = menu_items.id;
    
SELECT
    menu_sections.restaurant_id,
    menu_sections.id,
    menu_sections.name,
    itemes.items
FROM 
    menu_sections
LEFT JOIN (
    SELECT
        items.menu_id,
        ARRAY_AGG(
            json_build_object(
                'id', items.id,
                'name', items.name,
                'description', items.description,
                'price', items.price,
                'item_sections', item_sections
            )
        )
        as items
    FROM (
        SELECT
            menu_items.menu_id,
            menu_items.id,
            menu_items.name,
            menu_items.description,
            menu_items.price,
            sectiones.item_sections
        FROM
            menu_items
        LEFT JOIN (
            SELECT
                item_sections.menu_item_id,
                ARRAY_AGG(
                    json_build_object(
                        'id', item_sections.id,
                        'name', item_sections.name,
                        'required', item_sections.required,
                        'multiple', item_sections.multiple,
                        'item_options', item_options
                    )
                )
                as item_sections
            FROM (
                SELECT
                    menu_item_sections.menu_item_id,
                    menu_item_sections.id,
                    menu_item_sections.name,
                    menu_item_sections.required,
                    menu_item_sections.multiple,
                    item_options
                FROM 
                    menu_item_sections
                LEFT JOIN (
                    SELECT
                        menu_item_options.menu_item_section_id,
                        ARRAY_AGG(
                            json_build_object(
                                'id', menu_item_options.id,
                                'name', menu_item_options.name,
                                'price', menu_item_options.price
                            )
                        ) 
                        as item_options
                    FROM 
                        menu_item_options
                    GROUP BY
                        menu_item_options.menu_item_section_id
                ) 
                AS 
                    item_options
                ON 
                    item_options.menu_item_section_id = menu_item_sections.id  
            ) as item_sections
            GROUP BY 
                item_sections.menu_item_id
        ) as sectiones
        ON sectiones.menu_item_id = menu_items.id
    ) as items
    GROUP BY items.menu_id
) as itemes
ON itemes.menu_id = menu_sections.id;


SELECT menu_items.menu_id, menu_items.id, menu_items.name, menu_items.description, menu_items.price, sectiones.item_sections FROM menu_items LEFT JOIN (SELECT item_sections.menu_item_id, ARRAY_AGG(json_build_object('id', item_sections.id, 'name', item_sections.name, 'required', item_sections.required, 'multiple', item_sections.multiple, 'item_options', item_options)) as item_sections FROM (SELECT menu_item_sections.menu_item_id, menu_item_sections.id, menu_item_sections.name, menu_item_sections.required, menu_item_sections.multiple, item_options FROM menu_item_sections LEFT JOIN (SELECT menu_item_options.menu_item_section_id, ARRAY_AGG(json_build_object('id', menu_item_options.id, 'name', menu_item_options.name, 'price', menu_item_options.price)) as item_options FROM menu_item_options GROUP BY menu_item_options.menu_item_section_id) AS item_options ON item_options.menu_item_section_id = menu_item_sections.id) as item_sections GROUP BY item_sections.menu_item_id) AS sectiones ON sectiones.menu_item_id = menu_items.id;

SELECT menu_sections.restaurant_id, menu_sections.id, menu_sections.name, itemes.items FROM menu_sections LEFT JOIN (SELECT items.menu_id, ARRAY_AGG(json_build_object('id', items.id, 'name', items.name, 'description', items.description, 'price', items.price, 'item_sections', item_sections)) AS items FROM (SELECT menu_items.menu_id, menu_items.id, menu_items.name, menu_items.description, menu_items.price, sectiones.item_sections FROM menu_items LEFT JOIN (SELECT item_sections.menu_item_id, ARRAY_AGG(json_build_object('id', item_sections.id, 'name', item_sections.name, 'required', item_sections.required, 'multiple', item_sections.multiple, 'item_options', item_options)) AS item_sections FROM (SELECT menu_item_sections.menu_item_id, menu_item_sections.id, menu_item_sections.name, menu_item_sections.required, menu_item_sections.multiple, item_options FROM menu_item_sections LEFT JOIN (SELECT menu_item_options.menu_item_section_id, ARRAY_AGG(json_build_object('id', menu_item_options.id, 'name', menu_item_options.name, 'price', menu_item_options.price)) AS item_options FROM menu_item_options GROUP BY menu_item_options.menu_item_section_id) AS item_options ON item_options.menu_item_section_id = menu_item_sections.id) AS item_sections GROUP BY item_sections.menu_item_id) AS sectiones ON sectiones.menu_item_id = menu_items.id) AS items GROUP BY items.menu_id) AS itemes ON itemes.menu_id = menu_sections.id;

CREATE TABLE email_verificiation_tokens (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour')
);

CREATE TABLE user_sessions (
    session_id VARCHAR NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_reset_tokens (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour')
);