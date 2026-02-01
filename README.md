# SwiftGrubAPI

A Rest API for managing restaurant orders, including user management, authentication and sessions

## How it's made

**Tech used:** Javascript, Node.js, Typescript, PostgreSQL, Express, Express-session

This project was created to help fully understand the fundemantals of Node.js and Express.js by creating a Rest API. I chose express.js as it is a lightweight, efficient and stable framework for backend API development. I chose Typescript as it reduces the amount of bugs during compilation time as oppose to runtime due to the static typing making the expected values more predictable. PostgreSQL was my first choice for a relational database system as it is highly reliable and offers support for complex queries, datasets and data types such as JSONB as well as custom types. When it came to authentication I decided to go with sessions for a few reasons; it is much easier to invalidate a session with simpler logout logic and more secure as there is as there is nothing stored in JavaScript and less data stored.

## Getting Started

```bash
git clone https://github.com/LuqiAli/RestaurantsAPI.git
cd RestaurantsAPI
npm install
```

### Environment Variables 

Create a '.env' file in the root directory and include the variables below:

```env
# Database credentials
DB_USER
DB_PASSWORD
DB_HOSTNAME
DB_PORT
DB_DATABASE

# Server 
SERVER_PORT # Defaulted to 5000
SERVER_HOSTNAME # Defaulted to "localhost"

# Sessions
SESSION_SECRET # Defaulted to "default_secret_key_dont_forget_to_update"
```

### Running The API

##### Development
```bash
npm run dev
```
##### Production
```bash
npm run build
npm start
```

## API Endpoints

API documentation has been implemented using Swagger UI under the endpoint _**/api/v1/docs**_; however, I have included a basic explanation below

### Auth

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| POST | /api/v1/auth/login | Log in user | email, password |
| POST | /api/v1/auth/logout| Log out user | n/a |

### Addresses

| Method | Endpoint        | Authentication | Authorization role | Checks | Description | Expected input in body |
|------|----------------|-------------------|--------------------|--------|-------------|------------------------|
| GET | /api/v1/addresses | Yes | SUPER-ADMIN | n/a | Get all addresses | n/a |
| POST | /api/v1/addresses| Yes | USER | n/a |Post new address | link_id**, type***, address_1*, address_2*, address_3*, city, town, postcode, country |
| GET | /api/v1/addresses/:id | Yes | USER | If address belongs to authenticated user | Get address by id | n/a |
| PUT | /api/v1/addresses/:id | Yes | USER | If address belongs to authenticated user | Update address | address_1, address_2*, address_3*, city, town, postcode, country |
| DELETE | /api/v1/addresses/:id | Yes | USER | If address belongs to authenticated user | Delete address | n/a |

>\*Not required
>**Id which links to either the restaurant or user
>***Type of enum, only accepts either: restaurant or delivery

### Restaurants

| Method | Endpoint    | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|---------------|---------------|--------|-------------|---------------------------|
| GET | /api/v1/restaurants | n/a | n/a | n/a | Get all restaurants | n/a |
| POST | /api/v1/restaurants| Yes | USER | n/a | Post new restaurant | name, website, phone, tags* |
| GET | /api/v1/restaurants/:id | n/a | n/a | n/a | Get restaurant by id | n/a |
| PUT | /api/v1/restaurants/:id | Yes | USER | If restaurant belongs to authenticated user | Update restaurant | name, website, phone, tags* |
| DELETE | /api/v1/restaurants/:id | Yes | USER | If restaurant belongs to authenticated user | Delete restaurant | n/a |

>\*An array of tags, implementation for restaurant tags will be implemented at a later date

### Users

| Method | Endpoint    | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|--------------|----------|--------|-----------|---------------------------|
| GET | /api/v1/users | yes | SUPER-ADMIN | n/a | Get all users | n/a |
| POST | /api/v1/users| n/a | n/a | n/a | Post new user | name, password, email, phone |
| GET | /api/v1/users/:id | Yes | USER | If user belongs to authenticated user | Get user by id | n/a |
| PUT | /api/v1/users/:id | Yes | USER | If user belongs to authenticated user | Update user | name, password, email, phone |
| DELETE | /api/v1/users/:id | Yes | USER | If user belongs to authenticated user | Delete user | n/a |

### Orders

| Method | Endpoint    | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|-------------|----------------------|--------|-----------|----------|
| GET | /api/v1/orders | Yes | SUPER-ADMIN | n/a | Get all orders | n/a |
| POST | /api/v1/orders| Yes | USER | n/a | Post new order | restaurant_id, user_id, delivery_address, type*, items** |
| GET | /api/v1/orders/:id | Yes | USER | If order belongs to authenticated user | Get order by id | n/a |
| PUT | /api/v1/orders/:id | Yes | USER | If order or restaurant belongs to authenticated user**** | Update order | status*** |
| DELETE | /api/v1/orders/:id | Yes | SUPER-ADMIN | n/a | Delete order | n/a |

>\*Type of enum, only accepts: delivery or collection
>**Type of array containing objects: [{item_id, quantity, item_price}]
>***Type of enum, only accepts: processing, recieved, preparing, delivery, cancelled
>****If status is anything but "cancelled" restaurant owner can modify

