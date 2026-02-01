import session from "express-session"
import pgSession from "connect-pg-simple"
import pool from "../config/db";
import { SESSION_SECRET } from "../config/config";

const pgStore = pgSession(session) 

export const sessionMiddleware = session({
    store: new pgStore({
        pool: pool,
        createTableIfMissing: true,
        pruneSessionInterval: 600
    }),
    name: "sessionId",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true - only allows https
        httpOnly: false, // true - prevents client JS reading cookie
        maxAge: 1000 * 60 * 30
    }
})