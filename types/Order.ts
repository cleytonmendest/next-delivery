import { Adress } from "./Adress"
import { CartItem } from "./CartItem"

export type Order = {
    id: number
    status: 'preparing' | 'sent' | 'delivered'
    orderDate: string
    userId: string
    shippingAddress: Adress
    shippingPrice: number
    paymentType: 'money' | 'card'
    paymentChange?: number
    cupom?: string
    cupomDiscount?: number
    products: CartItem[]
    subtotal: number
    total: number
}