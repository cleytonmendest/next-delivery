/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import Header from '../../components/Header'
import { Icon } from '../../components/Icon'
import { useAppContext } from '../../contexts/AppContext'
import { useApi } from '../../libs/useApi'
import styles from '../../styles/ForgetSucess.module.css'
import { Tenant } from '../../types/Tenant'


const ForgetSucess = (data: Props) => {
  const { tenant, setTenant } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    setTenant(data.tenant)
  }, [data.tenant, setTenant])

  const handleSubmit = () => {
    router.push(`/${tenant?.slug}/login`)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Esqueci a Senha | {tenant?.name}</title>
      </Head>
      <Header
        color={tenant?.primaryColor as string}
        backHref={`${tenant?.slug}/forget`}
      />

      <div className={styles.iconArea}>
        <Icon icon='mainSent' color={tenant?.primaryColor as string} width={99} height={81}/>
      </div>

      <div className={styles.title}>
        Verifique seu e-mail
      </div>

      <div
        className={styles.subtitle}
      >
        Enviamos as instruções para recuperação de senha para o seu e-mail
      </div>


      <div className={styles.inputArea}>
        <Button
          color={tenant?.primaryColor as string}
          label="Fazer Login"
          onClick={handleSubmit}
          fill
        />
      </div>
    </div>
  )
}

export default ForgetSucess
type Props = {
  tenant: Tenant
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query
  const api = useApi()

  //Get Tenant
  const tenant = await api.getTenant(tenantSlug as string)

  if (!tenant) {
    return { redirect: { destination: '/', permanent: false } }
  }

  return {
    props: {
      tenant
    }
  }
}