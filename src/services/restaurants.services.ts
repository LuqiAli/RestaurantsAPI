import db from "../db/pool"
import { restaurantsTypes } from "../schemas/restaurants.schema";

export async function getAll() {
    const query: string = `SELECT t1.id, t1.name, t1.website, t1.phone, t1.tags, t2.address,t3.avg_rating FROM (SELECT  restaurants.id,  restaurants.name, restaurants.website, restaurants.phone, tags FROM restaurants LEFT JOIN (SELECT restaurant_tags.restaurant_id, ARRAY_AGG(json_build_object('id', restaurant_tags.tag_id, 'title', tags.title, 'type', tags.type)) as tags FROM restaurant_tags LEFT JOIN tags ON restaurant_tags.tag_id = tags.id GROUP BY restaurant_tags.restaurant_id) as tags ON restaurants.id = tags.restaurant_id) as t1 LEFT JOIN (SELECT restaurants.id, address FROM restaurants LEFT JOIN (SELECT restaurant_addresses.restaurant_id, ARRAY_AGG(json_build_object('id', addresses.id, 'address_1', addresses.address_1, 'address_2', addresses.address_2, 'address_3', addresses.address_3, 'city', addresses.city, 'town', addresses.town, 'postcode', addresses.postcode, 'country', addresses.country)) as address FROM restaurant_addresses LEFT JOIN addresses ON restaurant_addresses.address_id = addresses.id GROUP BY restaurant_addresses.restaurant_id) as addresse ON restaurants.id = addresse.restaurant_id) as t2 ON t1.id = t2.id LEFT JOIN (SELECT  restaurants.id,  COALESCE(AVG(reviews.rating)::NUMERIC(10, 1), 0) as avg_rating FROM restaurants LEFT JOIN reviews ON restaurants.id = reviews.restaurant_id GROUP BY restaurants.id) as t3 ON t1.id = t3.id;`;
        
    const result: restaurantsTypes["restaurantsReponse"] = (await db.query(query)).rows;
    return result
}

export async function post(inputData: restaurantsTypes["createInput"]) {
    let query: string = `WITH restIns AS (INSERT INTO restaurants(name, website, phone) VALUES('${inputData.body.name}', '${inputData.body.website}', ${inputData.body.phone}) RETURNING id as restaurant_id),`;
  
    if (inputData.body.tags) {
        query += ` restIns2 AS (INSERT INTO restaurant_tags(restaurant_id, tag_id) VALUES`;
        for (let i = 0; i < inputData.body.tags.length; i++) {
            query += `((SELECT restaurant_id FROM restIns), '${inputData.body.tags[i]}')`;
            i === inputData.body.tags.length - 1 ? (query += ")") : (query += ", ");
        }
    }

    query += ` INSERT INTO restaurant_users (restaurant_id, user_id, role) VALUES ((SELECT restaurant_id FROM restIns), '$inputData.user_id}', 'OWNER');`
    
    // console.log(query)

    await db.query(query);
}

export async function get(inputData: restaurantsTypes["paramInput"]) {
    const result: restaurantsTypes["restaurantReponse"] = (await db.query(
        `SELECT t1.id, t1.name, t1.website, t1.phone, t1.tags, t2.address,t3.avg_rating FROM (SELECT  restaurants.id,  restaurants.name, restaurants.website, restaurants.phone, tags FROM restaurants LEFT JOIN (SELECT restaurant_tags.restaurant_id, ARRAY_AGG(json_build_object('id', restaurant_tags.tag_id, 'title', tags.title, 'type', tags.type)) as tags FROM restaurant_tags LEFT JOIN tags ON restaurant_tags.tag_id = tags.id GROUP BY restaurant_tags.restaurant_id) as tags ON restaurants.id = tags.restaurant_id) as t1 LEFT JOIN (SELECT restaurants.id, address FROM restaurants LEFT JOIN (SELECT restaurant_addresses.restaurant_id, ARRAY_AGG(json_build_object('id', addresses.id, 'address_1', addresses.address_1, 'address_2', addresses.address_2, 'address_3', addresses.address_3, 'city', addresses.city, 'town', addresses.town, 'postcode', addresses.postcode, 'country', addresses.country)) as address FROM restaurant_addresses LEFT JOIN addresses ON restaurant_addresses.address_id = addresses.id GROUP BY restaurant_addresses.restaurant_id) as addresse ON restaurants.id = addresse.restaurant_id) as t2 ON t1.id = t2.id LEFT JOIN (SELECT  restaurants.id,  COALESCE(AVG(reviews.rating)::NUMERIC(10, 1), 0) as avg_rating FROM restaurants LEFT JOIN reviews ON restaurants.id = reviews.restaurant_id GROUP BY restaurants.id) as t3 ON t1.id = t3.id WHERE t1.id = '${inputData.restaurant_id}';`
    )).rows;
    return result
}

export async function put(inputData: restaurantsTypes["updateInput"]) {
    let tagValues = "";
    
    for (let i = 0; i < inputData.tags.length; i++) {
        tagValues += `('${inputData.restaurant_id}', '${inputData.tags[i]}')`;
        i === inputData.tags.length - 1 ? (tagValues += ";") : (tagValues += ", ");
    }

    await db.query(
        `DELETE FROM restaurant_tags WHERE restaurant_id = '${inputData.restaurant_id}'; INSERT INTO restaurant_tags(restaurant_id, tag_id) VALUES${tagValues}; UPDATE restaurants SET name = '${inputData.name}', website = '${inputData.website}', phone = '${inputData.phone}' WHERE id = '${inputData.restaurant_id}';`
    );
}

export async function deleteS(inputData: restaurantsTypes["paramInput"]) {
    await db.query(`DELETE FROM restaurants WHERE id = '${inputData.restaurant_id}';`);
}

export const restaurantsService = {
    getAll,
    post,
    get,
    put,
    deleteS
}