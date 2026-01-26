export interface Tags {
    id: string
    title: string
    type: string
}

export interface RestaurantsInterface {
    id: string
    name: string
    website: string
    phone: number
    tags: Tags[]
}

export interface RestaurantsInterfaceBody {
    name: string
    website: string
    phone: number
    tags: string[]
}