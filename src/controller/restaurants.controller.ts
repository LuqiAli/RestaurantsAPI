import { NextFunction, Request, Response } from "express"
import { restaurantsService } from "../services/restaurants.services";
import { restaurantsTypes } from "../schemas/restaurants.schema";

export async function getRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
        const result = restaurantsService.getAll()

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
     }
}

export async function postRestaurant(req: Request, res: Response, next: NextFunction) {
    try {

        const body: restaurantsTypes["bodyInput"] = req.body;
        const user_id: restaurantsTypes["userIdInput"] = req.session.userId

        await restaurantsService.post({body, user_id})

        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function getRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
        const { restaurant_id } = req.params as restaurantsTypes["paramInput"]

        const result = await restaurantsService.get({restaurant_id})

        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        next(err);
    }
}

export async function putRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
        const { restaurant_id } = req.params as restaurantsTypes["paramInput"]
        const { name, website, phone, tags } = req.body as restaurantsTypes["bodyInput"];

        await restaurantsService.put({restaurant_id, name, website, phone, tags})
        
        res.status(201).json({ status: "success" });
    } catch (err) {
        next(err);
    }
}

export async function deleteRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
        const { restaurant_id } = req.params as restaurantsTypes["paramInput"]

        await restaurantsService.deleteS({restaurant_id})
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}