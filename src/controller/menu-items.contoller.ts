import { Request, Response } from "express"
import { MenuItemsInterface, MenuItemsInterfaceBody } from "../type/menu-items"
import db from "../config/db"

export async function getMenuItems(req: Request, res: Response) {
    try {
        const result: MenuItemsInterface[] = (await db.query("SELECT * FROM menu_items;")).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postMenuItems(req: Request, res: Response) {
    try {
        const { menu_id, name, description, price } = req.body as MenuItemsInterfaceBody;

        if (!price.toString().includes(".")) {
            await db.query(
                `INSERT INTO menu_items (menu_id, name, description, price) VALUES ('${menu_id}', '${name}', '${description}', '${price}');`
            );
        } else if (price.toString().split(".")[1].length > 2) {
            res.status(400).json({ status: "failiure", data: "Price must have maximum of 2 decimal places." })
        } else {
        await db.query(
            `INSERT INTO menu_items (menu_id, name, description, price) VALUES ('${menu_id}', '${name}', '${description}', '${price}');`
        );
        res.status(201).json({ status: "success" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getMenuItem(req: Request, res: Response) {
    try {
        const { menu_item_id } = req.params;

        const result: MenuItemsInterface = (await db.query(
            `SELECT * FROM menu_items WHERE id = '${menu_item_id}';`
        )).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function putMenuItem(req: Request, res: Response) {
    try {
        const { menu_item_id } = req.params;
        const { name, description, price } = req.body as MenuItemsInterfaceBody;

        if (!price.toString().includes(".")) {
        await db.query(
            `UPDATE menu_items set name = '${name}', description = '${description}', price = '${price}' WHERE id = '${menu_item_id}';`
        );
        } else if (price.toString().split(".")[1].length > 2) {
            res.status(400).json({ status: "failiure", data: "Price must have maximum of 2 decimal places." })
        } else {
            await db.query(
                `UPDATE menu_items set name = '${name}', description = '${description}', price = '${price}' WHERE id = '${menu_item_id}';`
            );
        }
        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteMenuItem(req: Request, res: Response) {
    try {
        const { menu_item_id } = req.params;

        await db.query(`DELETE FROM menu_items WHERE id = '${menu_item_id}';`);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}