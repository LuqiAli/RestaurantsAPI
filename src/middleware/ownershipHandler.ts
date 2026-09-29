import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { canModifyOrder, ownsAddress, canModifyRestaurant, ownsReview } from "../services/ownership.service";
import { ownershipParamsType } from "../schemas/ownership.schema";

export function ownershipHandler(roles?: string[]) {

    return async function (req: Request, res: Response, next: NextFunction) {

        try {
            const { restaurant_id, address_id, user_id, order_id, review_id } = req.params as ownershipParamsType
            const session_user_id = req.session.userId

            let access = false
            
            if (req.session.roles?.includes("SUPER-ADMIN")) {
                return next()
            }
            
            if (restaurant_id) {
                if(!roles) {throw new AppError(400, "VALIDATION_ERROR", "Role is required")}
                access = await canModifyRestaurant(session_user_id, restaurant_id, roles) 
            } else if (address_id) {
                access = await ownsAddress(session_user_id, address_id)
            } else if (user_id && session_user_id === user_id) {
                access = true
            } else if (order_id) {
                access = await canModifyOrder(session_user_id, order_id, req.method, req.body.status)
            } else if (review_id) {
                access = await ownsReview(session_user_id, review_id)
            } else {
                throw new AppError(500, "OWNERSHIP_RESOURCE_UNKNOWN", "Unable to determine resource ownership")
            }
            
            if (access) {
                next()
            } else {
                throw new AppError(403, "RESOURCE_ACCESS_DENIED", "User does not permission to modify this resource")
            }
        } catch (err) {
            next(err)
        }
    }
}
