import express from "express"

import { deleteMenuItemSection, getMenuItemSection, getMenuItemSections, postMenuItemSections, putMenuItemSection } from "../controller/menu-item-sections.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ownershipHandler } from "../middleware/ownershipHandler";
import { validate } from "../middleware/validate";
import { menuItemSectionsSchemas } from "../schemas/menu-item-sections.schema";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Menu Item Sections
 *  description: Menu Item Section management API
 */

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}/menu-items/{menu_item_id}/menu-item-sections:
 *   get:
 *     summary: Retrieve all menu item sections
 *     tags: [Menu Item Sections]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *       - in: path
 *         name: menu_section_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Section ID
 *       - in: path
 *         name: menu_item_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item ID  
 *     responses:
 *       200:
 *         description: A list of all menu item sections
 *       500:
 *         description: Internal Server Error
 */
router.get("/", validate.params(menuItemSectionsSchemas.menu_item_idSchema), getMenuItemSections);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}/menu-items/{menu_item_id}/menu-item-sections:
 *   post:
 *     summary: Post new menu item section
 *     tags: [Menu Item Sections]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *       - in: path
 *         name: menu_section_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Section ID
 *       - in: path
 *         name: menu_item_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item ID  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - name
 *               - required
 *               - multiple
 *             properties:
 *               name:
 *                 type: string
 *               required:
 *                 type: boolean
 *               multiple:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Menu item section created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", authenticate, authorize("USER"), ownershipHandler(["OWNER", "MANAGER"]), validate.body(menuItemSectionsSchemas.bodySchema), validate.params(menuItemSectionsSchemas.paramSchema), postMenuItemSections)

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}/menu-items/{menu_item_id}/menu-item-sections/{menu_itemsection_id}:
 *    get:
 *      summary: Get menu item section by ID
 *      tags: [Menu Item Sections]
 *      parameters:
 *        - in: path
 *          name: menu_item_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Item Section ID
 *        - in: path
 *          name: menu_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Section ID
 *        - in: path
 *          name: menu_item_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Item ID
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID  
 *      responses:
 *        200:
 *          description: List a menu item section
 *        404:
 *          description: Menu item section not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:menu_item_section_id", validate.params(menuItemSectionsSchemas.paramsSchema), getMenuItemSection);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}/menu-items/{menu_item_id}/menu-item-sections/{menu_item_section_id}:
 *    put:
 *      summary: Update menu item section
 *      tags: [Menu Item Sections]
 *      parameters:
 *        - in: path
 *          name: menu_item_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Item Section ID
 *        - in: path
 *          name: menu_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Section ID
 *        - in: path
 *          name: menu_item_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Item ID
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
 *                - required
 *                - multiple
 *              properties:
 *                name: 
 *                  type: string
 *                required: 
 *                  type: boolean
 *                multiple: 
 *                  type: boolean
 *      responses:
 *        200:
 *          description: Upadted menu item section successfully
 *        500:
 *          description: Internal server error
 */
router.put("/:menu_item_section_id", authenticate, authorize("USER"), ownershipHandler(["OWNER", "MANAGER"]), validate.body(menuItemSectionsSchemas.bodySchema), validate.params(menuItemSectionsSchemas.menu_item_section_idSchema), putMenuItemSection);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}/menu-items/{menu_item_id}/menu-item-sections/{menu_item_section_id}:
 *    delete:
 *      summary: Delete a menu item section
 *      tags: [Menu Item Sections]
 *      parameters:
 *        - in: path
 *          name: menu_item_ section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Item Section ID
 *        - in: path
 *          name: menu_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Section ID
 *        - in: path
 *          name: menu_item_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu Item ID
 *        - in: path 
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID  
 *      responses:
 *        204:
 *          description: Menu item section deleted successfully
 *        404:
 *          description: Menu item section not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:menu_item_section_id", authenticate, authorize("USER"), ownershipHandler(["OWNER", "MANAGER"]), validate.params(menuItemSectionsSchemas.menu_item_section_idSchema), deleteMenuItemSection);

export default router