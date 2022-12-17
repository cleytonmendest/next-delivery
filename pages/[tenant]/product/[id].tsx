/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import Button from '../../../components/Button'
import Header from '../../../components/Header'
import { useAppContext } from '../../../contexts/AppContext'
import { useApi } from '../../../libs/useApi'
import { useFormatter } from '../../../libs/useFormatter'
import styles from '../../../styles/Product-id.module.css'
import { Product } from '../../../types/Product'
import { Tenant } from '../../../types/Tenant'


const Product = (data: Props) => {
    const { tenant, setTenant } = useAppContext()
    const formatter = useFormatter()

    useEffect(() => {
        setTenant(data.tenant)
    }, [data.tenant, setTenant])

    const handleAddToCart = () =>{
        
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{data.product.name} | {tenant?.name}</title>
            </Head>

            <div className={styles.headerArea}>
                <Header
                    color={tenant?.primaryColor as string}
                    backHref={tenant?.slug as string}
                    title="Produto"
                    invert
                />
            </div>

            <div className={styles.headerBg} style={{backgroundColor: tenant?.primaryColor}}></div>

            <div className={styles.productImage}>
                <img src={data.product.image} alt="" />
            </div>

            <div className={styles.category}>{data.product.categoryName}</div>
            <div className={styles.title} style={{borderBottomColor: data.tenant.primaryColor}}>{data.product.name}</div>
            <div className={styles.line}></div>
            <div className={styles.description}>{data.product.description}</div>
            <div className={styles.qtText}>Quantidade</div>
            <div className={styles.area}>
                <div className={styles.areaLeft}>

                </div>
                <div
                    className={styles.areaRight}
                    style={{color: data.tenant.primaryColor}}>
                    {formatter.formatPrice(data.product.price)}
                </div>
            </div>
            <div className={styles.buttonArea}>
                <Button 
                    color={data.tenant.primaryColor}
                    label="Adicionar a sacola"
                    onClick={handleAddToCart}
                    fill
                />
            </div>
        </div>
    )
}

export default Product
type Props = {
    tenant: Tenant,
    product: Product
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug, id } = context.query
    const api = useApi(tenantSlug as string)

    //Get Tenant
    const tenant = await api.getTenant()

    if (!tenant) {
        return { redirect: { destination: '/', permanent: false } }
    }

    //Get products
    const product = await api.getProduct(id as string)

    return {
        props: {
            tenant,
            product
        }
    }
}