### Tags

| Method | Endpoint    | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|-------------|---------------------|---------|-------------|------------------------|
| GET | /api/v1/tags | n/a | n/a | n/a | Get all tags | n/a |
| POST | /api/v1/tags| Yes | SUPER-ADMIN | n/a | Post new tag | title, type* |
| GET | /api/v1/tags/:id | Yes | SUPER-ADMIN | n/a | Get tag by id | n/a |
| PUT | /api/v1/tags/:id | Yes | SUPER-ADMIN | n/a | Update tag | title, type* |
| DELETE | /api/v1/tags/:id | Yes | SUPER-ADMIN | n/a | Delete tag | n/a |

>\*Type of enum, only accepts: cuisine, dietary, dishes, type

### Menu Sections

| Method | Endpoint | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|-------------|---------------------------|--|-------|--------------|
| GET | /api/v1/restaurants/:restaurant_id/menu-sections | n/a | n/a | n/a | Get all menu sections | n/a |
| POST | /api/v1/restaurants/:restaurant_id/menu-sections| Yes | USER | If authenticated user owns restaurant | Post new menu section | restaurant_id, name |
| GET | /api/v1/restaurants/:restaurant_id/menu-sections/:id | n/a | n/a | n/a | Get menu section by id | n/a |
| PUT | /api/v1/restaurants/:restaurant_id/menu-sections/:id | Yes | USER | If authenticated user owns restaurant | Update menu section | name |
| DELETE | /api/v1/restaurants/:restaurant_id/menu-sections/:id | Yes | USER | If authenticated user owns restaurant | Delete menu section | n/a |

### Menu Items

| Method | Endpoint | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|-------------|-------------------|--------|---------|-------------------|
| GET | /api/v1/restaurants/:restaurant_id/menu-items | n/a | n/a | n/a | Get all menu items | n/a |
| POST | /api/v1/restaurants/:restaurant_id/menu-items| Yes | USER | If authenticated user owns restaurant | Post new menu item | menu_id, name, description, price |
| GET | /api/v1/restaurants/:restaurant_id/menu-items/:id | n/a | n/a | n/a | Get menu item by id | n/a |
| PUT | /api/v1/restaurants/:restaurant_id/menu-items/:id | Yes | USER | If authenticated user owns resataurant | Update menu item | name, description, price |
| DELETE | /api/v1/restaurants/:restaurant_id/menu-items/:id | Yes | USER | If authenticated user owns restaurant | Delete menu item | n/a |

### Menu Items Options

| Method | Endpoint  | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|-------------|--------------------|-------|----------------|-------------|
| GET | /api/v1/menu-item-options | n/a | n/a | n/a | Get all menu item options | n/a |
| POST | /api/v1/menu-item-options| Yes | USER | If authenticated user owns restaurant | Post new menu item option | menu_item_id, name, price |
| GET | /api/v1/menu-item-options/:id | n/a | n/a | n/a | Get menu item option by id | n/a |
| PUT | /api/v1/menu-item-options/:id | Yes | USER | If authenticated user owns resataurant | Update menu item option | name, price |
| DELETE | /api/v1/menu-item-options/:id | Yes | USER | If authenticated user owns restaurant | Delete menu item option | n/a |

### Reviews

| Method | Endpoint | Authentication | Authorization Role | Checks | Description | Expected input in body |
|------|----------------|-------------|-------------------|--------|------------|---------------|
| GET | /api/v1/reviews | n/a | n/a | n/a | Get all reviews | n/a |
| POST | /api/v1/reviews| Yes | USER | n/a | Post new review | restaurant_id, user_id, review, rating |
| GET | /api/v1/reviews/:id | n/a | n/a | n/a | Get review by id | n/a |
| PUT | /api/v1/reviews/:id | Yes | USER | If authenticated user owns review | Update review | description, link |
| DELETE | /api/v1/reviews/:id | Delete review | Yes | USER | If authenticated user owns review | n/a |

### Notifications

Currently the notifications endpoint is not functional.

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/notifications | Get all notifications | n/a |
| POST | /api/v1/notifications| Post new notification | user_id, type*, description, link, is_read |
| GET | /api/v1/notifications/:id | Get notification by id | n/a |
| PUT | /api/v1/notifications/:id | Update notification | type*, description, link, is_read |
| DELETE | /api/v1/notifications/:id | Delete notification | n/a |

>\*Type of enum, only accepts: informational, success, warning, error

## Authentication

This API uses session-based authentication with cookies.

- Sessions are stored in PostgreSQL database
- HttpOnly cookies
- Session expires after 30 minutes

## Error Handling

Error handling has not been fully implemented as of yet; however, some errors have been implemented via json in the following format
```json
{
    status: "failure", data: "Error message" 
}
```

## Testing

Testing has not yet been implemented as of yet

## Features To Be Added

#### Essential Implementations

- Error handling
- Testing

#### Non Essential Implementations

I plan to expand on this project once all other essential implementations have been added which include

- Database migration
- Authentication using email to verify a user
- More advanced logging system
