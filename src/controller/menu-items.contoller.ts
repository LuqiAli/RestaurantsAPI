import { NextFunction, Request, Response } from "express"
import { menuItemsService } from "../services/menu-items.services";
import { menuItemTypes } from "../schemas/menu-items.schema";

export async function getMenuItems(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_section_id } = req.params as menuItemTypes["getAllInput"]
        
        const result = await menuItemsService.getAll({menu_section_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postMenuItems(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, price } = req.body as menuItemTypes["bodyInput"];
        const { restaurant_id, menu_section_id } = req.params as menuItemTypes["paramInput"]

        await menuItemsService.post({name, description, price, restaurant_id, menu_section_id})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_id } = req.params as menuItemTypes["getInput"]
        const result = await menuItemsService.get({menu_item_id})
        
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_id, restaurant_id } = req.params as menuItemTypes["paramsInput"]
        const { name, description, price } = req.body as menuItemTypes["bodyInput"]

        await menuItemsService.put({menu_item_id, restaurant_id, name, description, price})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteMenuItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_id } = req.params as menuItemTypes["getInput"]

        await menuItemsService.deleteS({menu_item_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}