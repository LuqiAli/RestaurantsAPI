import { NextFunction, Request, Response } from "express"
import db from "../db/pool"
import { notificationTypes } from "../schemas/notifications.schema";

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
        const result: notificationTypes["notificationsResponse"] = (await db.query(`SELECT id, user_id, type, description, link, is_read FROM notifications;`)).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postNotification(req: Request, res: Response, next: NextFunction) {
    try {
        const { user_id, type, description, link, is_read } = req.body as notificationTypes["createInput"];

        await db.query(
            `INSERT INTO notifications (user_id, type, description, link, is_read) VALUES ('${user_id}', '${type}', '${description}', '${link}', '${is_read}');`
        );
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getNotification(req: Request, res: Response, next: NextFunction) {
    try {
        const { notification_id } = req.params as notificationTypes["getInput"];

        const result: notificationTypes["notificationResponse"] = (await db.query(
            `SELECT id, user_id, type, description, link, is_read FROM notifications WHERE id = '${notification_id}'`
        )).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putNotification(req: Request, res: Response, next: NextFunction) {
    try {
        const { notification_id } = req.params as notificationTypes["getInput"];
        const { type, description, link, is_read } = req.body as notificationTypes["bodyInput"];

        await db.query(
            `UPDATE notifications set type = '${type}', description = '${description}', link = '${link}', is_read = '${is_read}' WHERE id = '${notification_id}';`
        );
        res.status(200).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
        const { notification_id } = req.params as notificationTypes["getInput"];

        await db.query(
            `DELETE FROM notifications WHERE id = '${notification_id}';`
        );
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}