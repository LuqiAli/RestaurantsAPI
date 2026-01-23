const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM addresses;");
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { body } = req;
    let query;

    if (body.type === "restaurant") {
      query = `INSERT INTO addresses (restaurant_id, type, address_1, address_2, address_3, city, town, postcode, country) VALUES ('${body.link_id}', '${body.type}', '${body.address_1}', '${body.address_2}', '${body.address_3}', '${body.city}', '${body.town}', '${body.postcode}', '${body.country}');`;
    } else {
      query = `INSERT INTO addresses (user_id, type, address_1, address_2, address_3, city, town, postcode, country) VALUES ('${body.link_id}', '${body.type}', '${body.address_1}', '${body.address_2}', '${body.address_3}', '${body.city}', '${body.town}', '${body.postcode}', '${body.country}');`;
    }

    await db.query(query);

    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:address_id", async (req, res) => {
  try {
    const { address_id } = req.params;

    const result = await db.query(
      `SELECT * FROM addresses WHERE id = '${address_id}'`
    );
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:address_id", async (req, res) => {
  try {
    const { address_id } = req.params;
    const { address_1, address_2, address_3, city, town, postcode, country } =
      req.body;

    await db.query(
      `UPDATE addresses set address_1 = '${address_1}', address_2 = '${address_2}', address_3 = '${address_3}', city = '${city}', town = '${town}', postcode = '${postcode}', country = '${country}' WHERE id = '${address_id}';`
    );

    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:address_id", async (req, res) => {
  try {
    const { address_id } = req.params;

    await db.query(`DELETE FROM addresses WHERE id = '${address_id}';`);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
