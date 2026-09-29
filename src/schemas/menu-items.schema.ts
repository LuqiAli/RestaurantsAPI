import * as z from "zod"

const menu_section_id = z.uuid()
const restaurant_id = z.uuid()
const menu_item_id = z.uuid()

const priceSchema = z.coerce
    .number()
    .nonnegative()
    .refine(
        (value) => Number.isInteger(value * 100),
        "Price must have a maximum of 2 decimal places"
    );

const bodySchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    description: z.string().trim().min(1, "Description is required").max(255, "Description must be 255 character or less"),
    price: priceSchema
})

const responseSchema = z.object({
    id: z.uuid(),
    ...bodySchema.required().shape
})

const responsesSchema = z.array(responseSchema)

const getAllSchema = z.object({
    menu_section_id: menu_section_id
})

const getSchema = z.object({
    menu_item_id: menu_item_id
})

const createSchema = z.object({
    restaurant_id: restaurant_id,
    menu_section_id: menu_section_id,
    ...bodySchema.required().shape
})

const updateSchema = z.object({
    restaurant_id: restaurant_id,
    menu_item_id: menu_item_id,
    ...bodySchema.required().shape
})

const paramSchema = z.object({
    restaurant_id: restaurant_id,
    menu_section_id: menu_section_id
})

const paramsSchema = z.object({
    restaurant_id: restaurant_id,
    menu_item_id: menu_item_id
})

export const menuItemSchemas = {
    responseSchema,
    responsesSchema,
    getAllSchema,
    getSchema,
    createSchema,
    updateSchema,
    bodySchema,
    paramSchema,
    paramsSchema
}

type bodyInput = z.infer<typeof bodySchema>
type getInput = z.infer<typeof getSchema>
type getAllInput = z.infer<typeof getAllSchema>
type createInput = z.infer<typeof createSchema>
type updateInput = z.infer<typeof updateSchema>
type paramInput = z.infer<typeof paramSchema>
type paramsInput = z.infer<typeof paramsSchema>
type itemResponseSchema = z.infer<typeof responseSchema>
type itemResponsesSchema = z.infer<typeof responsesSchema>

export type menuItemTypes = {
    getAllInput: getAllInput,
    getInput: getInput,
    bodyInput: bodyInput,
    paramInput: paramInput,
    paramsInput: paramsInput,
    createInput: createInput,
    updateInput: updateInput,
    itemResponseSchema: itemResponseSchema,
    itemResponsesSchema: itemResponsesSchema
}