import express from "express"
import { deleteMenuItem, getMenuItem, getMenuItems, postMenuItems, putMenuItem } from "../controller/menu-items.contoller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ownershipHandler } from "../middleware/ownershipHandler";
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Menu Items
 *  description: Menu Item management API
 */

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-items:
 *   get:
 *     summary: Retrieve all menu items
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID  
 *     responses:
 *       200:
 *         description: A list of all menu items
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getMenuItems);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-items:
 *   post:
 *     summary: Post new menu item
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - menu_id
 *               - name
 *               - descrition
 *               - price
 *             properties:
 *               menu_id: 
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400: 
 *         description: Price must have maximum of 2 decimal places
 *       500: 
 *         description: Internal server error
 */
router.post("/", authenticate, authorize("USER"), ownershipHandler, postMenuItems);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-items/{menu_item_id}:
 *    get:
 *      summary: Get menu item by ID
 *      tags: [Menu Items]
 *      parameters:
 *        - in: path
 *          name: menu_item_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu item ID
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID  
 *      responses:
 *        200:
 *          description: List a menu item
 *        404:
 *          description: Menu item not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:menu_item_id", getMenuItem);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-items/{menu_item_id}:
 *    put:
 *      summary: Update menu item
 *      tags: [Menu Items]
 *      parameters:
 *        - in: path
 *          name: menu_item_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu item ID
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID  
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - name
 *                - description
 *                - price
 *              properties:
 *                name: 
 *                  type: string
 *                description: 
 *                  type: string
 *                price: 
 *                  type: number
 *      responses:
 *        200:
 *          description: Updated menu item successfully
 *        400: 
 *         description: Price must have maximum of 2 decimal places
 *        500:
 *          description: Internal server error
 */
router.put("/:menu_item_id", authenticate, authorize("USER"), ownershipHandler, putMenuItem);

/**
 * @swagger
 * /api/v1/menu-items/{menu_item_id}:
 *    delete:
 *      summary: Delete a menu item
 *      tags: [Menu Items]
 *      parameters:
 *        - in: path
 *          name: menu_item_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu item ID
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID  
 *      responses:
 *        204:
 *          description: Menu item deleted successfully
 *        404:
 *          description: Menu item not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:menu_item_id", authenticate, authorize("USER"), ownershipHandler, deleteMenuItem);

export default router