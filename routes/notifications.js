const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM notifications;`);

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, type, description, link } = req.body;

    await db.query(
      `INSERT INTO notifications (user_id, type, description, link) VALUES ('${user_id}', '${type}', '${description}', '${link}');`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:notification_id", async (req, res) => {
  try {
    const { notification_id } = req.params;

    const result = await db.query(
      `SELECT * FROM notifications WHERE id = '${notification_id}'`
    );
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:notification_id", async (req, res) => {
  try {
    const { notification_id } = req.params;
    const { type, description, link } = req.body;

    await db.query(
      `UPDATE notifications set type = '${type}', description = '${description}', link = '${link}' WHERE id = '${notification_id}';`
    );
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:notification_id", async (req, res) => {
  try {
    const { notification_id } = req.params;

    await db.query(
      `DELETE FROM notifications WHERE id = '${notification_id}';`
    );
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
