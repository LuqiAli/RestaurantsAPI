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

API documentation has been implemented using Swagger UI under the endpoint **/api/v1/docs**; however, I have included a basic explanation below

### Auth

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| POST | /api/v1/auth/login | Log in user | email, password |
| POST | /api/v1/auth/logout| Log out user | n/a |

### Addresses

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/addresses | Get all addresses | n/a |
| POST | /api/v1/addresses| Post new address | link_id**, type***, address_1*, address_2*, address_3*, city, town, postcode, country |
| GET | /api/v1/addresses/:id | Get address by id | n/a |
| PUT | /api/v1/addresses/:id | Update address | address_1, address_2*, address_3*, city, town, postcode, country |
| DELETE | /api/v1/addresses/:id | Delete address | n/a |

>\*Not required
>**Id which links to either the restaurant or user
>***Type of enum, only accepts either: restaurant or delivery

### Restaurants

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/restaurants | Get all restaurants | n/a |
| POST | /api/v1/restaurants| Post new restaurant | name, website, phone, tags* |
| GET | /api/v1/restaurants/:id | Get restaurant by id | n/a |
| PUT | /api/v1/restaurants/:id | Update restaurant | name, website, phone, tags* |
| DELETE | /api/v1/restaurants/:id | Delete restaurant | n/a |

>\*An array of tags, implementation for restaurant tags will be implemented at a later date

### Users

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/users | Get all users | n/a |
| POST | /api/v1/users| Post new user | name, password, email, phone |
| GET | /api/v1/users/:id | Get user by id | n/a |
| PUT | /api/v1/users/:id | Update user | name, password, email, phone |
| DELETE | /api/v1/users/:id | Delete user | n/a |

### Orders

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/orders | Get all orders | n/a |
| POST | /api/v1/orders| Post new order | restaurant_id, user_id, delivery_address, type* |
| GET | /api/v1/orders/:id | Get order by id | n/a |
| PUT | /api/v1/orders/:id | Update order | status** |
| DELETE | /api/v1/orders/:id | Delete order | n/a |

>\*Type of enum, only accepts: delivery or collection
>**Type of enum, only accepts: processing, recieved, preparing, delivery
>***Implementation of orders still work in progress

### Menu Sections

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/menu-sections | Get all menu sections | n/a |
| POST | /api/v1/menu-sections| Post new menu section | restaurant_id, name |
| GET | /api/v1/menu-sections/:id | Get menu section by id | n/a |
| PUT | /api/v1/menu-sections/:id | Update menu section | name |
| DELETE | /api/v1/menu-sections/:id | Delete menu section | n/a |

### Menu Items

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/menu-items | Get all menu items | n/a |
| POST | /api/v1/menu-items| Post new menu item | menu_id, name, description, price |
| GET | /api/v1/menu-items/:id | Get menu item by id | n/a |
| PUT | /api/v1/menu-items/:id | Update menu item | name, description, price |
| DELETE | /api/v1/menu-items/:id | Delete menu item | n/a |

### Menu Items Options

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/menu-item-options | Get all menu item options | n/a |
| POST | /api/v1/menu-item-options| Post new menu item option | menu_item_id, name, price |
| GET | /api/v1/menu-item-options/:id | Get menu item option by id | n/a |
| PUT | /api/v1/menu-item-options/:id | Update menu item option | name, price |
| DELETE | /api/v1/menu-item-options/:id | Delete menu item option | n/a |

### Notifications

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/notifications | Get all notifications | n/a |
| POST | /api/v1/notifications| Post new notification | user_id, type*, description, link |
| GET | /api/v1/notifications/:id | Get notification by id | n/a |
| PUT | /api/v1/notifications/:id | Update notification | type*, description, link |
| DELETE | /api/v1/notifications/:id | Delete notification | n/a |

>\*Type of enum, only accepts: informational, success, warning, error

### Reviews

| Method | Endpoint        | Description | Expected input in body |
|------|----------------|-------------|---------------------------|
| GET | /api/v1/reviews | Get all reviews | n/a |
| POST | /api/v1/reviews| Post new review | restaurant_id, user_id, review, rating |
| GET | /api/v1/reviews/:id | Get review by id | n/a |
| PUT | /api/v1/reviews/:id | Update review | description, link |
| DELETE | /api/v1/reviews/:id | Delete review | restaurant_id, user_id, review, rating |

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

<<<<<<< HEAD
##### Essential Implementations

- Order functionality
- Restaurant tags implementation
- Error handling

I plan to expand on this project once all other essential implementations have been added which include

- Database migration
- Authentication using email to verify a user
- More advanced logging system
=======
I plan to expand on this project once all other basic implementations have been added which include:

- Database migration
- Authentication using email to verify a user
>>>>>>> 3d3ffb069521c913a69784c6c6e701601205d423
