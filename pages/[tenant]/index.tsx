/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import { getCookie } from 'cookies-next';
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
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import  NoItems  from '../../public/assets/noProductsIcon.svg'


const Home = (data: Props) => {
  const { setToken, setUser } = useAuthContext()
  const { tenant, setTenant } = useAppContext()
  const [searchText, setSearchText] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(data.products)

  useEffect(() => {
    setTenant(data.tenant)
    setToken(data.token)
    if (data.user) setUser(data.user)
  }, [])

  // Search
  const handleSearch = (searchValue: string) => setSearchText(searchValue)

  useEffect(() => {
    let newFilteredProd: Product[] = [];
    for (let product of data.products) {
      if (product.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
        newFilteredProd.push(product)
      }
    }
    setFilteredProducts(newFilteredProd)
  }, [searchText])

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
              onClick={() => setSideBarOpen(true)}
            >
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.primaryColor }} />
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.primaryColor }} />
              <div className={styles.menuButtonLine} style={{ backgroundColor: tenant?.primaryColor }} />
            </div>
            <SideBar
              tenant={data.tenant}
              open={sideBarOpen}
              onClose={() => { setSideBarOpen(false) }}
            />
          </div>
        </div>
        <div className={styles.headerBottom}>
          <SearchInput onSearch={handleSearch} />
        </div>
      </header>
      {!searchText &&
        <>
          <Banner />

          <div className={styles.grid}>
            {products.map((item, index) => (
              <ProductItem
                data={item}
                key={index}
              />
            ))}
          </div>
        </>
      }
      {searchText &&
        <>
          <div className={styles.searchText}>
            Procurando por <strong>{searchText}</strong>
          </div>

          {filteredProducts.length > 0 &&
            <div className={styles.grid}>
            {filteredProducts.map((item, index) => (
              <ProductItem
                data={item}
                key={index}
              />
            ))}
          </div>
          }
          {filteredProducts.length === 0 &&
            <div className={styles.noProducts}>
              <NoItems color='#e0e0e0'/>
              <div className={styles.noProductsText}>
                Ops! Não há itens com esse nome
              </div>
            </div>
          }
        </>
      }
    </div>
  )
}

export default Home
type Props = {
  tenant: Tenant
  products: Product[]
  token: string
  user: User | null
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query
  const api = useApi(tenantSlug as string)

  //Get Tenant
  const tenant = await api.getTenant()

  if (!tenant) {
    return { redirect: { destination: '/', permanent: false } }
  }

  // Get Logged user
  //const token = context.req.cookies.token
  const token = getCookie('token', context) ? getCookie('token', context) : null
  const user = await api.authorizaToken(token as string)

  //Get products
  const products = await api.getAllProducts()

  return {
    props: {
      tenant,
      products,
      user,
      token
    }
  }
}