export const useFormatter = () =>({
    formatPrice: (price:number) =>{
        return price.toLocaleString('pt-br', {
            minimumFractionDigits:2,
            style: 'currency',
            currency: 'BRL'
        })
    },
    formatQuantity: (qt:number, digits:number) =>{
        if(qt.toString().length >= digits) return qt
        
        const remain = digits - qt.toString().length

        return `${'0'.repeat(remain)}${qt}`
    }
})