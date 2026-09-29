import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {

    console.error(err)

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ 
            status: "failure", 
            error: {
                code: err.code,
                message: err.message
            }})
    }

    return res.status(500).json({
        status: "failure",
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occured."
        }
    })
    
}