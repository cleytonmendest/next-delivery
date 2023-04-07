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



const EditAddress = (data: Props) => {
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
    const [address, setAddress] = useState<Adress>(data.address)

    const changeAddressField = (
        field: keyof Adress,
        value: typeof address[keyof Adress]
    ) =>{
        setAddress({...address, [field]: value})
    }

    const verifyAdress = () => {
        let newErrorFields: string[] = []
        let approved = true

        if (address.cep.replaceAll(/[^0-9]/g, '').length !== 8) {
            newErrorFields.push('cep')
            approved = false
        }

        if (address.street.length <= 2) {
            newErrorFields.push('street')
            approved = false
        }

        if (address.neighborhood.length <= 2) {
            newErrorFields.push('neighborhood')
            approved = false
        }

        if (address.city.length <= 2) {
            newErrorFields.push('city')
            approved = false
        }

        if (address.state.length <= 2) {
            newErrorFields.push('state')
            approved = false
        }

        setErrorFields(newErrorFields)
        return approved
    }

    const handleSaveAddress = async () => {
        if (verifyAdress()) {
            await api.editUserAddress(address)

            router.push(`/${data.tenant.slug}/myaddresses`)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{`Editar endereço | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`${data.tenant.slug}/myaddresses`}
                color={data.tenant.primaryColor}
                title="Editar Endereço"
            />

            <div className={styles.inputs}>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={styles.label}>CEP</div>
                        <InputField
                            color={data.tenant.primaryColor}
                            placeholder="Digite um CEP"
                            value={address.cep}
                            onChange={value => changeAddressField('cep', value)}
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
                            value={address.street}
                            onChange={value => changeAddressField('street', value)}
                            warning={errorFields.includes('street')}
                        />
                    </div>
                    <div className={styles.column}>
                        <div className={styles.label}>Número</div>
                        <InputField
                            color={data.tenant.primaryColor}
                            placeholder="Digite um Número"
                            value={address.number}
                            onChange={value => changeAddressField('number', value)}
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
                            value={address.neighborhood}
                            onChange={value => changeAddressField('neighborhood', value)}
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
                            value={address.city}
                            onChange={value => changeAddressField('city', value)}
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
                            value={address.state}
                            onChange={value => changeAddressField('state', value)}
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
                            value={address.complement ?? ''}
                            onChange={value => changeAddressField('complement', value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.btnArea}>
                <Button
                    color={data.tenant.primaryColor}
                    label="Atualizar"
                    onClick={handleSaveAddress}
                    fill
                />
            </div>
        </div>
    )
}

export default EditAddress
type Props = {
    tenant: Tenant
    token: string
    user: User | null
    address: Adress
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug, addressid } = context.query
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
    if (!user) {
        return { redirect: { destination: '/login', permanent: false } }
    }

    //Get Address
    const address = await api.getUserAddress(parseInt(addressid as string))

    if (!address) return { redirect: { destination: '/myaddresses', permanent: false } }


    return {
        props: {
            tenant,
            user,
            token,
            address
        }
    }
}