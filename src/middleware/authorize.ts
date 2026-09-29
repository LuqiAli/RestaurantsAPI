import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function authorize(role: string) {

    return function (req: Request, res: Response, next: NextFunction) {
        try {

            const roles = req.session.roles
        
            if (!roles.includes(role)) {
                throw new AppError(403, "UNAUTHORIZED", "User is unauthorized")
            }
            
            next()
        } catch (err) {
            next(err)
        }
    }
}