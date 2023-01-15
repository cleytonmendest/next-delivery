/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import Banner from '../../components/Banner'
import ProductItem from '../../components/ProductItem'
import SearchInput from '../../components/SearchInput'
import SideBar from '../../components/SideBar'
import { useAppContext } from '../../contexts/app'
import { useApi } from '../../libs/useApi'
import styles from '../../styles/Home.module.css'
import { Product } from '../../types/Product'
import { Tenant } from '../../types/Tenant'


const Home = (data: Props) => {
  const { tenant, setTenant } = useAppContext()
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(data.products)

  useEffect(() => {
    setTenant(data.tenant)
  }, [data.tenant, setTenant])


  const handleSearch = (searchValue: string) => {
    console.log("você está porra", searchValue)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerTopLeft}>
            <div className={styles.headerTitle}>
              Seja Bem Vindo (a)
            </div>
            <div className={styles.headerSubtitle}>
              O que deseja para hoje
            </div>
          </div>
          <div className={styles.headerTopRight}>
            <div
              className={styles.menuButton}
              onClick={()=>setSideBarOpen(true)}
            >
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.primaryColor }} />
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.primaryColor }} />
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.primaryColor }} />
            </div>
            <SideBar
              tenant={data.tenant}
              open={sideBarOpen}
              onClose={()=>{setSideBarOpen(false)}}
            />
          </div>
        </div>
        <div className={styles.headerBottom}>
          <SearchInput onSearch={() => handleSearch} />
        </div>
      </header>
      <Banner />

      <div className={styles.grid}>
        {products.map((item, index) => (
          <ProductItem
            data={item}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
type Props = {
  tenant: Tenant,
  products: Product[]
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query
  const api = useApi(tenantSlug as string)

  //Get Tenant
  const tenant = await api.getTenant()

  if (!tenant) {
    return { redirect: { destination: '/', permanent: false } }
  }

  //Get products
  const products = await api.getAllProducts()

  return {
    props: {
      tenant,
      products
    }
  }
}