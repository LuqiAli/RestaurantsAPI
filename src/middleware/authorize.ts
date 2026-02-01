import { NextFunction, Request, Response } from "express";

export function authorize(role: string) {

    return function (req: Request, res: Response, next: NextFunction) {
        const roles = req.session.roles
        
        if (!roles.includes(role)) {
            const err = new Error("Unauthorized")
            res.status(403).json({ status: "failure", data: "Forbidden"})
            next(err)

        }
        next()
    }
}