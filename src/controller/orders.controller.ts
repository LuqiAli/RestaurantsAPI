import { NextFunction, Request, Response } from "express"
import db from "../db/pool"
import { ordersService } from "../services/orders.services";
import { ordersTypes } from "../schemas/orders.schema";

export async function getOrders(req: Request, res: Response, next: NextFunction) {
    try {
        
        const result = await ordersService.getAll()

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postOrder(req: Request, res: Response, next: NextFunction) {

    const client = await db.connect()
    
    try {
        const { restaurant_id, is_delivery, items } = req.body as ordersTypes["bodyInput"];
        const user_id: ordersTypes["user_id_type"] = req.session.userId

        await ordersService.post({restaurant_id, is_delivery, items, user_id, client})

        res.status(201).json({ status: "success" });

        
    } catch (err) {
        await client.query("ROLLBACK")
        next(err);
    } finally {
        client.release()
    }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { order_id } = req.params as ordersTypes["order_idInput"]
        
        const result = await ordersService.get({order_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { order_id } = req.params as ordersTypes["order_idInput"]
        const { status } = req.body as ordersTypes["updateBodyInput"]
    
        await ordersService.put({order_id, status})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const { order_id } = req.params as ordersTypes["order_idInput"]

        await ordersService.deleteS({order_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}