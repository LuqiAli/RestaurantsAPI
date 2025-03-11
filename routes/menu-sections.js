const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM menu_sections;");
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { restaurant_id, name } = req.body;
    await db.query(
      `INSERT INTO menu_sections (restaurant_id, name) VALUES ('${restaurant_id}', '${name}');`
    );

    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:menu_sections_id", async (req, res) => {
  try {
    const { menu_sections_id } = req.params;
    const result = await db.query(
      `SELECT * FROM menu_sections WHERE id = '${menu_sections_id}';`
    );

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:menu_sections_id", async (req, res) => {
  try {
    const { menu_sections_id } = req.params;
    const { name } = req.body;

    await db.query(
      `UPDATE menu_sections set name = '${name}' WHERE id = '${menu_sections_id}';`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:menu_sections_id", async (req, res) => {
  try {
    const { menu_sections_id } = req.params;

    await db.query(
      `DELETE FROM menu_sections WHERE id = '${menu_sections_id}';`
    );
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
