import express from "express"
import { deleteOrder, getOrder, getOrders, postOrder, putOrder } from "../controller/orders.controller";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Order management API
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of all orders
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getOrders);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Post new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - restaurant_id
 *               - user_id    
 *               - type
 *             properties:
 *               restaurant_id: 
 *                 type: string
 *               user_id:
 *                 type: string
 *               delivery_address:
 *                 type: string
 *                 nullable: true
 *               type:
 *                 type: string
 *                 enum: [delivery, collection]
 *                 description: Order type
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", postOrder);

/**
 * @swagger
 * /api/v1/orders/{order_id}:
 *    get:
 *      summary: Get order by ID
 *      tags: [Orders]
 *      parameters:
 *        - in: path
 *          name: order_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Order ID
 *      responses:
 *        200:
 *          description: List an order
 *        404:
 *          description: Order not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:order_id", getOrder);

/**
 * @swagger
 * /api/v1/orders/{order_id}:
 *    put:
 *      summary: Update order
 *      tags: [Orders]
 *      parameters:
 *        - in: path
 *          name: order_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Order ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - status
 *              properties:
 *                status: 
 *                  type: string
 *                  enum: [processing, received, preparing, delivery]
 *      responses:
 *        200:
 *          description: Order created successfully
 *        500:
 *          description: Internal server error
 */
router.put("/:order_id", putOrder);

/**
 * @swagger
 * /api/v1/orders/{order_id}:
 *    delete:
 *      summary: Delete a order
 *      tags: [Orders]
 *      parameters:
 *        - in: path
 *          name: order_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Order ID
 *      responses:
 *        204:
 *          description: Order deleted successfully
 *        404:
 *          description: Order not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:order_id", deleteOrder);

export default router
