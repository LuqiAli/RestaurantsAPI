import { NextFunction, Request, Response } from "express";

export function authorize(role: string) {

    return function (req: Request, res: Response, next: NextFunction) {
        const roles = req.session.roles
        
        console.log(roles.includes(role))

        next()
    }
}