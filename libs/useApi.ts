import { Product } from "../types/Product"
import { Tenant } from "../types/Tenant"
import { User } from "../types/User"


const TEMPORARYoneProduct:Product ={
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
                    slug:'b7burguer',
                    name: 'B7Burger',
                    primaryColor: '#FB9400',
                    secondaryColor: '#FFF9F2'
                }
            case 'b7pizza':
                return {
                    slug:'b7pizza',
                    name: 'B7Pizza',
                    primaryColor: '#6AB70A',
                    secondaryColor: 'E0E0E0'
                }
            default: return false
        }
    },

    getAllProducts: async () => {
        let products = []
        for(let q = 0; q < 10; q++){
            products.push(TEMPORARYoneProduct)
        }
        return products
    },

    getProduct: async (id: string) =>{
        return TEMPORARYoneProduct
    },

    authorizaToken: async (token: string): Promise<User | false> =>{
        if(!token) return false

        return{
            name:"Jamanta",
            email: 'teste@teste.com'
        }
    }
})