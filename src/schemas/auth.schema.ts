import * as z from "zod"

// Field Validation
const sessionID = z.string().trim().min(1, "Session ID is required")
const userId = z.uuid()
const password = z.string().trim().min(8, "Password must be more than 8 characters").max(100, "Password must be 100 characters or less")


const passwordBody = z.object({
    password: password
})

const tokenCheck = z.string().trim().min(1, "Verify email token is required")
const tokenObj = z.object({
    token: tokenCheck
})

const email = z.email().max(255)

// Login validation
const loginBody = z.object({
    email: z.email().max(255),
    password: password
})

const login = z.object({
    sessionId: sessionID,
    ...loginBody.required().shape
})

// Verify email validation
const verifyEmail = z.object({
    token: tokenCheck,
    client: z.any()
})

// Resend verification validation
const emailBody = z.object({
    email: z.email()
})

const resendVerification = emailBody.required().extend({
    userId: userId,
    client: z.any()
})

// Forgot password validation
const forgotPassword = emailBody.required().extend({
    client: z.any()
})

// Reset password validation
const resetPassword = z.object({
    token: tokenCheck,
    password: password,
    client: z.any()
})

const sessionIdInterface = z.object({
    session_id: sessionID,
})

// Change password validation
const changePasswordBody = z.object({
    currentPassword: z.string().trim().min(8, "Password must be more than 8 characters").max(100, "Password must be 100 characters or less"),
    newPassword: z.string().trim().min(8, "Password must be more than 8 characters").max(100, "Password must be 100 characters or less")
})

const changePassword = z.object({
    ...changePasswordBody.required().shape,
    userId: userId,
    sessionID: sessionID,
    client: z.any()
})

// Schema for typescript
type loginInput = z.infer<typeof login>
type verifyInput = z.infer<typeof verifyEmail>
type resendVerificationInput = z.infer<typeof resendVerification>
type forgotPasswordInput = z.infer<typeof forgotPassword>
type resetPasswordInput = z.infer<typeof resetPassword>
type changePasswordInput = z.infer<typeof changePassword>

type loginSchema = z.infer<typeof loginBody>
type tokenSchema = z.infer<typeof tokenCheck>
type userIdSchema = z.infer<typeof userId>
type sessionIDSchema = z.infer<typeof sessionID>
type emailSchema = z.infer<typeof email>
type passwordSchema = z.infer<typeof password>
type changePasswordSchema = z.infer<typeof changePasswordBody>
type sessionIDIntercaceSchema = z.infer<typeof sessionIdInterface>

// constructor
export const authSchemas = {
    sessionID,
    userId,
    passwordBody,
    tokenCheck,
    tokenObj,
    emailBody,
    loginBody,
    login,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePasswordBody,
    changePassword,
}

export type authTypes = {
    loginInput: loginInput,
    verifyInput: verifyInput,
    resendVerificationInput: resendVerificationInput,
    forgotPasswordInput: forgotPasswordInput,
    resetPasswordInput: resetPasswordInput,
    changePasswordInput: changePasswordInput,

    loginSchema: loginSchema,
    tokenSchema: tokenSchema,
    userIdSchema: userIdSchema,
    sessionIDSchema: sessionIDSchema,
    emailSchema: emailSchema,
    passwordSchema: passwordSchema,
    changePasswordSchema: changePasswordSchema,
    sessionIDIntercaceSchema: sessionIDIntercaceSchema
}