import { NextFunction, Request, Response } from "express"
import db from "../db/pool"
import { usersService } from "../services/users.services"
import { usersTypes } from "../schemas/users.schema";

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await usersService.getAll()

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postUser(req: Request, res: Response, next: NextFunction) {

    const client = await db.connect()
    
    try {
        const { name, password, email, phone } = req.body as usersTypes["createBodyInput"];
        
        await usersService.post({name, password, email, phone, client})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        await client.query("ROLLBACK;")
        next(err);
    } finally {
        client.release()
    }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { user_id } = req.params as usersTypes["paramInput"]
        
        const result = await usersService.get({user_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { user_id } = req.params as usersTypes["paramInput"]
        const user_id_session: usersTypes["userId"] = req.session.userId
        const { name, phone } = req.body as usersTypes["bodyInput"]

        await usersService.put({user_id, user_id_session, name, phone})

        res.status(200).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { user_id } = req.params as usersTypes["paramInput"]

        await usersService.deleteS({user_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}