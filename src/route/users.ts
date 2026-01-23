import express from "express"
import { deleteUser, getUser, getUsers, postUser, putUser } from "../controller/users.controller";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User management API
 */

/**
 * @swagger
 * /api/v1/users:
 *    get:
 *      summary: Get all users
 *      tags: [Users]
 *      responses:
 *        200:
 *          description: List of all users
 *        500: 
 *          description: Internal server error
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Post new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - name
 *               - password    
 *               - email
 *               - phone
 *             properties:
 *               name: 
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string  
 *               phone: 
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", postUser);

/**
 * @swagger
 * /api/v1/users/{user_id}:
 *    get:
 *      summary: Get user by ID
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: user_id
 *          required: true
 *          schema:
 *            type: string
 *          description: User ID
 *      responses:
 *        200:
 *          description: List a user
 *        404:
 *          description: User not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:user_id", getUser);

/**
 * @swagger
 * /api/v1/users/{user_id}:
 *    put:
 *      summary: Update user
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: user_id
 *          required: true
 *          schema:
 *            type: string
 *          description: User ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - name
 *                - password    
 *                - email
 *                - phone
 *              properties:
 *                name: 
 *                  type: string
 *                password:
 *                  type: string
 *                email:
 *                  type: string  
 *                phone: 
 *                  type: integer
 *      responses:
 *        200:
 *          description: User updated successfully
 *        500: 
 *          description: Internal server error
 */
router.put("/:user_id", putUser)

/**
 * @swagger
 * /api/v1/users/{user_id}:
 *    delete:
 *      summary: Delete a user
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: user_id
 *          required: true
 *          schema:
 *            type: string
 *          description: User ID
 *      responses:
 *        204:
 *          description: User deleted successfully
 *        404:
 *          description: User not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:user_id", deleteUser);

export default router