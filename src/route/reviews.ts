import express from "express"
import { deleteReview, getReview, getReviews, postReview, putReview } from "../controller/reviews.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ownershipHandler } from "../middleware/ownershipHandler";
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Reviews
 *  description: Review management API
 */

/**
 * @swagger
 * /api/v1/reviews:
 *    get:
 *      summary: Get all reviews
 *      tags: [Reviews]
 *      responses:
 *        200:
 *          description: List of all reviews
 *        500: 
 *          description: Internal server error
 */
router.get("/", authenticate, authorize("SUPER-ADMIN"), getReviews);

/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: Post new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - restaurant_id
 *               - rating
 *               - review
 *             properties:
 *               restaurant_id: 
 *                 type: string
 *               review:
 *                 type: string  
 *               rating: 
 *                 type: integer
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *          description: Rating must be between 0 & 5
 *       500: 
 *         description: Internal server error
 */
router.post("/", authenticate, authorize("USER"), postReview);

/**
 * @swagger
 * /api/v1/reviews/{review_id}:
 *    get:
 *      summary: Get review by ID
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: review_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Review ID
 *      responses:
 *        200:
 *          description: List an review
 *        500: 
 *          description: Internal server error
 */
router.get("/:review_id", getReview);

/**
 * @swagger
 * /api/v1/reviews/{review_id}:
 *    put:
 *      summary: Update Review
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: review_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Review ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - rating
 *                - review
 *              properties:
 *                rating:
 *                  type: integer
 *                review: 
 *                  type: string 
 *      responses:
 *        200:
 *          description: Updated review successfully
 *        400:
 *          description: Rating must be between 0 & 5
 *        500:
 *          description: Review not found
 */
router.put("/:review_id", authenticate, authorize("USER"), ownershipHandler, putReview);

/**
 * @swagger
 * /api/v1/reviews/{review_id}:
 *    delete:
 *      summary: Delete a review
 *      tags: [Reviews]
 *      parameters:
 *        - in: path
 *          name: review_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Review ID
 *      responses:
 *        204:
 *          description: Review deleted successfully
 *        500: 
 *          description: Internal server error
 */
router.delete("/:review_id", authenticate, authorize("USER"), ownershipHandler, deleteReview);

export default router
