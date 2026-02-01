import express from "express"
import { deleteMenuSection, getMenuSection, getMenuSections, postMenuSections, putMenuSection } from "../controller/menu-sections.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ownershipHandler } from "../middleware/ownershipHandler";
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Menu Sections
 *  description: Menu Section management API
 */

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections:
 *   get:
 *     summary: Retrieve all menu sections
 *     tags: [Menu Sections]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID  
 *     responses:
 *       200:
 *         description: A list of all menu sections
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getMenuSections);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections:
 *   post:
 *     summary: Post new menu section
 *     tags: [Menu Sections]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu section created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", authenticate, authorize("USER"), ownershipHandler, postMenuSections)

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}:
 *    get:
 *      summary: Get menu section by ID
 *      tags: [Menu Sections]
 *      parameters:
 *        - in: path
 *          name: menu_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu section ID
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID  
 *      responses:
 *        200:
 *          description: List a menu section
 *        404:
 *          description: Menu section not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:menu_section_id", getMenuSection);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}:
 *    put:
 *      summary: Update menu section
 *      tags: [Menu Sections]
 *      parameters:
 *        - in: path
 *          name: menu_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu section ID
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
 *              properties:
 *                name: 
 *                  type: string
 *      responses:
 *        200:
 *          description: Upadted menu section successfully
 *        500:
 *          description: Internal server error
 */
router.put("/:menu_section_id", authenticate, authorize("USER"), ownershipHandler, putMenuSection);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}/menu-sections/{menu_section_id}:
 *    delete:
 *      summary: Delete a menu section
 *      tags: [Menu Sections]
 *      parameters:
 *        - in: path
 *          name: menu_section_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Menu section ID
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID  
 *      responses:
 *        204:
 *          description: Menu section deleted successfully
 *        404:
 *          description: Menu section not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:menu_section_id", authenticate, authorize("USER"), ownershipHandler, deleteMenuSection);

export default router