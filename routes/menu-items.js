const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM menu_items;");

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { menu_id, name, description, price } = req.body;

    await db.query(
      `INSERT INTO menu_items (menu_id, name, description, price) VALUES ('${menu_id}', '${name}', '${description}', '${price}');`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:menu_items_id", async (req, res) => {
  try {
    const { menu_items_id } = req.params;

    const result = await db.query(
      `SELECT * FROM menu_items WHERE id = '${menu_items_id}';`
    );
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:menu_items_id", async (req, res) => {
  try {
    const { menu_items_id } = req.params;
    const { name, description, price } = req.body;

    await db.query(
      `UPDATE menu_items set name = '${name}', description = '${description}', price = '${price}' WHERE id = '${menu_items_id}';`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:menu_items_id", async (req, res) => {
  try {
    const { menu_items_id } = req.params;

    await db.query(`DELETE FROM menu_items WHERE id = '${menu_items_id}';`);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
