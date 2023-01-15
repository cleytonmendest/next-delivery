import { Dispatch, ReactNode } from "react"
import { Tenant } from "../../types/Tenant"

export type DataType = {
    tenant: Tenant | null
}

export type ActionType = {
    type: Actions
    payload?: any
}

export enum Actions {
    SET_TENANT
}

export type ProviderType = {
    children: ReactNode
}

export type ContextType = {
    state: DataType
    dispatch: Dispatch<ActionType>
}