import { Request, Response } from "express"
import { UsersInterface, UsersInterfaceBody } from "../type/users"
import bcrypt from "bcrypt"
import db from "../config/db"

export async function getUsers(req: Request, res: Response) {
    try {
        const result: UsersInterface[] = (await db.query("SELECT * FROM users;")).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postUser(req: Request, res: Response) {
    try {
        const { name, password, email, phone } = req.body as UsersInterfaceBody;

        const hashedPass = await bcrypt.hash(password, 10)

        await db.query(
            `INSERT INTO users (name, password, email, phone) VALUES ('${name}', '${hashedPass}', '${email}', '${phone}');`
        );
        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const result: UsersInterface = (await db.query(
            `SELECT * FROM users WHERE id = '${user_id}';`
        )).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function putUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const { name, password, email, phone } = req.body as UsersInterfaceBody;

        const hashedPass = await bcrypt.hash(password, 10)
        
        await db.query(
            `UPDATE users set name = '${name}', password = '${hashedPass}', email = '${email}', phone = '${phone}' WHERE id = '${user_id}';`
        );

        res.status(200).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const { user_id } = req.params;

        await db.query(`DELETE FROM users WHERE id = '${user_id}'`);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}