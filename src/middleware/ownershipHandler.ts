import { Request, Response, NextFunction } from "express";
import db from "../config/db"

export async function ownershipHandler(req: Request, res: Response, next: NextFunction) {
    
    const params = req.params
    const user_id = req.session.userId

    let check
    
    if (params.restaurant_id) {
        check = (await db.query(`SELECT 1 AS access FROM (SELECT * FROM restaurant_users WHERE restaurant_id = '${params.restaurant_id}' AND user_id = '${user_id}' AND role = 'OWNER');`)).rows[0]
    } else if (params.address_id) {
        check = (await db.query(`SELECT 1 AS access FROM (SELECT user_addresses.address_id FROM user_addresses WHERE user_addresses.address_id = '${params.address_id}' AND user_addresses.user_id = '${user_id}' UNION ALL SELECT restaurant_addresses.address_id FROM restaurant_addresses JOIN restaurant_users ON restaurant_users.restaurant_id = restaurant_addresses.restaurant_id WHERE restaurant_addresses.address_id = '${params.address_id}' AND restaurant_users.user_id = '${user_id}' AND restaurant_users.role = 'OWNER') LIMIT 1;`)).rows[0]
    } else if (params.user_id && params.user_id === user_id) {
        check = { access: 1 }
    } else if (params.order_id) {
        if (req.method === "PUT" && req.body.status !== "cancelled") {
            check = (await db.query(`SELECT 1 AS access FROM (SELECT restaurant_users.restaurant_id FROM restaurant_users JOIN restaurants ON restaurants.id = restaurant_users.restaurant_id WHERE user_id = '${user_id}' AND restaurant_id = (SELECT restaurant_id FROM orders WHERE orders.id = '${params.order_id}'));`)).rows[0]
        } else {
            check = (await db.query(`SELECT 1 AS access FROM (SELECT * FROM orders WHERE user_id = '${req.session.userId}' AND id = '${params.order_id}');`)).rows[0]
        }
    } else if (params.review_id) {
            check = (await db.query(`SELECT 1 AS access FROM (SELECT * FROM reviews WHERE id = '${params.review_id}' AND user_id = '${user_id}')`)).rows[0]
    }
    
    if (!check) {
        const err = new Error("Unauthorized")
        res.status(403).json({ status: "failure", data: "Forbidden"})
        next(err)
    }
    next()
}