import { Request, Response, NextFunction} from "express"
import { OrdersInterface, OrdersInterfaceBody } from "../type/orders";
import db from "../config/db"

export async function getOrders(req: Request, res: Response) {
    try {
        const result: OrdersInterface[] = (await db.query("SELECT * FROM orders;")).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postOrder(req: Request, res: Response) {
    try {
        const { restaurant_id, user_id, delivery_address, type } = req.body as OrdersInterfaceBody;
    
        if (type === "delivery" && !delivery_address) {
            res.status(500).json({status: "failure", data: "Please enter delivery address for a delivery order.",}).end();
        } else if (type !== "delivery") {
            await db.query(
            `INSERT INTO orders (restaurant_id, user_id, is_delivery) VALUES ('${restaurant_id}', '${user_id}', 'false');`
            );
            res.status(201).json({ status: "success" });
        } else {
            await db.query(
                `INSERT INTO orders (restaurant_id, user_id, delivery_address, is_delivery) VALUES ('${restaurant_id}', '${user_id}', '${delivery_address}', true);`
            );
        res.status(201).json({ status: "success" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failure", data: "Internal Server Error" });
  }
}

export async function getOrder(req: Request, res: Response) {
    try {
        const { order_id } = req.params;
        const result: OrdersInterface = (await db.query(
            `SELECT * FROM orders WHERE id = '${order_id}';`
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