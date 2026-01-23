import { Request, Response } from "express"
import { MenuSectionsInterface, MenuSectionsInterfaceBody } from "../type/menu-sections";
import db from "../config/db"

export async function getMenuSections(req: Request, res: Response) {
    try {
        const result: MenuSectionsInterface[] = (await db.query("SELECT * FROM menu_sections;")).rows;
    
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postMenuSections(req: Request, res: Response) {
    try {
        const { restaurant_id, name } = req.body as MenuSectionsInterfaceBody;
        await db.query(
            `INSERT INTO menu_sections (restaurant_id, name) VALUES ('${restaurant_id}', '${name}');`
        );

        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getMenuSection(req: Request, res: Response) {
    try {
        const { menu_section_id } = req.params;
        const result: MenuSectionsInterface = (await db.query(
            `SELECT * FROM menu_sections WHERE id = '${menu_section_id}';`
        )).rows;

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function putMenuSection(req: Request, res: Response) {
    try {
        const { menu_section_id } = req.params;
        const name: string = req.body.name;

        await db.query(
            `UPDATE menu_sections set name = '${name}' WHERE id = '${menu_section_id}';`
        );
        res.status(201).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
     }
}


export async function deleteMenuSection(req: Request, res: Response) {
    try {
        const { menu_section_id } = req.params;

        await db.query(
            `DELETE FROM menu_sections WHERE id = '${menu_section_id}';`
        );
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}