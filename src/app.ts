import express from "express"
const app = express();

// Routes
import restaurants from "./route/restaurants.route";
import addresses from "./route/addresses.route";
import users from "./route/users.route";
import orders from "./route/orders.route";
import menu_sections from "./route/menu-sections.route";
import menu_items from "./route/menu-items.route";
import menu_item_sections from "./route/menu-item-sections.route";
import menu_item_options from "./route/menu-item-options.route";
import notifications from "./route/notifications.route";
import reviews from "./route/reviews.route";
import auth from "./route/auth.route";
import tags from "./route/tags.route"

// Configurations
import { SERVER } from "./config/env";
import { loggingHandler } from "./middleware/loggingHandler";
import { sessionMiddleware } from "./config/session";
import { swaggerMiddleware } from "./config/swagger";
import { corsMiddleware } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";

// Parse form data
app.use(express.urlencoded({ extended: false }));

// Parse json
app.use(express.json());

// CORS 
app.use(corsMiddleware)

// Request Logger
app.use(loggingHandler)

// Sessions
app.use(sessionMiddleware)

// Swagger UI documentation
app.use("/api/docs", swaggerMiddleware.serve, swaggerMiddleware.setup)

// Routes
app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/addresses", addresses);
app.use("/api/v1/users", users);
app.use("/api/v1/orders", orders);
app.use("/api/v1/restaurants/:restaurant_id/menu-sections", menu_sections);
app.use("/api/v1/restaurants/:restaurant_id/menu-sections/:menu_section_id/menu-items", menu_items);
app.use("/api/v1/restaurants/:restaurant_id/menu-sections/:menu_section_id/menu-items/:menu_item_id/menu-item-sections", menu_item_sections);
app.use("/api/v1/restaurants/:restaurant_id/menu-sections/:menu_section_id/menu-items/:menu_item_id/menu-item-sections/:menu_item_section_id/menu-item-options", menu_item_options);
app.use("/api/v1/tags", tags);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/notifications", notifications);

// Error handling
app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(SERVER.SERVER_PORT, () => {
  console.log(`Listening on ${SERVER.SERVER_HOSTNAME}: ${SERVER.SERVER_PORT}`);
});
