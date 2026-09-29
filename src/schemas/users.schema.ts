import { create } from "domain"
import * as z from "zod"

const paramSchema = z.object({
    user_id: z.uuid()
})

const userIdO = z.uuid()

const bodySchema = z.object({
    name: z.string().trim().min(1).max(100, "Name must be 100 characters or less"),
    phone: z.string().trim().min(7).max(30)
})

const createBody = z.object({
    ...bodySchema.required().shape,
    password: z.string().trim().min(8, "Password must be at least 8 characters long").max(128),
    email: z.email()
})

const updateSchema = z.object({
    ...paramSchema.required().shape,
    user_id_session: z.uuid(),
    ...bodySchema.required().shape
})

const createSchema = z.object({
    ...createBody.required().shape,
    client: z.any()
})

const responseSchema = z.object({
    id: z.uuid(),
    ...createBody.required().shape,
    email_verified: z.coerce.boolean(),
    roles: z.array(z.string().trim().min(1))
})

const responsesSchema = z.array(responseSchema)

export const usersSchemas = {
    paramSchema,
    bodySchema,
    createBody,  
}

type userResponse = z.infer<typeof responseSchema>
type usersResponse = z.infer<typeof responsesSchema>
type createBodyInput = z.infer<typeof createBody>
type updateInput = z.infer<typeof updateSchema>
type paramInput = z.infer<typeof paramSchema>
type bodyInput= z.infer<typeof bodySchema>
type createInput = z.infer<typeof createSchema>
type userId = z.infer<typeof userIdO>
 
export type usersTypes = {
    userResponse: userResponse,
    usersResponse: usersResponse,
    createBodyInput: createBodyInput,
    updateInput: updateInput,
    paramInput: paramInput,
    bodyInput: bodyInput,
    createInput: createInput,
    userId: userId
}