import { Dispatch, ReactNode } from "react"
import { Adress } from "../../types/Adress"
import { Tenant } from "../../types/Tenant"

export type DataType = {
    tenant: Tenant | null
    shippingAddress: Adress | null
    shippingPrice: number
}

export type ActionType = {
    type: Actions
    payload?: any
}

export enum Actions {
    SET_TENANT,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_PRICE
}

export type ProviderType = {
    children: ReactNode
}

export type ContextType = {
    state: DataType
    dispatch: Dispatch<ActionType>
}