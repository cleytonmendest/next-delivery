import { Adress } from "../types/Adress"
import { CartItem } from "../types/CartItem"
import { Product } from "../types/Product"
import { Tenant } from "../types/Tenant"
import { User } from "../types/User"


const TEMPORARYoneProduct: Product = {
    id: 1,
    categoryName: 'Tradicional',
    price: 25.5,
    name: 'Texas Burger',
    image: '/temp/burger.png',
    description: '2 blend queijo molho especial cebola picles e pão com gergilin'
}

export const useApi = (tenantSlug: string) => ({
    getTenant: async () => {
        switch (tenantSlug) {
            case 'b7burger':
                return {
                    slug: 'b7burger',
                    name: 'B7Burger',
                    primaryColor: '#FB9400',
                    secondaryColor: '#FFF9F2'
                }
            case 'b7pizza':
                return {
                    slug: 'b7pizza',
                    name: 'B7Pizza',
                    primaryColor: '#6AB70A',
                    secondaryColor: 'E0E0E0'
                }
            default: return false
        }
    },

    getAllProducts: async () => {
        let products = []
        for (let q = 0; q < 10; q++) {
            products.push({
                ...TEMPORARYoneProduct,
                id: q + 1
            })
        }
        return products
    },

    getProduct: async (id: number) => {
        return { ...TEMPORARYoneProduct, id }
    },

    authorizaToken: async (token: string): Promise<User | false> => {
        if (!token) return false

        return {
            name: "Jamanta",
            email: 'teste@teste.com'
        }
    },
    getCartProducts: async (cartCookie: string) => {
        let cart: CartItem[] = []
        if (!cartCookie) return cart

        const cartJson = JSON.parse(cartCookie)
        for (let i in cartJson) {
            if (cartJson[i].id && cartJson[i].qt) {
                const product = {
                    ...TEMPORARYoneProduct,
                    id: cartJson[i].id
                }
                cart.push({
                    qt: cartJson[i].qt,
                    product
                })
            }
        }
        return cart
    },
    getUserAddress: async (addressid: number) => {
        const address: Adress = {
            id: addressid,
            cep: "9999999",
            street: "Rua da Cebola",
            number: `${addressid}00`,
            neighborhood: "fodase",
            city: "São pela",
            state: "RJ"
        }

        return address
    },
    getUserAdresses: async (email: string) => {
        const adresses: Adress[] = []

        for (let i = 0; i < 4; i++) {
            adresses.push({
                id: i + 1,
                cep: "9999999",
                street: "Rua da Cebola",
                number: `${i + 1}00`,
                neighborhood: "fodase",
                city: "São pela",
                state: "RJ"
            })
        }

        return adresses
    },

    addUserAddress: async (address: Adress) => {
        return { ...address, id: 9 }
    },

    editUserAddress: async (newAddress: Adress) =>{
        return true;
    },

    getShippingPrice: async (address: Adress) => {
        return 9.16
    }
})