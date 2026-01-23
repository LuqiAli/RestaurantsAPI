export enum OrderStatus {
    PROCESSING = "processing",
    RECEIVED = "received",
    PREPARING = "preparing",
    DELIVERY = "delivery"
}

export interface OrdersInterface {
    id: string
    restaurant_id: string
    user_id: string
    is_delivery: boolean
    status: OrderStatus
}

export enum OrderType { 
    DELIVERY = "delivery",
    COLLECTION = "collection"
}

export interface OrdersInterfaceBody {
    restaurant_id: string
    user_id: string
    delivery_address: string
    type: OrderType
}