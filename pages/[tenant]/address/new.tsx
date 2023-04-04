/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../contexts/app'
import { useApi } from '../../../libs/useApi'
import styles from '../../../styles/NewAddress.module.css'
import { Tenant } from '../../../types/Tenant'
import { User } from '../../../types/User';
import { useAuthContext } from '../../../contexts/auth';
import Head from 'next/head';
import Header from '../../../components/Header';
import { useFormatter } from '../../../libs/useFormatter';
import { useRouter } from 'next/router';
import Button from '../../../components/Button';
import { Adress } from '../../../types/Adress';
import AddressItem from '../../../components/AddressItem';
import InputField from '../../../components/InputField';



const NewAddress = (data: Props) => {
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

  const [errorFields, setErrorFields] = useState<string[]>([])

  const [adressCep, setAdressCep] = useState<string>('')
  const [adressStreet, setAdressStreet] = useState<string>('')
  const [adressNumber, setAdressNumber] = useState<string>('')
  const [adressNeighborhood, setAdressNeighborhood] = useState<string>('')
  const [adressCity, setAdressCity] = useState<string>('')
  const [adressState, setAdressState] = useState<string>('')
  const [adressComplement, setAdressComplement] = useState<string>('')

  const verifyAdress = () => {
    let newErrorFields:string[] = []
    let approved = true

    if(adressCep.replaceAll(/[^0-9]/g, '').length !== 8){
      newErrorFields.push('cep')
      approved = false
    }

    if(adressStreet.length <= 2){
      newErrorFields.push('street')
      approved = false
    }

    if(adressNeighborhood.length <= 2){
      newErrorFields.push('neighborhood')
      approved = false
    }

    if(adressCity.length <= 2){
      newErrorFields.push('city')
      approved = false
    }

    if(adressState.length <= 2){
      newErrorFields.push('state')
      approved = false
    }

    setErrorFields(newErrorFields)
    return approved
  }

  const handleNewAdress = () => {
    if(verifyAdress()){

    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Novo Endereço | ${data.tenant.name}`}</title>
      </Head>

      <Header
        backHref={`${data.tenant.slug}/checkout`}
        color={data.tenant.primaryColor}
        title="Novo Endereço"
      />

      <div className={styles.inputs}>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>CEP</div>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite um CEP"
              value={adressCep}
              onChange={value => setAdressCep(value)}
              warning={errorFields.includes('cep')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>Rua</div>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite uma Rua"
              value={adressStreet}
              onChange={value => setAdressStreet(value)}
              warning={errorFields.includes('street')}
            />
          </div>
          <div className={styles.column}>
            <div className={styles.label}>Número</div>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite um Número"
              value={adressNumber}
              onChange={value => setAdressNumber(value)}
              warning={errorFields.includes('number')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>Bairro</div>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite um Bairro"
              value={adressNeighborhood}
              onChange={value => setAdressNeighborhood(value)}
              warning={errorFields.includes('neighborhood')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>Cidade</div>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite uma Cidade"
              value={adressCity}
              onChange={value => setAdressCity(value)}
              warning={errorFields.includes('city')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>Estado</div>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite um Estado"
              value={adressState}
              onChange={value => setAdressState(value)}
              warning={errorFields.includes('state')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>Complemento</div>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite um Complemento"
              value={adressComplement}
              onChange={value => setAdressComplement(value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.btnArea}>
        <Button 
          color={data.tenant.primaryColor}
          label="Adicionar"
          onClick={handleNewAdress}
          fill
        />
      </div>
    </div>
  )
}

export default NewAddress
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