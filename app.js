const express = require("express");
const app = express();

const restaurants = require("./routes/restaurants.js");
const addresses = require("./routes/addresses.js");
const users = require("./routes/users.js");
const orders = require("./routes/orders.js");
const menu_sections = require("./routes/menu-sections.js");
const menu_items = require("./routes/menu-items.js");
const notifications = require("./routes/notifications.js");
const reviews = require("./routes/reviews.js");

app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/addresses", addresses);
app.use("/api/v1/users", users);
app.use("/api/v1/orders", orders);
app.use("/api/v1/menu-sections", menu_sections);
app.use("/api/v1/menu-items", menu_items);
app.use("/api/v1/notifications", notifications);
app.use("/api/v1/reviews", reviews);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(5000, () => {
  console.log("Listening on port: 5000");
});
