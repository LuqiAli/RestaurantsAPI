import express from "express"
import { deleteTag, getTag, getTags, postTag, putTag } from "../controller/tags";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Tags
 *  description: Tags management API
 */

/**
 * @swagger
 * /api/v1/tags:
 *   get:
 *     summary: Retrieve all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: A list of all tags
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getTags)

/**
 * @swagger
 * /api/v1/tags:
 *   post:
 *     summary: Post new tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - title
 *               - type
 *             properties:
 *               title: 
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [cuisine, dishes, dietary, type]
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", postTag)

/**
 * @swagger
 * /api/v1/tags/{tag_id}:
 *    get:
 *      summary: Get tag by ID
 *      tags: [Tags]
 *      parameters:
 *        - in: path
 *          name: tag_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Tag ID
 *      responses:
 *        200:
 *          description: List an tag
 *        500: 
 *          description: Internal server error
 */
router.get("/:tag_id", getTag)

/**
 * @swagger
 * /api/v1/tags/{tag_id}:
 *    put:
 *      summary: Update tag
 *      tags: [Tags]
 *      parameters:
 *        - in: path
 *          name: tag_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Tag ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - title
 *                - type    
 *              properties:
 *                title: 
 *                  type: string
 *                type:
 *                  type: string
 *                  enum: [cuisine, dishes, dietary, type]
 *      responses:
 *        200:
 *          description: Tag updated successfully
 *        500: 
 *          description: Internal server error
 */
router.put("/:tag_id", putTag)

/**
 * @swagger
 * /api/v1/tags/{tag_id}:
 *    delete:
 *      summary: Delete a tag
 *      tags: [Tags]
 *      parameters:
 *        - in: path
 *          name: tag_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Tag ID
 *      responses:
 *        204:
 *          description: Tag deleted successfully
 *        404:
 *          description: Tag not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:tag_id", deleteTag)

export default router