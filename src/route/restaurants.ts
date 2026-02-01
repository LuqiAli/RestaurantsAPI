import express from "express"
import { deleteRestaurant, getRestaurant, getRestaurants, postRestaurant, putRestaurant } from "../controller/restaurants.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ownershipHandler } from "../middleware/ownershipHandler";
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Restaurants
 *  description: Restaurant management API
 */

/**
 * @swagger
 * /api/v1/restaurants:
 *    get:
 *      summary: Get all restaurants
 *      tags: [Restaurants]
 *      responses:
 *        200:
 *          description: List of all restaurants
 *        500: 
 *          description: Internal server error
 */
router.get("/", getRestaurants);

/**
 * @swagger
 * /api/v1/restaurants:
 *   post:
 *     summary: Post new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - name
 *               - website    
 *               - phone
 *               - tags
 *             properties:
 *               name: 
 *                 type: string
 *               website:
 *                 type: string
 *               phone:
 *                 type: integer  
 *               tags: 
 *                 type: array
 *                 items: 
 *                   type: string
 *     responses:
 *        201:
 *          description: Restaurant created successfully
 *        500: 
 *          description: Internal server error
 */
router.post("/", authenticate, authorize("USER"), postRestaurant);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}:
 *    get:
 *      summary: Get restaurant by ID
 *      tags: [Restaurants]
 *      parameters:
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID
 *      responses:
 *        200:
 *          description: List a restaurants
 *        404:
 *          description: Restaurant not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:restaurant_id", getRestaurant);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}:
 *    put:
 *      summary: Update restaurant
 *      tags: [Restaurants]
 *      parameters:
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
 *                - website    
 *                - phone
 *                - tags
 *              properties:
 *                name: 
 *                  type: string
 *                website:
 *                  type: string
 *                phone:
 *                  type: integer  
 *                tags: 
 *                  type: array
 *                  items: 
 *                    type: string
 *      responses:
 *        200:
 *          description: Updated restaurant successfully
 *        404:
 *          description: Restaurant not found
 *        500: 
 *          description: Internal server error
 */
router.put("/:restaurant_id", authenticate, authorize("USER"), ownershipHandler, putRestaurant);

/**
 * @swagger
 * /api/v1/restaurants/{restaurant_id}:
 *    delete:
 *      summary: Delete a restaurant
 *      tags: [Restaurants]
 *      parameters:
 *        - in: path
 *          name: restaurant_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Restaurant ID
 *      responses:
 *        204:
 *          description: Restaurant deleted successfully
 *        404:
 *          description: Restaurant not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:restaurant_id", authenticate, authorize("USER"), ownershipHandler, deleteRestaurant);

export default router
