import express from "express"
import { deleteAddress, getAddress, getAddresses, postAddress, putAddress } from "../controller/addresses.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ownershipHandler } from "../middleware/ownershipHandler";
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Addresses
 *  description: Address management API
 */

/**
 * @swagger
 * /api/v1/addresses:
 *    get:
 *      summary: Get all addresses
 *      tags: [Addresses]
 *      responses:
 *        200:
 *          description: List of all addresses
 *        500: 
 *          description: Internal server error
 */
router.get("/", authenticate, authorize("SUPER-ADMIN"), getAddresses);

/**
 * @swagger
 * /api/v1/addresses:
 *   post:
 *     summary: Post new address
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - link_id
 *               - type    
 *               - address_1
 *               - city
 *               - town
 *               - postcode
 *               - country
 *             properties:
 *               link_id: 
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [delivery, user]
 *               address_1:
 *                 type: string  
 *               address_2:
 *                 type: string  
 *               address_3:
 *                 type: string  
 *               city:
 *                 type: string  
 *               town:
 *                 type: string  
 *               postcode:
 *                 type: string  
 *               country:
 *                 type: string
 *               user_address_type:
 *                 type: string
 *                 enum: [billing, delivery]
 *               is_primary:
 *                 type: boolean  
 *     responses:
 *       201:
 *         description: Address created successfully
 *       500: 
 *          description: Internal server error
 */
router.post("/", authenticate, authorize("USER"), postAddress);

/**
 * @swagger
 * /api/v1/addresses/{address_id}:
 *    get:
 *      summary: Get address by ID
 *      tags: [Addresses]
 *      parameters:
 *        - in: path
 *          name: address_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Address ID
 *      responses:
 *        200:
 *          description: List an address
 *        404:
 *          description: Address not found
 *        500: 
 *          description: Internal server error
 */
router.get("/:address_id", authenticate, authorize("USER"), ownershipHandler, getAddress);

/**
 * @swagger
 * /api/v1/addresses/{address_id}:
 *    put:
 *      summary: Update address
 *      tags: [Addresses]
 *      parameters:
 *        - in: path
 *          name: address_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Address ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: 
 *                - address_1
 *                - city  
 *                - town
 *                - postcode
 *                - country
 *              properties:
 *                address_1: 
 *                  type: string
 *                address_2: 
 *                  type: string
 *                address_3: 
 *                  type: string
 *                city:
 *                  type: string
 *                town:
 *                  type: string  
 *                postcode:
 *                  type: string  
 *                country:
 *                  type: string  
 *      responses:
 *        200:
 *          description: Updated address successfully
 *        500:
 *          description: Address not found
 */
router.put("/:address_id", authenticate, authorize("USER"), ownershipHandler, putAddress);

/**
 * @swagger
 * /api/v1/addresses/{address_id}:
 *    delete:
 *      summary: Delete an address
 *      tags: [Addresses]
 *      parameters:
 *        - in: path
 *          name: address_id
 *          required: true
 *          schema:
 *            type: string
 *          description: Address ID
 *      responses:
 *        200:
 *          description: Address deleted successfully
 *        404:
 *          description: Address not found
 *        500: 
 *          description: Internal server error
 */
router.delete("/:address_id", authenticate, authorize("USER"), ownershipHandler, deleteAddress);

export default router