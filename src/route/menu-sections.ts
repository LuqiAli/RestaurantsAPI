import express from "express"
import { deleteMenuSection, getMenuSection, getMenuSections, postMenuSections, putMenuSection } from "../controller/menu-sections.controller";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Menu Sections
 *  description: Menu Section management API
 */

/**
 * @swagger
 * /api/v1/menu-sections:
 *   get:
 *     summary: Retrieve all menu sections
 *     tags: [Menu Sections]
 *     responses:
 *       200:
 *         description: A list of all menu sections
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getMenuSections);

/**
 * @swagger
 * /api/v1/menu-sections:
 *   post:
 *     summary: Post new menu section
 *     tags: [Menu Sections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - restaurant_id
 *               - name
 *             properties:
 *               restaurant_id: 
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu section created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", postMenuSections)

/**
 * @swagger
 * /api/v1/menu-sections/{menu_section_id}:
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
 * /api/v1/menu-sections/{menu_section_id}:
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
router.put("/:menu_section_id", putMenuSection);

/**
 * @swagger
 * /api/v1/menu-sections/{menu_section_id}:
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
 *      responses:
 *        204:
 *          description: Menu section deleted successfully
 *        404:
 *          description: Menu section not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:menu_section_id", deleteMenuSection);

export default router