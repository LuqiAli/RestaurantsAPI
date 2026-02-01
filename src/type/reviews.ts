export interface ReviewsInterface {
    id: string
    restaurant_id: string
    user_id: string
    rating: number
    review: string
    created_at: string
    updated_at: string
}

export interface ReviewsInterfaceBody {
    restaurant_id: string
    rating: number
    review: string
}