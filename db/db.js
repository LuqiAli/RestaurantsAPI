const { query } = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "luqman110",
  host: "localhost",
  port: 5433,
  database: "restaurants_db",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
