import * as z from "zod"

const user_id = z.uuid()
const paramSchema = z.object({
    review_id: z.uuid()
})

const bodySchema = z.object({
    rating: z.coerce.number().min(0).max(5),
    review: z.string().trim().min(0).max(750, "Review must be 750 characters or less")
})

const createBody = z.object({
    ...bodySchema.required().shape,
    restaurant_id: z.uuid()
})

const updateSchema = z.object({
    review_id: z.uuid(),
    ...bodySchema.required().shape,
})

const createSchema = z.object({
    user_id: user_id,
    ...createBody.required().shape
})

const responseSchema = z.object({
    id: z.uuid(),
    user_id: user_id,
    ...createBody.required().shape,
    
})

const responsesSchema = z.array(responseSchema)

export const reviewsSchemas = {
    paramSchema,
    bodySchema,
    createBody
}

type createInput = z.infer<typeof createSchema>
type updateInput = z.infer<typeof updateSchema>
type userId = z.infer<typeof user_id>
type createBodyInput = z.infer<typeof createBody>
type updateBodyInput = z.infer<typeof bodySchema>
type paramInput = z.infer<typeof paramSchema>
type reviewResponse = z.infer<typeof responseSchema>
type reviewsResponse = z.infer<typeof responsesSchema>

export type reviewsType = {
    createInput: createInput,
    updateInput: updateInput,
    userId: userId,
    createBodyInput: createBodyInput,
    updateBodyInput: updateBodyInput,
    paramInput: paramInput,
    reviewResponse: reviewResponse,
    reviewsResponse: reviewsResponse,
}