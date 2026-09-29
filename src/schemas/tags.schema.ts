import * as z from "zod"

const tagType = z.enum(["cuisine", "dishes", "dietary", "type"])

const createSchema = z.object({
    title: z.string().trim().min(1).max(25),
    type: tagType
})

const tagSchema = z.object({
    id: z.uuid(),
    ...createSchema.required().shape
})

const paramSchema = z.object({
    tag_id: z.uuid()
})

const updateSchema = z.object({
    ...createSchema.required().shape,
    ...paramSchema.required().shape
})

const responsesSchema = z.array(tagSchema)

export const tagsSchema = {
    tagSchema,
    createSchema,
    paramSchema,
}

type createInput = z.infer<typeof createSchema> 
type updateInput = z.infer<typeof updateSchema> 
type tagResponseSchema = z.infer<typeof tagSchema>
type tagsResponseSchema = z.infer<typeof responsesSchema>
type paramInput = z.infer<typeof paramSchema>

export type tagsTypes = {
    createInput: createInput,
    updateInput: updateInput,
    tagResponseSchema: tagResponseSchema,
    tagsResponseSchema: tagsResponseSchema,
    paramInput: paramInput
}