import { Product } from "../types/Product"
import { Tenant } from "../types/Tenant"


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
                    primaryColor: '#FF0000',
                    secondaryColor: '#00FF00'
                }
            case 'b7pizza':
                return {
                    slug:'b7pizza',
                    name: 'B7Pizza',
                    primaryColor: '#0000FF',
                    secondaryColor: '#FF0000'
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
    }
})