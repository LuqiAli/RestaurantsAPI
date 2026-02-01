import express from "express"
import { deleteOrder, getOrder, getOrders, postOrder, putOrder } from "../controller/orders.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ownershipHandler } from "../middleware/ownershipHandler";
const router = express.Router({ mergeParams: true });

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
router.get("/", authenticate, authorize("SUPER-ADMIN"), getOrders);

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
 *               - items
 *               - is_delivery
 *             properties:
 *               restaurant_id: 
 *                 type: string
 *               delivery_address:
 *                 type: string
 *                 nullable: true
 *               is_delivery:
 *                 type: boolean
 *               items: 
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties: 
 *                          item_id: 
 *                              type: string
 *                          quantity: 
 *                              type: integer
 *                          item_price: 
 *                              type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", authenticate, authorize("USER"), postOrder);

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
router.get("/:order_id", authenticate, authorize("USER"), ownershipHandler, getOrder);

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
router.put("/:order_id", authenticate, authorize("USER"), ownershipHandler, putOrder);

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
router.delete("/:order_id", authenticate, authorize("SUPER-ADMIN"), ownershipHandler, deleteOrder);

export default router
