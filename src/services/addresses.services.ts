import db from "../db/pool"
import { AppError } from "../utils/AppError";
import { addressSchemas, addressTypes } from "../schemas/addresses.schema";


export async function getAll() {
    const data: addressTypes["getAll"] = (await db.query("SELECT id, address_1, address_2, address_3, city, town, postcode, country FROM addresses;")).rows;

    const parsedData = addressSchemas.addressesResponseSchema.safeParse(data)

    if (!parsedData.success) {
        throw new AppError(500, "INVALID_DATABASE_RESPONSE", "Invalid data response from database")
    }
    
    return parsedData.data
}

export async function post(body: addressTypes["create"]) {
    let query: string = `WITH addIns AS (INSERT INTO addresses (address_1, address_2, address_3, city, town, postcode, country) VALUES ('${body.address_1}', '${body.address_2}', '${body.address_3}', '${body.city}', '${body.town}', '${body.postcode}', '${body.country}') RETURNING id as address_id)`;
            
        if (body.type === "user" && (!body.user_address_type || !body.is_primary)) {
            throw new AppError(400, "MISSING_REQUIRED_FIELDS", "Enter values in [user_address_type] & [is_primary] fields if address type is user")
        } else if (body.type === "user") {
            query += `INSERT INTO user_addresses (user_id, address_id, type, is_primary) VALUES ('${body.link_id}', (SELECT address_id FROM addIns), '${body.user_address_type}', ${body.is_primary});`
        } else {
            query += `INSERT INTO restaurant_addresses (restaurant_id, address_id) VALUES ('${body.link_id}', (SELECT address_id FROM addIns));`
        }

        console.log(query)

        await db.query(query);
}

export async function get(address_id: string) {
    const data: addressTypes["get"] = (await db.query(`SELECT id, address_1, address_2, address_3, city, town, postcode, country FROM addresses WHERE id = '${address_id}'`)).rows[0];

    const parsedData = addressSchemas.addressResponseSchema.safeParse(data)

    if(!parsedData.success) {
        throw new AppError(500, "INVALID_DATABASE_RESPONSE", "Invalid data response from database")
    }
    
    return parsedData.data
}

export async function put(data: addressTypes["update"]) {
    await db.query(
        `UPDATE addresses set address_1 = '${data.address_1}', address_2 = '${data.address_2}', address_3 = '${data.address_3}', city = '${data.city}', town = '${data.town}', postcode = '${data.postcode}', country = '${data.country}' WHERE id = '${data.address_id}';`
    );
}

export async function deleteS(address_id: string) {
    await db.query(`DELETE FROM addresses WHERE id = '${address_id}';`);
}

export const addressesService = {
    getAll,
    post,
    get,
    put,
    deleteS
}