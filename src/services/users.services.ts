import bcrypt from "bcrypt"
import db from "../db/pool"
import crypto from "crypto"
import { sendVerificationEmail } from "../services/email.services"
import { AppError } from "../utils/AppError"
import { BACKEND_URL } from "../config/env"
import { usersTypes } from "../schemas/users.schema"

export async function getAll() {
    const result: usersTypes["usersResponse"] = (await db.query("SELECT * FROM users;")).rows;
    return result
}

export async function post(inputData: usersTypes["createInput"]) {
    await inputData.client.query("BEGIN;")
        
    const hashedPass = await bcrypt.hash(inputData.password, 10)
    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

    const user_id: String = (await inputData.client.query(
        `INSERT INTO users (name, password, email, phone) VALUES ('${inputData.name}', '${hashedPass}', '${inputData.email}', '${inputData.phone}') returning id;`
    )).rows[0].id;

    console.log(user_id)

    await inputData.client.query(
        `INSERT INTO email_verification_tokens (user_id, token_hash) VALUES ('${user_id}', '${tokenHash}');`
    )
    
    await inputData.client.query("COMMIT;")
    
    console.log(`${BACKEND_URL}/api/v1/auth/verify-email?token=${token}`)

    await sendVerificationEmail(inputData.email, token)
}

export async function get(inputData: usersTypes["paramInput"]) {
    const result: usersTypes["userResponse"] = (await db.query(
        `SELECT * FROM users WHERE id = '${inputData.user_id}';`
    )).rows;
    return result
}

export async function put(inputData: usersTypes["updateInput"]) {
    if (inputData.user_id !== inputData.user_id_session) {
        throw new AppError(403, "INVALID_PERMISSION", "Invalid permissions.")
    }

    await db.query(
        `UPDATE users set name = '${name}', phone = '${inputData.phone}' WHERE id = '${inputData.user_id}';`
    );
}

export async function deleteS(inputData: usersTypes["paramInput"]) {
    await db.query(`DELETE FROM users WHERE id = '${inputData.user_id}'`);
}

export const usersService = {
    getAll,
    post,
    get,
    put,
    deleteS
}