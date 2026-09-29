import * as z from "zod"

const restaurant_id = z.uuid()
const menu_item_section_id = z.uuid()
const menu_item_option_id = z.uuid()

const priceSchema = z.coerce
    .number()
    .nonnegative()
    .refine(
        (value) => Number.isInteger(value * 100),
        "Price must have a maximum of 2 decimal places"
    );

const responseSchema = z.object({
    id: z.uuid(),
    restaurant_id: restaurant_id,
    menu_item_section_id: menu_item_section_id,
    name: z.string().trim().min(1, "Name is required").max(25, "Name must be 25 characters or less"),
    price: priceSchema
})

const responsesSchema = z.array(responseSchema)

const getAllSchema = z.object({
    restaurant_id: restaurant_id,
    menu_item_section_id: menu_item_section_id
})

const getSchema = z.object({
    restaurant_id: restaurant_id,
    menu_item_option_id: menu_item_section_id
})

const bodySchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(25, "Name must be 25 characters or less"),
    price: priceSchema
})

const updateSchema = z.object({
    menu_item_option_id: menu_item_section_id,
    ...bodySchema.required().shape
})

const createSchema = z.object({
    menu_item_section_id: menu_item_section_id,
    ...bodySchema.required().shape,
    restaurant_id: restaurant_id
})

const paramSchema = z.object({
    menu_item_option_id: menu_item_option_id
})

const paramsSchema = z.object({
    menu_item_option_id: menu_item_option_id,
    restaurant_id: restaurant_id
})

export const menuItemOptionsSchemas = {
    responseSchema,
    responsesSchema,
    getAllSchema,
    getSchema,
    createSchema,
    updateSchema,
    paramSchema,
    paramsSchema,
    bodySchema
}

type menuItemOptionResponse = z.infer<typeof responseSchema>
type menuItemOptionsResponse = z.infer<typeof responsesSchema>
type getAllInput = z.infer<typeof getAllSchema>
type getInput = z.infer<typeof getSchema>
type bodyInputSchema = z.infer<typeof bodySchema>
type paramInputSchema = z.infer<typeof paramSchema>
type paramsInputSchema = z.infer<typeof paramsSchema>
type createInput = z.infer<typeof createSchema>
type updateInput = z.infer<typeof updateSchema>
type menu_item_option_idSchema = z.infer<typeof menu_item_option_id>

export type menuItemOptionsTypes = {
    menuItemOptionResponse: menuItemOptionResponse,
    menuItemOptionsResponse: menuItemOptionsResponse,
    getAllInput: getAllInput,
    getInput: getInput,
    bodyInputSchema: bodyInputSchema,
    paramInputSchema: paramInputSchema,
    paramsInputSchema: paramsInputSchema,
    createInput: createInput,
    updateInput: updateInput,
    menu_item_option_idSchema: menu_item_option_idSchema,
}