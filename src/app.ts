import express from "express"
const app = express();

import restaurants from "./route/restaurants";
import addresses from "./route/addresses";
import users from "./route/users";
import orders from "./route/orders";
import menu_sections from "./route/menu-sections";
import menu_items from "./route/menu-items";
import menu_item_options from "./route/menu-item-options";
import notifications from "./route/notifications";
import reviews from "./route/reviews";
import auth from "./route/auth";
import tags from "./route/tags";

import { SERVER } from "./config/config";
import { loggingHandler } from "./middleware/loggingHandler";
import { authenticate } from "./middleware/authenticate";
import { sessionMiddleware } from "./middleware/session";
import { swaggerMiddleware } from "./config/swagger";

// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

// logging all requests
app.use(loggingHandler)

// sessions
app.use(sessionMiddleware)

// swagger ui documentation
app.use("/api/docs", swaggerMiddleware.serve, swaggerMiddleware.setup)

// routes
app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/addresses", addresses);
app.use("/api/v1/users", users);
app.use("/api/v1/orders", orders);
app.use("/api/v1/menu-sections", menu_sections);
app.use("/api/v1/menu-items", menu_items);
app.use("/api/v1/menu-item-options", menu_item_options);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/tags", tags);
app.use("/api/v1/auth", auth);

// app.use(authenticate)

app.use("/api/v1/notifications", notifications);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(SERVER.SERVER_PORT, () => {
  console.log(`Listening on ${SERVER.SERVER_HOSTNAME} : ${SERVER.SERVER_PORT}`);
});
