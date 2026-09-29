import * as z from "zod"

const menu_item_id = z.uuid()
const restaurant_id = z.uuid()
const menu_item_section_id = z.uuid()

const menu_item_idSchema = z.object({
    menu_item_id: menu_item_id
})

const paramSchema = z.object({
    restaurant_id: restaurant_id,
    menu_item_id: menu_item_id
})

const paramsSchema = z.object({
    restaurant_id: restaurant_id,
    menu_item_id: menu_item_id,
    menu_item_section_id: menu_item_section_id
})

const menu_item_section_idSchema = z.object({
    menu_item_section_id: menu_item_section_id
})

const bodySchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(25, "Name must be 25 characters or less"),
    required: z.coerce.boolean(),
    multiple: z.coerce.boolean()
})

const responseSchema = z.object({
    id: z.uuid(),
    restaurant_id: restaurant_id,
    menu_item_id: menu_item_id,
    ...bodySchema.required().shape
})

const responsesSchema = z.array(responseSchema)

const createSchema = z.object({
    ...bodySchema.required().shape,
    ...paramSchema.required().shape
})

const updateSchema = z.object({
    ...bodySchema.required().shape,
    menu_item_section_id: menu_item_section_id
})

export const menuItemSectionsSchemas = {
    bodySchema,
    menu_item_idSchema,
    paramSchema,
    paramsSchema,
    menu_item_section_idSchema,
}

type paramInputSchema = z.infer<typeof paramSchema>
type paramsInputSchema = z.infer<typeof paramsSchema>
type menu_item_section_idInputSchema = z.infer<typeof menu_item_section_idSchema>
type menu_item_idInputSchema = z.infer<typeof menu_item_idSchema>
type bodyInputSchema = z.infer<typeof bodySchema>
type menuItemSectionsResponse = z.infer<typeof responseSchema>
type menuItemSectionsResponses = z.infer<typeof responsesSchema>
type createInputSchema = z.infer<typeof createSchema>
type updateInputSchema = z.infer<typeof updateSchema>

export type menuItemSectionsTypes = {
    paramInputSchema: paramInputSchema,
    paramsInputSchema: paramsInputSchema,
    menu_item_section_idInputSchema: menu_item_section_idInputSchema,
    bodyInputSchema: bodyInputSchema,
    menuItemSectionsResponse: menuItemSectionsResponse,
    menuItemSectionsResponses: menuItemSectionsResponses,
    createInputSchema: createInputSchema,
    updateInputSchema: updateInputSchema,
    menu_item_idInputSchema: menu_item_idInputSchema,
}