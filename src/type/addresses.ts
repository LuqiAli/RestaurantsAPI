export interface AddressInterface {
    id: string
    restaurant_id: string
    user_id: string
    is_restaurant: boolean
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
}