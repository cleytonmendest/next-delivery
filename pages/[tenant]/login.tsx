/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import Header from '../../components/Header'
import InputField from '../../components/InputField'
import { useAppContext } from '../../contexts/app'
import { useApi } from '../../libs/useApi'
import styles from '../../styles/Login.module.css'
import { Tenant } from '../../types/Tenant'


const Login = (data: Props) => {
  const { tenant, setTenant } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    setTenant(data.tenant)
  }, [data.tenant, setTenant])

  const handleSubmit = () => {

  }

  const handleSignup = () => router.push(`/${tenant?.slug}/signup`)

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | {tenant?.name}</title>
      </Head>
      <Header
        color={tenant?.primaryColor as string}
        backHref={tenant?.slug as string}
      />
      <div className={styles.header}>
        {tenant?.name}
      </div>

      <div
        className={styles.subtitle}
        style={{borderBottomColor: tenant?.primaryColor}}
      >
        Use suas credenciais para realizar o login.
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
          <InputField
            color={tenant?.primaryColor as string}
            placeholder="Digite sua senha"
            value={password}
            onChange={setPassword}
            password
          />
        </div>

        <div className={styles.inputArea}>
          <Button
            color={tenant?.primaryColor as string}
            label="Entrar"
            onClick={handleSubmit}
            fill
          />
        </div>
      </div>

      <div
        className={styles.forgetArea}
        style={{borderBottomColor: tenant?.primaryColor}}
      >
        Esqueceu sua senha? <Link
          href={`/${tenant?.slug}/forget`}
          className={styles.forgetLink}
          style={{color: tenant?.primaryColor}}
        >
          Clique Aqui
        </Link>
      </div>

      <div className={styles.line} />

      <div className={styles.signupArea}>
        <Button
          color={tenant?.primaryColor as string}
          label="Quero me cadastrar"
          onClick={handleSignup}
        />
      </div>

    </div>
  )
}

export default Login
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