import { NextFunction, Request, Response } from "express"
import { tagsService } from "../services/tags.services";
import { tagsTypes } from "../schemas/tags.schema";

export async function getTags(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await tagsService.getAll()

        res.status(200).json({ status: "success", data: result })
    } catch (err) {
        next(err);
    }
}

export async function postTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, type } = req.body as tagsTypes["createInput"] 

        await tagsService.post({title, type})
        
        res.status(201).json({ status: "success" })
        
    } catch (err) {
        next(err);
    }
}

export async function getTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { tag_id } = req.params as tagsTypes["paramInput"]

        const result = await tagsService.get({tag_id})

        res.status(200).json({ status: "success", data: result })
    } catch (err) {
        next(err);
    }
}

export async function putTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { tag_id } = req.params as tagsTypes["paramInput"]
        const { title, type } = req.body as tagsTypes["createInput"]

        await tagsService.put({title, type, tag_id})

        res.status(200).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
        const { tag_id } = req.params as tagsTypes["paramInput"]

        await tagsService.deleteS({tag_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}