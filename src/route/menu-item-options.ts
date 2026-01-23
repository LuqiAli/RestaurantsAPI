import express from "express"
import { deleteMenuItemOptions, getMenuItemOption, getMenuItemOptions, postMenuItemOptions, putMenuItemOptions } from "../controller/menu-item-options.controller";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Menu Item Options
 *  description: Menu Item Option management API
 */

/**
 * @swagger
 * /api/v1/menu-item-options:
 *   get:
 *     summary: Retrieve all menu item options
 *     tags: [Menu Item Options]
 *     responses:
 *       200:
 *         description: A list of all menu item options
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getMenuItemOptions);


/**
 * @swagger
 * /api/v1/menu-item-options:
 *   post:
 *     summary: Post new menu item option
 *     tags: [Menu Item Options]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - menu_item_id
 *               - name
 *               - price
 *             properties:
 *               menu_item_id: 
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Menu item option created successfully
 *       400: 
 *         description: Price must have maximum of 2 decimal places
 *       500: 
 *         description: Internal server error
 */
router.post("/", postMenuItemOptions);

/**
 * @swagger
 * /api/v1/menu-item-options/{menu_item_option_id}:
 *    get:
 *      summary: Get menu item option by ID
 *      tags: [Menu Item Options]
 *      parameters:
 *        - in: path
 *          name: menu_item_option_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu item option ID
 *      responses:
 *        200:
 *          description: List a menu item option
 *        404:
 *          description: Menu item option not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:menu_item_option_id", getMenuItemOption);

/**
 * @swagger
 * /api/v1/menu-item-options/{menu_item_option_id}:
 *    put:
 *      summary: Update menu item optiob
 *      tags: [Menu Item Options]
 *      parameters:
 *        - in: path
 *          name: menu_item_option_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu item option ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - name
 *                - price
 *              properties:
 *                name: 
 *                  type: string
 *                price: 
 *                  type: number
 *      responses:
 *        200:
 *          description: Updated menu item option successfully
 *        500:
 *          description: Internal server error
 */
router.put("/:menu_item_option_id", putMenuItemOptions);

/**
 * @swagger
 * /api/v1/menu-item-options/{menu_item_option_id}:
 *    delete:
 *      summary: Delete a menu item option
 *      tags: [Menu Item Options]
 *      parameters:
 *        - in: path
 *          name: menu_item_option_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu item option ID
 *      responses:
 *        204:
 *          description: Menu item option deleted successfully
 *        404:
 *          description: Menu item option not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:menu_item_option_id", deleteMenuItemOptions);

export default router
