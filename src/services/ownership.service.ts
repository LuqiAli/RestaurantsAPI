import db from "../db/pool"

export async function canModifyRestaurant(user_id: string, restaurant_id: string, roles: string[]) {
    const result = (await db.query(`SELECT 1 AS access FROM restaurant_users WHERE restaurant_id = '${restaurant_id}' AND user_id = '${user_id}' AND role = ANY('${roles}') LIMIT 1;`)).rows[0]
    
    return result
}

export async function ownsAddress(user_id: string, address_id: string) {
    const result = (await db.query(`SELECT 1 AS access FROM (SELECT user_addresses.address_id FROM user_addresses WHERE user_addresses.address_id = '${address_id}' AND user_addresses.user_id = '${user_id}' UNION ALL SELECT restaurant_addresses.address_id FROM restaurant_addresses JOIN restaurant_users ON restaurant_users.restaurant_id = restaurant_addresses.restaurant_id WHERE restaurant_addresses.address_id = '${address_id}' AND restaurant_users.user_id = '${user_id}' AND restaurant_users.role = 'OWNER') LIMIT 1;`)).rows[0]

    return result
}

export async function canModifyOrder(user_id: string, order_id: string, method: string, status: string) {
    let result
    
    if (method === "PUT" && status !== "cancelled") {
        result = (await db.query(`SELECT 1 AS access FROM (SELECT restaurant_users.restaurant_id FROM restaurant_users JOIN restaurants ON restaurants.id = restaurant_users.restaurant_id WHERE user_id = '${user_id}' AND restaurant_id = (SELECT restaurant_id FROM orders WHERE orders.id = '${order_id}'));`)).rows[0]
    } else {
        result = (await db.query(`SELECT 1 AS access FROM (SELECT * FROM orders WHERE user_id = '${user_id}' AND id = '${order_id}');`)).rows[0]
    }
    
    return result
}

export async function ownsReview(user_id: string, review_id: string) {
    const result = (await db.query(`SELECT 1 AS access FROM (SELECT * FROM reviews WHERE id = '${review_id}' AND user_id = '${user_id}')`)).rows[0]

    return result
}