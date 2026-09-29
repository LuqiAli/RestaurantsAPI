import { NextFunction, Request, Response } from "express"
import { menuSectionsService } from "../services/menu-sections.services";
import { menuSectionTypes } from "../schemas/menu-sections.schema";

export async function getMenuSections(req: Request, res: Response, next: NextFunction) {
    try {
        const { restaurant_id } = req.params as menuSectionTypes["getAllInput"]
        
        const result = await menuSectionsService.getAll({restaurant_id})
    
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postMenuSections(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body as menuSectionTypes["bodyInput"]
        const { restaurant_id } = req.params as menuSectionTypes["getAllInput"]
        
        await menuSectionsService.post({name, restaurant_id})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getMenuSection(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_section_id, restaurant_id } = req.params as menuSectionTypes["getInput"]
        
        const result = await menuSectionsService.get({menu_section_id, restaurant_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putMenuSection(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_section_id } = req.params as menuSectionTypes["paramInput"]
        const { name } = req.body as menuSectionTypes["bodyInput"]

        await menuSectionsService.put({menu_section_id, name})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
     }
}


export async function deleteMenuSection(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_section_id } = req.params as menuSectionTypes["paramInput"]

        await menuSectionsService.deleteS({menu_section_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}