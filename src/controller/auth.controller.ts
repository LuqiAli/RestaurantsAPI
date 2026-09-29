import { NextFunction, Request, Response } from "express"
import db from "../db/pool"
import { AppError } from "../utils/AppError"
import { authService } from "../services/auth.services"
import { authTypes } from "../schemas/auth.schema"

declare module 'express-session' {
    interface Session extends SessionData {
        userId: string;
        roles: string[]
    }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {

   try {
        if (req.session.userId) {
            throw new AppError(409, "ALREADY_AUTHENTICATED", "You are already logged in")
        }
    
        const { email, password } = req.body as authTypes["loginSchema"]
        const sessionId: authTypes["sessionIDSchema"] = req.sessionID

        
        const user = await authService.login({email, password, sessionId})

        const sessionData = req.session
        sessionData.userId  = user.id
        sessionData.roles = user.roles
        
        res.status(201).json({ status: "success", data: user });
    } catch (err) {
        next(err);
    }

} 

export async function logoutController(req: Request, res: Response, next: NextFunction) {

    try {

        await authService.logout(req.sessionID)
        
        req.session.destroy((err) => {
            if (err) {
                throw new AppError(400, "COOKIE_DESTROY_ERROR", err)
            } else {
                res.clearCookie("sessionId");
                return res.status(200).json({status: "success", data: "logged out successfully"})
            }
            
        })
    } catch (err) {
        next(err);
    }
}

export async function verifyEmailController(req: Request, res: Response, next: NextFunction) {

    const client = await db.connect()

    try {

        if (!req.query.token) {
            throw new AppError(400, "INVALID_TOKEN", "Must include an email verification token")
        }

        const token: authTypes["tokenSchema"] = req.query.token.toString()
        
        await authService.verifyEmail({token, client})

        res.status(200).json({ status: "success", data: "Email has been verified" })

    } catch (err) {
        client.query("ROLLBACK;")
        next(err);
    } finally {
        client.release()
    }
}

export async function resendVerificationController(req: Request, res: Response, next: NextFunction) {

    const client = await db.connect()
    
    try {

        let userId: authTypes["userIdSchema"] = req.session.userId
        let email: authTypes["emailSchema"] = req.body.email

        await authService.resendVerification({userId, email, client})

        res.status(201).json({ status: "success", data: "Email verification sent." })
        
    } catch (err) {
        client.query("ROLLBACK;")
        next(err)
    } finally {
        client.release()
    }
}

export async function forgotPasswordController(req: Request, res: Response, next: NextFunction) {

    const client = await db.connect()
    
    try {
        
        const email: authTypes["emailSchema"] = req.body.email

        await authService.forgotPassword({email, client})

        res.status(201).json({ status: "success", data: "Password recovery email sent" })

    } catch (err) {
        client.query("ROLLBACK;")
        next(err)
    } finally {
        client.release()
    }
}

export async function resetPasswordController(req: Request, res: Response, next: NextFunction) {
    
    const client = await db.connect()
    
    try {

        const password: authTypes["passwordSchema"] = req.body.password

        if (!req.query.token) {
            throw new AppError(400, "MISSING_REQUIRED_FIELD", "Must include an password reset token")
        } else if (!password) {
            throw new AppError(400, "MISSING_REQUIRED_FIELD", "Must include a new password")
        }

        const token: authTypes["tokenSchema"] = req.query.token.toString()
        
        await authService.resetPassword({password, token, client})

        res.status(200).json({ status: "success", data: "Password reset successfully" })

    } catch (err) {
        client.query("ROLLBACK;")
        next(err)
    } finally {
        client.release()
    }
}

export async function changePasswordController(req: Request, res: Response, next: NextFunction) {

    const client = await db.connect()

    try {

        const {newPassword, currentPassword}: authTypes["changePasswordSchema"] = req.body
        const userId: authTypes["userIdSchema"] = req.session.userId
        const sessionID: authTypes["sessionIDSchema"] = req.sessionID

        const sessionIDs = await authService.changePassword({currentPassword, newPassword, userId, sessionID, client})
        
        sessionIDs.forEach((row: authTypes["sessionIDIntercaceSchema"]) => {
            req.sessionStore.destroy(row.session_id, (err) => {
                if (err) {
                    throw new AppError(500, "COOKIE_DESTROY_ERROR", err)
                }  
            })
        });
        
        res.status(201).json({ status: "success", data: "Password changed successfully."})

    } catch (err) {
        client.query("ROLLBACK;")
        next(err)
    } finally {
        client.release()
    }
}