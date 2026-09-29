import { NextFunction, Request, Response } from "express"
import { menuItemOptionsService } from "../services/menu-item-options.services";
import { menuItemOptionsTypes } from "../schemas/menu-item-options.schema";

export async function getMenuItemOptions(req: Request, res: Response, next: NextFunction) {

    try {
        const { restaurant_id, menu_item_section_id } = req.params as menuItemOptionsTypes["getAllInput"]
        
        const result = await menuItemOptionsService.getAll({restaurant_id, menu_item_section_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function postMenuItemOptions(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, price } = req.body as menuItemOptionsTypes["bodyInputSchema"];
        const { restaurant_id, menu_item_section_id } = req.params as menuItemOptionsTypes["getAllInput"]
        
        await menuItemOptionsService.post({name, price, restaurant_id, menu_item_section_id})

        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getMenuItemOption(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_option_id, restaurant_id } = req.params as menuItemOptionsTypes["paramsInputSchema"]

        const result = await menuItemOptionsService.get({menu_item_option_id, restaurant_id})        
        
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}
export async function putMenuItemOptions(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_option_id } = req.params as menuItemOptionsTypes["paramInputSchema"]
        const { name, price } = req.body as menuItemOptionsTypes["bodyInputSchema"];

        await menuItemOptionsService.put({menu_item_option_id, name, price})
        
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteMenuItemOptions(req: Request, res: Response, next: NextFunction) {
    try {
        const { menu_item_option_id } = req.params as menuItemOptionsTypes["paramInputSchema"]

        await menuItemOptionsService.deleteS(menu_item_option_id)
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}