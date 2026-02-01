import express from "express"
import { loginController, logoutController } from "../controller/auth.controller";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Authentication management API
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *               - password   
 *             properties:
 *               email: 
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Logged in successfully
 *       500: 
 *          description: Internal server error
 */
router.post("/login", loginController)

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Authentication]  
 *     responses:
 *       201:
 *         description: Logged out successfully
 *       500: 
 *          description: Internal server error
 */
router.post("/logout", logoutController)

export default router