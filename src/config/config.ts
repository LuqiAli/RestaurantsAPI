import dotenv from "dotenv"

dotenv.config()

export const DEVELOPMENT = process.env.NODE_ENV === "development"
export const TEST = process.env.NODE_ENV === "test"

export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_HOSTNAME = process.env.DB_HOSTNAME
export const DB_PORT = process.env.DB_PORT
export const DB_DATABASE = process.env.DB_DATABASE

export const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 5000
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost"

export const SESSION_SECRET: string = process.env.SESSION_SECRET || "default_secret_key_dont_forget_to_update"

export const SERVER = {
    SERVER_PORT,
    SERVER_HOSTNAME
}

export const DB = {
    DB_USER,
    DB_PASSWORD,
    DB_HOSTNAME, 
    DB_PORT,
    DB_DATABASE
}