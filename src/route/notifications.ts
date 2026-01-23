import express from "express"
import { deleteNotification, getNotification, getNotifications, postNotification, putNotification } from "../controller/notifications.controller";
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Notifications
 *  description: Notification management API
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Retrieve all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: A list of all notifications
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getNotifications);

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     summary: Post new notifications
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - user_id
 *               - type
 *               - description
 *               - link
 *             properties:
 *               user_id: 
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [informational, success, warning, error]
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       500: 
 *         description: Internal server error
 */
router.post("/", postNotification)

/**
 * @swagger
 * /api/v1/notifications/{notification_id}:
 *    get:
 *      summary: Get notification by ID
 *      tags: [Notifications]
 *      parameters:
 *        - in: path
 *          name: notification_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Notification ID
 *      responses:
 *        200:
 *          description: List a notification
 *        500: 
 *          description: Internal server error
 */
router.get("/:notification_id", getNotification);

/**
 * @swagger
 * /api/v1/notifications/{notification_id}:
 *    put:
 *      summary: Update notification
 *      tags: [Notifications]
 *      parameters:
 *        - in: path
 *          name: notification_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Notification ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - type
 *                - description
 *                - link
 *              properties:
 *                type: 
 *                  type: string
 *                  enum: [informatiobal, success, warning, error]
 *                description: 
 *                  type: string
 *                link: 
 *                  type: string         
 *      responses:
 *        200:
 *          description: Notification created successfully
 *        500:
 *          description: Internal server error
 */
router.put("/:notification_id", putNotification);

/**
 * @swagger
 * /api/v1/notifications/{notification_id}:
 *    delete:
 *      summary: Delete a notification
 *      tags: [Notifications]
 *      parameters:
 *        - in: path
 *          name: notification_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Notification ID
 *      responses:
 *        204:
 *          description: Notification deleted successfully
 *        500: 
 *          description: Internal server error
 */
router.delete("/:notification_id", deleteNotification);

export default router