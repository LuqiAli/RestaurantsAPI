import { Request, Response } from "express"
import { MenuItemOptionsInterface, MenuItemOptionsInterfaceBody } from "../type/menu-item-options";
import db from "../config/db"

export async function getMenuItemOptions(req: Request, res: Response) {
    try {
        const result: MenuItemOptionsInterface[] = (await db.query("SELECT * FROM menu_item_options;")).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postMenuItemOptions(req: Request, res: Response) {
    try {
        const { menu_item_id, name, price } = req.body as MenuItemOptionsInterfaceBody;

        if (!price.toString().includes(".")) {
            await db.query(
                `INSERT INTO menu_item_options (menu_item_id, name, price) VALUES ('${menu_item_id}', '${name}', '${price}');`
            );
        } else if (price.toString().split(".")[1].length > 2) {
            res.status(400).json({ status: "failiure", data: "Price must have maximum of 2 decimal places." })
        } else {
            await db.query(
                `INSERT INTO menu_item_options (menu_item_id, name, price) VALUES ('${menu_item_id}', '${name}', '${price}');`
            );
        }
        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getMenuItemOption(req: Request, res: Response) {
    try {
        const { menu_item_option_id } = req.params;

        const result: MenuItemOptionsInterface = (await db.query(
            `SELECT * FROM menu_item_options WHERE id = '${menu_item_option_id}';`
        )).rows;
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}
export async function putMenuItemOptions(req: Request, res: Response) {
    try {
        const { menu_item_option_id } = req.params;
        const { name, price } = req.body as MenuItemOptionsInterfaceBody;
    
        if (!price.toString().includes(".")) {
            await db.query(
                `UPDATE menu_item_options set name = '${name}', price = '${price}' WHERE id = '${menu_item_option_id}';`
            );
        } else if (price.toString().split(".")[1].length > 2) {
            res.status(400).json({ status: "failiure", data: "Price must have maximum of 2 decimal places." })
        } else {
        await db.query(
            `UPDATE menu_item_options set name = '${name}', price = '${price}' WHERE id = '${menu_item_option_id}';`
        );
        }
        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteMenuItemOptions(req: Request, res: Response) {
    try {
        const { menu_item_option_id } = req.params;

        await db.query(`DELETE FROM menu_item_options WHERE id = '${menu_item_option_id}';`);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}