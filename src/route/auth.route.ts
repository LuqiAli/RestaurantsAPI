import express from "express"

import { changePasswordController, forgotPasswordController, loginController, logoutController, resendVerificationController, resetPasswordController, verifyEmailController } from "../controller/auth.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { requireVerifiedEmail } from "../middleware/requireVerifiedEmail";
import { validate } from "../middleware/validate";
import { authSchemas } from "../schemas/auth.schema";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Authentication management API
 */

/**
 * @swagger
 * tags:
 *  name: Verification
 *  description: Verification management API
 */

/**
 * @swagger
 * tags:
 *  name: Password
 *  description: Password management API
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *               - password   
 *             properties:
 *               email: 
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Logged in successfully
 *       500: 
 *          description: Internal server error
 */
router.post("/login", validate.body(authSchemas.loginBody), validate.session(), loginController)

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Authentication]  
 *     responses:
 *       201:
 *         description: Logged out successfully
 *       500: 
 *          description: Internal server error
 */
router.post("/logout", validate.session(), logoutController)

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   get:
 *     summary: Verify Email
 *     tags: [Verification]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: Email verification token  
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       500: 
 *          description: Internal server error
 */
router.get("/verify-email", validate.query(authSchemas.tokenObj), verifyEmailController)

/**
 * @swagger
 * /api/v1/auth/resend-verification:
 *   post:
 *     summary: Resend Verification
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email   
 *             properties:
 *               email: 
 *                 type: string
 *     responses:
 *       201:
 *         description: Resent Verification
 *       500: 
 *          description: Internal server error
 */
router.post("/resend-verification", validate.body(authSchemas.emailBody),  validate.userID, resendVerificationController)

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email   
 *             properties:
 *               email: 
 *                 type: string
 *     responses:
 *       201:
 *         description: Password recovery email sent.
 *       500: 
 *          description: Internal server error
 */
router.post("/forgot-password", requireVerifiedEmail, validate.body(authSchemas.emailBody), forgotPasswordController)

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   get:
 *     summary: Reset Password
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - password   
 *             properties:
 *               password: 
 *                 type: string
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: Password reset token  
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       500: 
 *          description: Internal server error
 */
router.post("/reset-password", requireVerifiedEmail, validate.body(authSchemas.passwordBody), validate.query(authSchemas.tokenObj),  resetPasswordController)

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change Password
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - currentPassword   
 *               - newPassword   
 *             properties:
 *               currentPassword: 
 *                 type: string
 *               newPassword: 
 *                 type: string
 *     responses:
 *       201:
 *         description: Password successfully changed.
 *       500: 
 *          description: Internal server error
 */
router.post("/change-password", authenticate, authorize("USER"), requireVerifiedEmail, validate.body(authSchemas.changePasswordBody), validate.session(), validate.userID(), changePasswordController)

// router.post("/test", test)

export default router