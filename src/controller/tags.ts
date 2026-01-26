import { Request, Response } from "express"

import db from "../config/db"

export async function getTags(req: Request, res: Response) {
    try {
        const result = (await db.query("SELECT * FROM tags;")).rows

        res.status(200).json({ status: "success", data: result })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function postTag(req: Request, res: Response) {
    try {
        const { title, type} = req.body

        await db.query(`INSERT INTO (title, type) VALUES ('${title}', '${type}');`)
        res.status(201).json({ status: "success" })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function getTag(req: Request, res: Response) {
    try {
        const { tag_id } = req.params

        const result = (await db.query(`SELECT * FROM tags WHERE id = '${tag_id}';`)).rows

        res.status(200).json({ status: "success", data: result })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function putTag(req: Request, res: Response) {
    try {
        const { tag_id } = req.params
        const { title, type } = req.body

        await db.query(
            `UPDATE tags set title = '${title}', type = '${type}' WHERE id = '${tag_id}';`
        );

        res.status(200).json({ status: "success" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}

export async function deleteTag(req: Request, res: Response) {
    try {
        const { tag_id } = req.params

        await db.query(`DELETE FROM tags WHERE id = '${tag_id}'`);
        res.status(204).end();
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "failure", data: "Internal Server Error" });
    }
}