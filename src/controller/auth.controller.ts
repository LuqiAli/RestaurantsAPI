import { Request, Response } from "express"
import bcrypt from "bcrypt"
import db from "../config/db"
import { UsersInterface, UsersInterfaceBody } from "../type/users"
import { Session } from 'express-session'

declare module 'express-session' {
    interface Session extends SessionData {
        userId: string;
        roles: string[]
    }
}

export async function loginController(req: Request, res: Response) {

   try {
        const { email, password } = req.body as UsersInterfaceBody
        
        const user: UsersInterface = (await db.query(`SELECT * FROM users WHERE email = '${email}';`)).rows[0]
        
        if (!user) {
            res.status(401).json({status: "failure", data: "Invalid Credentials"})
            throw new Error("Invalid Credentials")
        }
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            res.status(401).json({status: "failure", data: "Invalid Credentials"})
            throw new Error("Invalid Credentials")
        }

        const sessionData: Session = req.session

        sessionData.userId  = user.id
        sessionData.roles = user.roles
        
        res.status(201).json({ status: "success", data: user });
    } catch (err) {
        console.log(err)
    }

} 

export async function logoutController(req: Request, res: Response) {

    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err)
                res.status(400).json({status: "failure", data: err})
            } else {
                res.clearCookie("sessionId");
                res.status(200).json({status: "success", data: "logged out successfully"})
            }
            
        })
    } catch (err) {
        console.log(err)
    }
}