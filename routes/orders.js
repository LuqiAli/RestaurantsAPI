const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders;");
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { restaurant_id, user_id, delivery_address, type } = req.body;

    if (type === "delivery" && !delivery_address) {
      res
        .status(500)
        .json({
          status: "failure",
          data: "Please enter delivery address for a delivery order.",
        })
        .end();
      console.log("him");
    } else if (type !== "delivery") {
      await db.query(
        `INSERT INTO orders (restaurant_id, user_id, type) VALUES ('${restaurant_id}', '${user_id}', '${type}');`
      );
      res.status(201).json({ status: "success" });
    } else {
      await db.query(
        `INSERT INTO orders (restaurant_id, user_id, delivery_address, type) VALUES ('${restaurant_id}', '${user_id}', '${delivery_address}', '${type}');`
      );
      res.status(201).json({ status: "success" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;
    const result = await db.query(
      `SELECT * FROM orders WHERE id = '${order_id}';`
    );

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    await db.query(
      `UPDATE orders set status = '${status}' WHERE id = '${order_id}';`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;

    await db.query(`DELETE FROM orders WHERE id = '${order_id}';`);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
