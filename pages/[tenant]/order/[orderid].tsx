/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../contexts/app'
import { useApi } from '../../../libs/useApi'
import styles from '../../../styles/Order-id.module.css'
import { Tenant } from '../../../types/Tenant'
import { User } from '../../../types/User';
import { useAuthContext } from '../../../contexts/auth';
// import NoItems from '../../public/assets/noProductsIcon.svg'
import Head from 'next/head';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { useFormatter } from '../../../libs/useFormatter';
import { CartItem } from '../../../types/CartItem';
import { useRouter } from 'next/router';
import CartProductItem from '../../../components/CartProductItem';
// import { CartCookie } from '../../types/CartCookie';
import ButtonWithIcon from '../../../components/ButtonWithIcon';
import { Order } from '../../../types/Order';
// import { Adress } from '../../types/Adress';


const OrderId = (data: Props) => {
    const formater = useFormatter()
    const { setToken, setUser } = useAuthContext()
    const { tenant, setTenant } = useAppContext()
    const router = useRouter()

    useEffect(() => {
        setTenant(data.tenant)
        setToken(data.token)
        if (data.user) setUser(data.user)
    }, [])

    useEffect(()=>{
        if(data.order.status !== 'delivered'){
            setTimeout(()=>{
                router.reload()
            }, 60000)
        }
    }, [])

    const orderStatusList = {
        preparing: {
            label: 'Preparando',
            longLabel: 'Preparando o seu pedido...',
            bgColor: '#FEFAE6',
            color: '#D4BC34',
            pct: 25
        },
        sent: {
            label: 'Enviado',
            longLabel: 'Enviamos o seu pedido...',
            bgColor: '#F1F3F8',
            color: '#758CBD',
            pct: 75
        },
        delivered: {
            label: 'Entregue',
            longLabel: 'Seu pedido foi entregue',
            bgColor: '#F1F8F6',
            color: '#6AB70A',
            pct: 100
        }
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>{`Pedido #${data.order.id} | ${data.tenant.name}`}</title>
            </Head>

            <Header
                backHref={`${data.tenant.slug}/cart`}
                color={data.tenant.primaryColor}
                title={`Pedido #${data.order.id}`}
            />

            {data.order.status !== 'delivered' &&
                <div
                    className={styles.statusArea}
                    style={{backgroundColor: orderStatusList[data.order.status].bgColor, color: orderStatusList[data.order.status].color}}
                >
                    <div className={styles.statusLongLabel}>
                        {orderStatusList[data.order.status].longLabel}
                    </div>
                    <div className={styles.statusPct}>
                        <div
                            className={styles.statusPctBar}
                            style={{backgroundColor: orderStatusList[data.order.status].color, width: `${orderStatusList[data.order.status].pct}%`}}
                        />
                    </div>
                    <div className={styles.statusMsg}>
                        Aguardando mudança de status...
                    </div>
                </div>
            }

            <div className={styles.orderInfoArea}>
                <div className={styles.orderInfoStatus} style={{backgroundColor: orderStatusList[data.order.status].bgColor, color: orderStatusList[data.order.status].color}}>
                    {orderStatusList[data.order.status].label}
                </div>
                <div className={styles.orderInfoQt}>
                    {data.order.products.length} {data.order.products.length === 1 ? 'item' : 'itens'}
                </div>
                <div className={styles.orderInfoDate}>
                    {formater.formatDate(data.order.orderDate)}
                </div>
            </div>

            <div className={styles.productList}>
                {data.order.products.map((cartItem, index) => (
                    <CartProductItem
                        key={index}
                        color={data.tenant.primaryColor}
                        quantity={cartItem.qt}
                        product={cartItem.product}
                        onChange={() => { }}
                        noEdit
                    />
                ))}
            </div>

            <div className={styles.infoGroup}>
                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>Endereço</div>
                    <div className={styles.infoBody}>
                        <ButtonWithIcon
                            color={data.tenant.primaryColor}
                            leftIcon={"location"}
                            rightIcon={'rightArrow'}
                            label={`${data.order.shippingAddress.street} ${data.order.shippingAddress.number} - ${data.order.shippingAddress.city}`}
                            onClick={() => { }}
                        />
                    </div>
                </div>
                <div className={styles.infoArea}>
                    <div className={styles.infoTitle}>Tipo de pagamento</div>
                    <div className={styles.infoBody}>
                        <div className={styles.paymentsType}>
                            <div className={styles.paymentBtn}>
                                <ButtonWithIcon
                                    color={data.tenant.primaryColor}
                                    leftIcon="money"
                                    label="Dinheiro"
                                    onClick={() => { }}
                                    fill={data.order.paymentType === 'money'}
                                />
                            </div>
                            <div className={styles.paymentBtn}>
                                <ButtonWithIcon
                                    color={data.tenant.primaryColor}
                                    leftIcon="card"
                                    label="Cartão"
                                    onClick={() => { }}
                                    fill={data.order.paymentType === "card"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {data.order.paymentType === 'money' &&
                    <div className={styles.infoArea}>
                        <div className={styles.infoTitle}>Troco</div>
                        <div className={styles.infoBody}>
                            <InputField
                                color={data.tenant.primaryColor}
                                placeholder="Quanto você tem em dinheiro?"
                                value={data.order.paymentChange?.toString() ?? ''}
                                onChange={() => { }}
                            />
                        </div>
                    </div>
                }
                {data.order.cupom &&
                    <div className={styles.infoArea}>
                        <div className={styles.infoTitle}>Cupom de desconto</div>
                        <div className={styles.infoBody}>
                            <ButtonWithIcon
                                color={data.tenant.primaryColor}
                                leftIcon="coupon"
                                rightIcon='checked'
                                label={data.order.cupom.toLocaleUpperCase()}
                            />
                        </div>
                    </div>
                }
            </div>

            <div className={styles.resumeArea}>

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Subtotal</div>
                    <div className={styles.resumeRight}>{formater.formatPrice(data.order.subtotal)}</div>
                </div>
                {data.order.cupomDiscount &&
                    <div className={styles.resumeItem}>
                        <div className={styles.resumeLeft}>Desconto</div>
                        <div className={styles.resumeRight}>-{formater.formatPrice(data.order.cupomDiscount)}</div>
                    </div>
                }

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Frete</div>
                    <div className={styles.resumeRight}>{data.order.shippingPrice > 0 ? formater.formatPrice(data.order.shippingPrice) : '--'}</div>
                </div>

                <div className={styles.resumeLine} />

                <div className={styles.resumeItem}>
                    <div className={styles.resumeLeft}>Total</div>
                    <div
                        className={styles.resumeRightBig}
                        style={{ color: data.tenant.primaryColor }}
                    >{formater.formatPrice(data.order.total)}</div>
                </div>
            </div>
        </div>
    )
}

export default OrderId
type Props = {
    tenant: Tenant
    token: string
    user: User | null
    order: Order
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { tenant: tenantSlug, orderid } = context.query
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

    //Get Order
    const order = await api.getOrder(parseInt(orderid as string))


    return {
        props: {
            tenant,
            user,
            token,
            order
        }
    }
}