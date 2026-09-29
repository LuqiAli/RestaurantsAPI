import * as z from "zod"

// Enum types for address
const addressTypeSchema = z.enum(["user", "restaurant"])
const userAddressTypeSchema = z.enum(["billing", "delivery"]).optional()

// Schema for HTTP request validation
const addressResponseSchema = z.object({
    id: z.uuid(),
    address_1: z.string().trim().min(1, "Address line 1 is required").max(100, "Address line 1 must be 100 characters or less"),
    address_2: z.string().trim().max(100, "Address line 1 must be 100 characters or less").optional(),
    address_3: z.string().trim().max(100, "Address line 1 must be 100 characters or less").optional(),
    city: z.string().trim().min(1, "City is required").max(100, "City must be 100 characters or less"),
    town: z.string().trim().max(100, "Town must be 100 characters or less").optional(),
    postcode: z.string().trim().min(1, "Postcode is required").max(20, "Postcode must be 20 characters or less"),
    country: z.string().trim().min(1, "Country is required").max(100, "Country must be 100 characters or less"),
})

const addressesResponseSchema = z.array(addressResponseSchema)

const createAddressSchema = z.object({
    address_1: z.string().trim().min(1, "Address line 1 is required").max(100, "Address line 1 must be 100 characters or less"),
    address_2: z.string().trim().max(100, "Address line 2 must be 100 characters or less").optional(),
    address_3: z.string().trim().max(100, "Address line 3 must be 100 characters or less").optional(),
    city: z.string().trim().min(1, "City is required").max(100, "City must be 100 characters or less"),
    town: z.string().trim().max(100, "Town must be 100 characters or less").optional(),
    postcode: z.string().trim().min(1, "Postcode is required").max(20, "Postcode must be 20 characters or less"),
    country: z.string().trim().min(1, "Country is required").max(100, "Country must be 100 characters or less"),
    link_id: z.uuid(),
    type: addressTypeSchema,
    user_address_type: userAddressTypeSchema,
    is_primary: z.coerce.boolean(),
})

const updateAddressSchema = createAddressSchema.partial().extend({
    address_id: z.uuid(),
    address_1: z.string().trim().min(1, "Address line 1 is required").max(100, "Address line 1 must be 100 characters or less"),
    address_2: z.string().trim().max(100, "Address line 2 must be 100 characters or less").optional(),
    address_3: z.string().trim().max(100, "Address line 3 must be 100 characters or less").optional(),
    city: z.string().trim().min(1, "City is required").max(100, "City must be 100 characters or less"),
    town: z.string().trim().max(100, "Town must be 100 characters or less").optional(),
    postcode: z.string().trim().min(1, "Postcode is required").max(20, "Postcode must be 20 characters or less"),
    country: z.string().trim().min(1, "Country is required").max(100, "Country must be 100 characters or less")
})

const addressParamsSchema = z.object({
    address_id: z.uuid()
})

// Schema for typescript types
type AddressResponse = z.infer<typeof addressResponseSchema>
type AddressesResponse = z.infer<typeof addressesResponseSchema>
type CreateAddressInput = z.infer<typeof createAddressSchema>
type UpdateAddressInput = z.infer<typeof updateAddressSchema>

export const addressSchemas = {
    addressResponseSchema,
    addressesResponseSchema,
    createAddressSchema,
    updateAddressSchema,
    addressParamsSchema
}

export type addressTypes = {
    getAll: AddressResponse,
    get: AddressesResponse,
    create: CreateAddressInput,
    update: UpdateAddressInput,
}