const express = require("express");
const db = require("../db/db");
const router = express.Router();

// parse form data
router.use(express.urlencoded({ extended: false }));
// parse json
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const query = `SELECT restaurants.id, name, website, phone, ARRAY_AGG(restaurant_tags.id) AS tag_ids, ARRAY_AGG(tags.title) AS tag_titles FROM restaurants LEFT JOIN restaurant_tags ON restaurants.id = restaurant_tags.restaurant_id LEFT JOIN tags ON restaurant_tags.tag_id = tags.id GROUP BY restaurants.id;`;

    const result = await db.query(query);

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "failure", data: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { body } = req;

    let query = `WITH restIns AS (INSERT INTO restaurants(name, website, phone) VALUES('${body.name}', '${body.website}', ${body.phone}) RETURNING id as restaurant_id)`;

    if (body.tags) {
      query += ` INSERT INTO restaurant_tags(restaurant_id, tag_id) VALUES`;
      for (let i = 0; i < body.tags.length; i++) {
        query += `((SELECT restaurant_id FROM restIns), '${body.tags[i]}')`;
        i === body.tags.length - 1 ? (query += ";") : (query += ", ");
      }
    }

    await db.query(query);

    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.get("/:restaurant_id", async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const result = await db.query(
      `SELECT restaurants.id, name, website, phone, ARRAY_AGG(restaurant_tags.id) AS tag_ids, ARRAY_AGG(tags.title) AS tag_titles FROM restaurants LEFT JOIN restaurant_tags ON restaurants.id = restaurant_tags.restaurant_id LEFT JOIN tags ON restaurant_tags.tag_id = tags.id WHERE restaurants.id = '${restaurant_id}' GROUP BY restaurants.id;`
    );
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.put("/:restaurant_id", async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { name, website, phone, tags } = req.body;

    let tagValues = "";

    for (let i = 0; i < tags.length; i++) {
      tagValues += `('${restaurant_id}', '${tags[i]}')`;
      i === tags.length - 1 ? (tagValues += ";") : (tagValues += ", ");
    }

    await db.query(
      `DELETE FROM restaurant_tags WHERE restaurant_id = '${restaurant_id}'; INSERT INTO restaurant_tags(restaurant_id, tag_id) VALUES${tagValues} UPDATE restaurants SET name = '${name}', website = '${website}', phone = '${phone}' WHERE id = '${restaurant_id}';`
    );
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

router.delete("/:restaurant_id", async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    await db.query(`DELETE FROM restaurants WHERE id = '${restaurant_id}';`);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
});

module.exports = router;
