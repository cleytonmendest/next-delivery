/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react'
import { useAppContext } from '../../contexts/app'
import { useApi } from '../../libs/useApi'
import styles from '../../styles/MyAdresses.module.css'
import { Tenant } from '../../types/Tenant'
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import Head from 'next/head';
import Header from '../../components/Header';
import { useFormatter } from '../../libs/useFormatter';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import { Adress } from '../../types/Adress';
import AddressItem from '../../components/AddressItem';



const MyAdresses = (data: Props) => {
  const { setToken, setUser } = useAuthContext()
  const { tenant, setTenant, setShippingAddress, setShippingPrice } = useAppContext()
  const formater = useFormatter()
  const router = useRouter()
  const api = useApi(data.tenant.slug)

  useEffect(() => {
    setTenant(data.tenant)
    setToken(data.token)
    if (data.user) setUser(data.user)
  }, [])

  const handleAddressSelect = async (adress: Adress) =>{
    const price = await api.getShippingPrice(adress)
    if(price){
      setShippingAddress(adress)
      setShippingPrice(price)
      router.push(`/${data.tenant.slug}/checkout`)
    }
  }

  const handleAddressEdit = (id: number) =>{
    router.push(`/${data.tenant.slug}/address/${id}`)
  }

  const handleAddressDelete = (id: number) =>{
    
  }

  const handleNewAdress = () => {
    router.push(`/${data.tenant.slug}/address/new`)
  }

  // Menu Events
  const [menuOpened, setMenuOpened] = useState(0)

  const handleMenuEvent = (event: MouseEvent) =>{
    const tagName = (event.target as Element).tagName
    if(['path', 'svg'].includes(tagName)){
      setMenuOpened(0)
    }
  }

  useEffect(()=>{
    window.removeEventListener('click', handleMenuEvent)
    window.addEventListener('click', handleMenuEvent)

    return () => window.removeEventListener('click', handleMenuEvent)
  },[menuOpened])

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Meus Endereços | ${data.tenant.name}`}</title>
      </Head>

      <Header
        backHref={`${data.tenant.slug}/checkout`}
        color={data.tenant.primaryColor}
        title="Meus Endereços"
      />

      <div className={styles.list}>
        {data.adresses.map((item, index)=>(
          <AddressItem
            key={index}
            color={data.tenant.primaryColor}
            adresses={item}
            onSelect={handleAddressSelect}
            onEdit={handleAddressEdit}
            onDelete={handleAddressDelete}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
          />
        ))}
      </div>

      <div className={styles.btnArea}>
        <Button 
          color={data.tenant.primaryColor}
          label="Novo Endereço"
          onClick={handleNewAdress}
          fill
        />
      </div>
    </div>
  )
}

export default MyAdresses
type Props = {
  tenant: Tenant
  token: string
  user: User | null
  adresses: Adress[]
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
  if(!user){
    return { redirect: {destination: '/login', permanent:false}}
  }

  //Get Adressess from Logged user
  const adresses = await api.getUserAdresses(user.email)

  return {
    props: {
      tenant,
      user,
      token,
      adresses
    }
  }
}