import { AppError } from "../utils/AppError";
import crypto from "crypto"

import bcrypt from "bcrypt"
import db from "../db/pool"
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.services";
import { BACKEND_URL, FRONTEND_URL } from "../config/env";
import { authTypes } from "../schemas/auth.schema";
import { usersTypes } from "../schemas/users.schema";

export async function login(data: authTypes["loginInput"]) {
    
    const user: usersTypes["userResponse"] = (await db.query(`SELECT * FROM users WHERE email = '${data.email}';`)).rows[0]
        
    if (!user) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid Credentials")
    }
    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid Credentials")
    }

    await db.query(`INSERT INTO user_sessions (user_id, session_id) VALUES ('${user.id}', '${data.sessionId}');`)

    return user
}

export async function logout(sessionID: authTypes["sessionIDSchema"]) {
    await db.query(`DELETE FROM user_sessions WHERE session_id = '${sessionID}';`)
}

export async function verifyEmail(inputData: authTypes["verifyInput"]) {

    await inputData.client.query("BEGIN;")
    const hashedToken = crypto.createHash("sha256").update(inputData.token).digest("hex")

    const data = (await inputData.client.query(`SELECT user_id FROM email_verification_tokens WHERE token_hash = '${hashedToken}' AND expires_at > NOW();`)).rows[0]
    await inputData.client.query(`DELETE FROM email_verification_tokens WHERE token_hash = '${hashedToken}';`)

    if (!data) {
        throw new AppError(410, "TOKEN_EXPIRED", "Email verification token has expired.")
    } else if (!data.user_id) {
        throw new AppError(410, "TOKEN_EXPIRED", "Email verification token has expired.")
    }

    await inputData.client.query(`UPDATE users SET email_verified = True WHERE id = '${data.user_id}';`)

    await inputData.client.query("COMMIT;")
}

export async function resendVerification(inputData: authTypes["resendVerificationInput"]) {

    await inputData.client.query("BEGIN;")
    
    if (inputData.email) {
        const data = (await inputData.client.query(`SELECT id FROM users WHERE email = '${inputData.email}';`)).rows[0]
        if (!data) {return}
        inputData.userId = data.id

    } else if (!inputData.userId) {
        throw new AppError(400, "MISSING_REQUIRED_FIELD", "User ID or email not provided")
    } else {
        inputData.email = (await inputData.client.query(`SELECT email FROM users WHERE id = '${inputData.userId}';`)).rows[0].email
    }

    if ((await inputData.client.query(`SELECT email_verified FROM users WHERE id = '${inputData.userId}';`)).rows[0].email_verified === true) {throw new AppError(409, "EMAIL_ALREADY_VERIFIED", "Email is already verified")}
    
    await inputData.client.query(`DELETE FROM email_verification_tokens WHERE user_id = '${inputData.userId}';`)

    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    await inputData.client.query(`INSERT INTO email_verification_tokens (user_id, token_hash) VALUES ('${inputData.userId}', '${tokenHash}');`)
    
    console.log(`${FRONTEND_URL}/api/v1/auth/verify-email?token=${token}`)

    await sendVerificationEmail(inputData.email, token)
    await inputData.client.query("COMMIT;")
}

export async function forgotPassword(inputData: authTypes["forgotPasswordInput"]) {

    inputData.client.query("BEGIN;")

    if (!inputData.email) {
        throw new AppError(400, "MISSING_REQUIRED_FIELD", "You must enter an email")
    }
    
    const data = (await inputData.client.query(`SELECT id FROM users WHERE email = '${inputData.email}';`)).rows[0]

    if (!data) {
        return
    }

    const user_id = data.id

    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    await inputData.client.query(`DELETE FROM password_reset_tokens WHERE user_id = '${user_id}';`)
    
    await inputData.client.query(`INSERT INTO password_reset_tokens (user_id, token_hash) VALUES ('${user_id}', '${tokenHash}');`)

    console.log(`${BACKEND_URL}/api/v1/auth/reset-password?token=${token}`)

    await sendPasswordResetEmail(inputData.email, token)

    inputData.client.query("COMMIT;")
}

export async function resetPassword(inputData: authTypes["resetPasswordInput"]) {
    
    inputData.client.query("BEGIN;")

    const hashedToken = crypto.createHash("sha256").update(inputData.token).digest("hex")

    const data = (await inputData.client.query(`SELECT user_id FROM password_reset_tokens WHERE token_hash = '${hashedToken}' AND expires_at > NOW();`)).rows[0]
    await inputData.client.query(`DELETE FROM password_reset_tokens WHERE token_hash = '${hashedToken}';`)

    if (!data) {
        throw new AppError(410, "EXPIRED_TOKEN", "Password reset token has expired")
    } else if (!data.user_id) {
        throw new AppError(410, "EXPIRED_TOKEN", "Password reset token has expired") 
    }

    const hashedPass = await bcrypt.hash(inputData.password, 10)

    await inputData.client.query(`UPDATE users set password = '${hashedPass}' WHERE id = '${data.user_id}';`)
    const sessionIDs = (await inputData.client.query(`SELECT session_id FROM user_sessions WHERE user_id = '${data.user_id}';`)).rows
    
    sessionIDs.forEach((row: authTypes["sessionIDIntercaceSchema"]) => {
        inputData.client.query(`DELETE FROM session WHERE sid = '${row.session_id}';`)
    });

    inputData.client.query(`DELETE FROM user_sessions WHERE user_id = '${data.user_id}';`)

    inputData.client.query("COMMIT;")
}

export async function changePassword(inputData: authTypes["changePasswordInput"]) {
    inputData.client.query("BEGIN;")
        
    if (!inputData.currentPassword || !inputData.newPassword) {
        throw new AppError(400, "MISSING_REQUIRED_FIELDS", "Must include current password and new password")
    }

    const data = (await db.query(`SELECT password FROM users WHERE id = '${inputData.userId}';`)).rows[0]

    if (!data) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid Credentials")
    }
    if (!(await bcrypt.compare(inputData.currentPassword, data.password))) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid Credentials")
    }
    if (inputData.currentPassword === inputData.newPassword) {
        throw new AppError(400, "PASSWORD_SAME_AS_CURRENT", "New password must be different from your current password")
    }

    const hashedPass = await bcrypt.hash(inputData.newPassword, 10)
    
    await db.query(`UPDATE users set password = '${hashedPass}' WHERE id = '${inputData.userId}';`);
    const sessionIDs = (await inputData.client.query(`SELECT session_id FROM user_sessions WHERE user_id = '${inputData.userId}' AND session_id != '${inputData.sessionID}';`)).rows
    
    inputData.client.query(`DELETE FROM user_sessions WHERE user_id = '${inputData.userId}' AND session_id != '${inputData.sessionID}';`)
    inputData.client.query("COMMIT;")

    return sessionIDs
}

export const authService = {
    login,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword
}