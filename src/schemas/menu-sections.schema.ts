import * as z from "zod"

const restaurant_id = z.uuid()
const menu_section_id = z.uuid()

const bodySchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be 100 characters or less") 
})

const responseSchema = z.object({
    id: z.uuid(),
    restaurant_id: restaurant_id,
    ...bodySchema.required().shape
})

const responsesSchema = z.array(responseSchema)

const getAllSchema = z.object({
    restaurant_id: restaurant_id
})

const getSchema = z.object({
    menu_section_id: menu_section_id,
    restaurant_id: restaurant_id
})

const paramSchema = z.object({
    menu_section_id: menu_section_id
})

const createSchema = z.object({
    ...bodySchema.required().shape,
    restaurant_id: restaurant_id
})

const updateSchema = z.object({
    ...bodySchema.required().shape,
    menu_section_id: menu_section_id
})

export const menuSectionSchemas = {
    responseSchema,
    responsesSchema,
    bodySchema,
    getAllSchema,
    getSchema,
    createSchema,
    updateSchema,
    paramSchema,
}

type itemSectionResponse = z.infer<typeof responseSchema>
type itemSectionResponses = z.infer<typeof responsesSchema>
type getAllInput = z.infer<typeof getAllSchema>
type getInput = z.infer<typeof getSchema>
type createInput = z.infer<typeof createSchema>
type updateInput = z.infer<typeof updateSchema>
type paramInput = z.infer<typeof paramSchema>
type bodyInput = z.infer<typeof bodySchema>


export type menuSectionTypes = {
    itemSectionResponse: itemSectionResponse,
    itemSectionResponses: itemSectionResponses,
    getAllInput: getAllInput,
    getInput: getInput,
    createInput: createInput,
    updateInput: updateInput,
    paramInput: paramInput,
    bodyInput: bodyInput
}