export interface RestaurantsInterface {
    id: string
    name: string
    website: string
    phone: number
    tag_ids: string[]
    tag_titles: string[]
}

export interface PostRestaurants {
    name: string
    website: string
    phone: number
    tags: string[]
}

export interface RestaurantsInterfaceBody {
    name: string
    website: string
    phone: number
    tags: string[]
}