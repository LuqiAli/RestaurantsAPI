import { NextFunction, Request, Response } from "express"
import { menuItemSectionService } from "../services/menu-item-sections.services";
import { menuItemSectionsTypes } from "../schemas/menu-item-sections.schema";

export async function getMenuItemSections(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_id } = req.params as menuItemSectionsTypes["menu_item_idInputSchema"]
        
        const result = await menuItemSectionService.getAll({menu_item_id})
    
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postMenuItemSections(req: Request, res: Response, next: NextFunction) {
    try {                                                                                           
        const { name, required, multiple } = req.body as menuItemSectionsTypes["bodyInputSchema"];
        const { restaurant_id, menu_item_id } = req.params as menuItemSectionsTypes["paramInputSchema"]
        
       await menuItemSectionService.post({name, required, multiple, restaurant_id, menu_item_id})

        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getMenuItemSection(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_section_id, restaurant_id, menu_item_id } = req.params as menuItemSectionsTypes["paramsInputSchema"]
        
        const result = await menuItemSectionService.get({menu_item_section_id, restaurant_id, menu_item_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putMenuItemSection(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_section_id } = req.params as menuItemSectionsTypes["menu_item_section_idInputSchema"]
        const { name, required, multiple } = req.body as menuItemSectionsTypes["bodyInputSchema"]

        await menuItemSectionService.put({menu_item_section_id, name, required, multiple})

        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
     }
}


export async function deleteMenuItemSection(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_section_id } = req.params as menuItemSectionsTypes["menu_item_section_idInputSchema"]

        await menuItemSectionService.deleteS({menu_item_section_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}