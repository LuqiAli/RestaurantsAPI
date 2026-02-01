export interface AddressInterface {
    id: string
    address_1: string
    address_2: string
    address_3: string
    city: string
    town: string
    postcode: string
    country: string
    created_at: string
    updated_at: string
}

export enum AddressType {
    RESTAURANT = "restaurant",
    USER = "user"
}

export enum userAddressType {
    BILLING = "billing",
    DELIVERY = "delivery"
}

export interface AddressInterfaceBody {
    link_id: string
    type: AddressType
    address_1: string
    address_2: string
    address_3: string
    city: string
    town: string
    postcode: string
    country: string
    user_address_type: string
    is_primary: boolean
}