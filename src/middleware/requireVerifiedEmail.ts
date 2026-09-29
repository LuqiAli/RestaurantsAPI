import { Request, Response, NextFunction } from "express";
import db from "../db/pool"
import { AppError } from "../utils/AppError";

export async function requireVerifiedEmail(req: Request, res: Response, next: NextFunction) {
    
    try {
        const user_id = req.session.userId
        const verifiedEmail = (await db.query(`SELECT email_verified FROM users WHERE id = '${user_id}';`)).rows[0]

        if (!verifiedEmail) {
            throw new AppError(403, "EMAIL_NOT_VERIFIED", "Email address must be verified to access this resource")
        }
        next()
    } catch (err) {
        next(err)
    }
}