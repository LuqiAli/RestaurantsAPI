export interface UsersInterface {
    id: string
    name: string
    password: string
    email: string
    created_at: string
    updated_at: string
    phone: string
    roles: string[]
}

export interface UsersInterfaceBody {
    name: string
    password: string
    email: string
    phone: number
}

