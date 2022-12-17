/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../../../components/Header'
import { useAppContext } from '../../../contexts/AppContext'
import { useApi } from '../../../libs/useApi'
import styles from '../../../styles/Product-id.module.css'
import { Product } from '../../../types/Product'
import { Tenant } from '../../../types/Tenant'


const Product = (data: Props) => {
    const { tenant, setTenant } = useAppContext()

    useEffect(() => {
        setTenant(data.tenant)
    }, [data.tenant, setTenant])

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