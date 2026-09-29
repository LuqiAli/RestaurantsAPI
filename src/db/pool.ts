const { Pool } = require("pg");
import { DB } from "../config/env"

const pool = new Pool({
  user: DB.DB_USER,
  password: DB.DB_PASSWORD,
  host: DB.DB_HOSTNAME,
  port: DB.DB_PORT,
  database: DB.DB_DATABASE,
});

export default pool