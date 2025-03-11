const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM reviews;`);

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { restaurant_id, user_id, rating, review } = req.body;

    await db.query(
      `INSERT INTO reviews (restaurant_id, user_id, rating, review) VALUES ('${restaurant_id}', '${user_id}', '${rating}', '${review}');`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:review_id", async (req, res) => {
  try {
    const { review_id } = req.params;

    const result = await db.query(
      `SELECT * FROM reviews WHERE id = '${review_id}';`
    );
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:review_id", async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, review } = req.body;

    await db.query(
      `UPDATE reviews set rating = '${rating}', review = '${review}' WHERE id = '${review_id}';`
    );
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:review_id", async (req, res) => {
  try {
    const { review_id } = req.params;

    await db.query(`DELETE FROM reviews WHERE id = '${review_id}';`);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
