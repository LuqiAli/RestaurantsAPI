import { CreateSchema } from "node-pg-migrate";
import * as z from "zod"

const orderStatus = z.enum(["processing", "received", "preparing", "delivery", "cancelled"])

const priceSchema = z.coerce
    .number()
    .nonnegative()
    .refine(
        (value) => Number.isInteger(value * 100),
        "Price must have a maximum of 2 decimal places"
    );

const user_id = z.object({
    user_id: z.uuid()
})

const user_id_t = z.uuid()

const order_id = z.object({
    order_id: z.uuid()
})

const itemOptionSchema = z.object({
    id: z.uuid(),
})

const itemSchema = z.object({
    id: z.uuid(),
    quantity: z.coerce.number().nonnegative(),
    item_options: z.array(itemOptionSchema)
})

const updateBody = z.object({
    status: orderStatus
})

const bodySchema = z.object({
    restaurant_id: z.uuid(),
    is_delivery: z.coerce.boolean(),
    items: z.array(itemSchema)
})

const createSchema = z.object({
    ...bodySchema.required().shape,
    ...user_id.required().shape,
    client: z.any()
})

const updateSchema = z.object({
    ...updateBody.required().shape,
    ...order_id.required().shape
})

const orderItemOptionsResponse = z.object({
    order_item_option_id: z.uuid(),
    ...itemOptionSchema.required().shape,
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    price: priceSchema
})

const orderItemsResponse = z.object({
    ...itemSchema.required().shape,
    item_options: z.array(orderItemOptionsResponse),
    order_item_id: z.uuid(),
    price: priceSchema,
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
})

const responseSchema = z.object({
    id: z.uuid(),
    status: orderStatus,
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be 100 characters or less"), 
    phone: z.string().trim().min(7).max(30),
    ...bodySchema.required().shape,
    items: z.array(orderItemsResponse),
})

const responsesSchema = z.array(responseSchema)

export const orderSchemas = {
    bodySchema,
    updateBody,
    user_id,
    order_id,   
}

type order_idInput = z.infer<typeof order_id>
type user_id_type = z.infer<typeof user_id_t>
type user_idInput = z.infer<typeof user_id>
type createInput = z.infer<typeof createSchema>
type updateInput = z.infer<typeof updateSchema>
type bodyInput = z.infer<typeof bodySchema>
type updateBodyInput = z.infer<typeof updateBody>
type orderResponse = z.infer<typeof responseSchema>
type ordersResponse = z.infer<typeof responsesSchema>

export type ordersTypes = {
    order_idInput: order_idInput,
    user_id_type: user_id_type,
    user_idInput: user_idInput,
    createInput: createInput,
    updateInput: updateInput,
    bodyInput: bodyInput,
    updateBodyInput: updateBodyInput,
    orderResponse: orderResponse,
    ordersResponse: ordersResponse
}