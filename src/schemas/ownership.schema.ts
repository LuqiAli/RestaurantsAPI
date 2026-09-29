import * as z from "zod"

export const ownershipParams = z.object({
    restaurant_id: z.uuid().optional(),
    address_id: z.uuid().optional(),
    user_id: z.uuid().optional(),
    order_id: z.uuid().optional(),
    review_id: z.uuid().optional()
})

export type ownershipParamsType = z.infer<typeof ownershipParams>