const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users;");

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    await db.query(
      `INSERT INTO users (username, password, email, phone) VALUES ('${username}', '${password}', '${email}', '${phone}');`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await db.query(
      `SELECT * FROM users WHERE id = '${user_id}';`
    );

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username, password, email, phone } = req.body;

    await db.query(
      `UPDATE users set username = '${username}', password = '${password}', email = '${email}', phone = '${phone}' WHERE id = '${user_id}';`
    );

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    await db.query(`DELETE FROM users WHERE id = '${user_id}'`);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
