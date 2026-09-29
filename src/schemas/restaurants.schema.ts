import * as z from "zod"
import { tagsSchema } from "./tags.schema"

const user_id = z.uuid()
const user_id_obj = z.object({
    user_id: user_id
})

const restaurant_id = z.uuid()
const restaurant_id_obj = z.object({
    restaurant_id: restaurant_id
})

const bodySchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    website: z.url().max(100),
    phone: z.string().trim().min(7).max(30),
    tags: z.array(z.uuid())
})   

const responseSchema = z.object({
    ...bodySchema.required().shape,
    tags: tagsSchema.tagSchema,
    avg_rating: z.coerce.number().min(0).max(5)
})

const responsesSchema = z.array(responseSchema)

const createSchema = z.object({
    body: bodySchema,
    user_id: user_id
})

const updateSchema = z.object({
    ...bodySchema.required().shape,
    restaurant_id: restaurant_id
})

export const restaurantsSchemas = {
    bodySchema,
    user_id_obj,
    user_id,
    restaurant_id_obj
}

type restaurantReponse = z.infer<typeof responseSchema>
type restaurantsReponse = z.infer<typeof responsesSchema>
type createInput = z.infer<typeof createSchema>
type updateInput = z.infer<typeof updateSchema>
type userIdInput = z.infer<typeof user_id>
type bodyInput = z.infer<typeof bodySchema>
type paramInput = z.infer<typeof restaurant_id_obj>

export type restaurantsTypes = {
    restaurantReponse: restaurantReponse,
    restaurantsReponse: restaurantsReponse,
    createInput: createInput,
    updateInput: updateInput,
    userIdInput: userIdInput,
    paramInput: paramInput,
    bodyInput: bodyInput
}