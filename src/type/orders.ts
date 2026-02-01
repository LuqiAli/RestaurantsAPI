export enum OrderStatus {
    PROCESSING = "processing",
    RECEIVED = "received",
    PREPARING = "preparing",
    DELIVERY = "delivery",
    CANCELLED = "cancelled"
}

export interface OrdersInterface {
    id: string
    restaurant_id: string
    is_delivery: boolean
    user_id: string
    status: OrderStatus
    order_items: {
        order_items_id: string
        item_id: string
        quantity: number
        item_price: number
    }
}

export interface OrdersInterfaceBody {
    restaurant_id: string
    delivery_address: string
    is_delivery: boolean
    items: {
        item_id: string
        quantity: number
        item_price: number
    }[]
}