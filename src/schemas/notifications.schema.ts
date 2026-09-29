import * as z from "zod"

const notificationTypeSchema = z.enum(["informational", "success", "warning", "error"])
const notification_id = z.uuid()

const bodySchema = z.object({
    type: notificationTypeSchema,
    description: z.string().trim().min(1, "Description is required").max(255, "Description must be 255 character or less"),
    link: z.url().max(75),
    is_read: z.coerce.boolean()
})

const responseSchema = z.object({
    id: notification_id,
    user_id: z.uuid(),
    ...bodySchema.required().shape
})

const responsesSchema = z.array(responseSchema)

const createSchema = z.object({
    user_id: z.uuid(),
    ...bodySchema.required().shape
})

const getSchema = z.object({
    notification_id: notification_id
})

export const notificationSchemas = {
    bodySchema,
    responseSchema,
    responsesSchema,
    createSchema,
    getSchema
}

type getInput = z.infer<typeof getSchema>
type bodyInput = z.infer<typeof bodySchema>
type createInput = z.infer<typeof createSchema>
type notificationResponse = z.infer<typeof responseSchema>
type notificationsResponse = z.infer<typeof responsesSchema>

export type notificationTypes = {
    getInput: getInput,
    bodyInput: bodyInput,
    createInput: createInput,
    notificationResponse: notificationResponse,
    notificationsResponse: notificationsResponse
}