/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import Header from '../../components/Header'
import InputField from '../../components/InputField'
import { useAppContext } from '../../contexts/app'
import { useApi } from '../../libs/useApi'
import styles from '../../styles/Forget.module.css'
import { Tenant } from '../../types/Tenant'


const Forget = (data: Props) => {
  const { tenant, setTenant } = useAppContext()
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    setTenant(data.tenant)
  }, [data.tenant, setTenant])

  const handleSubmit = () => {
    router.push(`/${tenant?.slug}/forget-sucess`)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Esqueci a Senha | {tenant?.name}</title>
      </Head>
      <Header
        color={tenant?.primaryColor as string}
        backHref={`${tenant?.slug}/login`}
      />
      <div className={styles.header}>
        {tenant?.name}
      </div>

      <div className={styles.title}>
        Esqueceu sua senha?
      </div>

      <div
        className={styles.subtitle}
        style={{borderBottomColor: tenant?.primaryColor}}
      >
        Preencha o campo com o seu e-mail e receba instruções necessárias para redefinir sua senha.
      </div>

      <div className={styles.line} />

      <div className={styles.formArea}>

        <div className={styles.inputArea}>
          <InputField
            color={tenant?.primaryColor as string}
            placeholder="Digite seu email"
            value={email}
            onChange={setEmail}
          />
        </div>

        <div className={styles.inputArea}>
          <Button
            color={tenant?.primaryColor as string}
            label="Enviar"
            onClick={handleSubmit}
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default Forget
type Props = {
  tenant: Tenant
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tenant: tenantSlug } = context.query
  const api = useApi(tenantSlug as string)

  //Get Tenant
  const tenant = await api.getTenant()

  if (!tenant) {
    return { redirect: { destination: '/', permanent: false } }
  }

  return {
    props: {
      tenant
    }
  }
}