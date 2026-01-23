export interface MenuItemsInterface {
    id: string
    menu_id: string
    name: string
    description: string
    price: number
    created_at: string
    updated_at: string
}

export interface MenuItemsInterfaceBody {
    menu_id: string
    name: string
    description: string
    price: number
}