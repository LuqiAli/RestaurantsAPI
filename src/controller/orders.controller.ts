import { Request, Response } from "express"
import { OrdersInterface, OrdersInterfaceBody } from "../type/orders";
import db from "../config/db"

export async function getOrders(req: Request, res: Response) {
    try {
        const result: OrdersInterface[] = (await db.query("SELECT orders.id, orders.restaurant_id, orders.user_id, orders.is_delivery, orders.status, orders.delivery_address, orders.total_amount, (SELECT json_build_object('order_items_id', order_items.id, 'item_id', order_items.item_id, 'quantity', order_items.quantity, 'item_price', order_items.item_price) AS order_items FROM order_items) FROM orders;")).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postOrder(req: Request, res: Response) {
    try {
        const { restaurant_id, user_id, delivery_address, type, items } = req.body as OrdersInterfaceBody;

        let order_id: string
        let total_amount: number = 0
        
        for (let i = 0; i < items.length; i++) {
            total_amount += items[i].item_price
        }
    
        if (type === "delivery" && !delivery_address) {
            res.status(500).json({status: "failure", data: "Please enter delivery address for a delivery order.",}).end();
        }
        
        if (type !== "delivery") {
            order_id = (await db.query(
            `INSERT INTO orders (restaurant_id, user_id, is_delivery, total_amount) VALUES ('${restaurant_id}', '${user_id}', 'false', ${total_amount}) returning id;`
            )).rows[0].id;
        } else {
            order_id = (await db.query(
                `INSERT INTO orders (restaurant_id, user_id, delivery_address, is_delivery, total_amount) VALUES ('${restaurant_id}', '${user_id}', '${delivery_address}', true, ${total_amount}) returning id;`
            )).rows[0].id;
        }

        console.log(order_id, items[0].item_id, items[0].quantity, items[0].item_price)
        
        for (let i = 0; i < items.length; i++) {
            await db.query(`INSERT INTO order_items (order_id, item_id, quantity, item_price) VALUES ('${order_id}', '${items[i].item_id}', '${items[i].quantity}', '${items[i].item_price}');`)
        }
        
        res.status(201).json({ status: "success" });

        
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
}

export async function getOrder(req: Request, res: Response) {
    try {
        const { order_id } = req.params;
        const result: OrdersInterface = (await db.query(
            `SELECT orders.id, orders.restaurant_id, orders.user_id, orders.is_delivery, orders.status, orders.delivery_address, orders.total_amount, (SELECT json_build_object('order_items_id', order_items.id, 'item_id', order_items.item_id, 'quantity', order_items.quantity, 'item_price', order_items.item_price) AS order_items FROM order_items) FROM orders WHERE id = '${order_id}';`
            )).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function putOrder(req: Request, res: Response) {
    try {
        const { order_id } = req.params;
        const status: string = req.body.status;
    
        await db.query(
            `UPDATE orders set status = '${status}' WHERE id = '${order_id}';`
        );
        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteOrder(req: Request, res: Response) {
    try {
        const { order_id } = req.params;

        await db.query(`DELETE FROM orders WHERE id = '${order_id}';`);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}