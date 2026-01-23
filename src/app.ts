import express, { NextFunction, Request, Response } from "express"
const app = express();

import session from "express-session"
import pgSession, { PGStore } from "connect-pg-simple"
import pool from "./config/db";

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

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

import { SERVER } from "./config/config";
import { loggingHandler } from "./middleware/loggingHandler";
import { authenticate } from "./middleware/authenticate";

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Restaurants API',
      version: '1.0.0',
      description: 'Restaurants API using expressJs with SwaggerUi Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
  },
  // Paths to files containing OpenAPI annotations
  apis: ['./src/route/*.ts'],
};

// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

// logging all requests
app.use(loggingHandler)

// sessions
const pgStore = pgSession(session) 

app.use(session({
  store: new pgStore({
    pool: pool,
    createTableIfMissing: true
  }),
  name: "sessionId",
  secret: "Super_secret_key_dont_forget_to_change",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true - only allows https
    httpOnly: true, // true - prevents client JS reading cookie
    maxAge: 1000 * 60 * 30
  }
}))

const swaggerSpec = swaggerJsDoc(swaggerOptions)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/addresses", addresses);
app.use("/api/v1/users", users);
app.use("/api/v1/orders", orders);
app.use("/api/v1/menu-sections", menu_sections);
app.use("/api/v1/menu-items", menu_items);
app.use("/api/v1/menu-item-options", menu_item_options);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/auth", auth);

app.use(authenticate)

app.use("/api/v1/notifications", notifications);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(SERVER.SERVER_PORT, () => {
  console.log(`Listening on ${SERVER.SERVER_HOSTNAME} : ${SERVER.SERVER_PORT}`);
});
