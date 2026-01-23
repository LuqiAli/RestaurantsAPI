import { Request, Response, NextFunction} from "express"
import { NotificationsInterface, NotificationsInterfaceBody } from "../type/notifications";
import db from "../config/db"

export async function getNotifications(req: Request, res: Response) {
    try {
        const result: NotificationsInterface[] = (await db.query(`SELECT * FROM notifications;`)).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postNotification(req: Request, res: Response) {
    try {
        const { user_id, type, description, link } = req.body as NotificationsInterfaceBody;

        await db.query(
            `INSERT INTO notifications (user_id, type, description, link) VALUES ('${user_id}', '${type}', '${description}', '${link}');`
        );
        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getNotification(req: Request, res: Response) {
    try {
        const { notification_id } = req.params;

        const result: NotificationsInterface = (await db.query(
            `SELECT * FROM notifications WHERE id = '${notification_id}'`
        )).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function putNotification(req: Request, res: Response) {
    try {
        const { notification_id } = req.params;
        const { type, description, link } = req.body as NotificationsInterfaceBody;

        await db.query(
            `UPDATE notifications set type = '${type}', description = '${description}', link = '${link}' WHERE id = '${notification_id}';`
        );
        res.status(200).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteNotification(req: Request, res: Response) {
    try {
        const { notification_id } = req.params;

        await db.query(
            `DELETE FROM notifications WHERE id = '${notification_id}';`
        );
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}