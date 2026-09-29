import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/AppError";
import { authSchemas } from "../schemas/auth.schema";

const body = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {

        
        const result = schema.safeParse(req.body)
        
        if (!result.success) {
            return next(
                new AppError(
                    400, "VALIDATION_ERROR", "Invalid request body"
                )
            )
        }
        
        req.body = result.data

        next()
    }
}

const params = (schema: ZodType<Record<string, string>>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params)

        if (!result.success) {
            return next(
                new AppError(
                    400, "VALIDATION_ERROR", "Invalid request parameters"
                )
            )
        }

        req.params = result.data
        next()
    }
}

const query = (schema: ZodType<Record<string, string>>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)

        if (!result.success) {
            return next(
                new AppError(
                    400, "VALIDATION_ERROR", "Invalid query parameters"
                )
            )
        }

        req.query = result.data
        next()
    }
}

const session = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = authSchemas.sessionID.safeParse(req.sessionID)

        if (!result.success) {
            return next(
                new AppError(
                    400, "VALIDATION_ERROR", "Invalid session"
                )
            )
        }

        req.sessionID = result.data
        next()
    }
}

const userID = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = authSchemas.userId.safeParse(req.session.userId)

        if (!result.success) {
            return next(
                new AppError(
                    400, "VALIDATION_ERROR", "Invalid session"
                )
            )
        }

        req.session.userId = result.data
        next()
    }
}

export const validate = {
    body,
    params,
    query,
    session,
    userID
}