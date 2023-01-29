/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react'
import { useAppContext } from '../../contexts/app'
import { useApi } from '../../libs/useApi'
import styles from '../../styles/Checkout.module.css'
import { Tenant } from '../../types/Tenant'
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import NoItems from '../../public/assets/noProductsIcon.svg'
import Head from 'next/head';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useFormatter } from '../../libs/useFormatter';
import { CartItem } from '../../types/CartItem';
import { useRouter } from 'next/router';
import CartProductItem from '../../components/CartProductItem';
import { CartCookie } from '../../types/CartCookie';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import { Adress } from '../../types/Adress';


const Checkout = (data: Props) => {
  const formater = useFormatter()
  const { setToken, setUser } = useAuthContext()
  const { tenant, setTenant } = useAppContext()
  const [shippingPrice, setShippingPrice] = useState(0)
  const [cupom, setCupom] = useState('')
  const [cupomDiscount, setCupomDiscount] = useState(0)
  const [cupomInput, setCupomInput] = useState('')
  const [paymentChange, setPaymentChange] = useState(0)
  const [paymentType, setPaymentType] = useState<'money' | 'card'>('money')
  const [shippingAdress, setshippingAdress] = useState<Adress>()
  const [subtotal, setSubtotal] = useState(0)
  const [cart, setCart] = useState<CartItem[]>(data.cart)
  const router = useRouter()

  useEffect(() => {
    setTenant(data.tenant)
    setToken(data.token)
    if (data.user) setUser(data.user)
  }, [])

  useEffect(() => {
    let sub = 0
    for (let i in cart) {
      sub += cart[i].product.price * cart[i].qt
    }
    setSubtotal(sub)
  }, [cart])

  const handleChangeAdress = () => {
    // router.push(`/${data.tenant.slug}/myaddresses`)
    setshippingAdress({
      id: 1,
      cep: '99999-99',
      street: "Rua da Macumba",
      number: '3232',
      city: "opora",
      neighborhood: "opora",
      state: "RJIO",
    })
    setShippingPrice(9.50)
  }

  const handleSetCupom = () => {
    if (cupomInput) {
      setCupom(cupomInput)
      setCupomDiscount(15.2)
    }
  }

  const handleFinish = () => {

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Checkout | ${data.tenant.name}`}</title>
      </Head>

      <Header
        backHref={`${data.tenant.slug}/cart`}
        color={data.tenant.primaryColor}
        title="Checkout"
      />
      <div className={styles.infoGroup}>
        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Endereço</div>
          <div className={styles.infoBody}>
            <ButtonWithIcon
              color={data.tenant.primaryColor}
              leftIcon={"location"}
              rightIcon={'rightArrow'}
              label={shippingAdress ?
                `${shippingAdress.street} ${shippingAdress.number} - ${shippingAdress.city}`
                :
                "Escolha um Endereço"
              }
              onClick={handleChangeAdress}
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
                  onClick={() => setPaymentType('money')}
                  fill={paymentType === 'money'}
                />
              </div>
              <div className={styles.paymentBtn}>
                <ButtonWithIcon
                  color={data.tenant.primaryColor}
                  leftIcon="card"
                  label="Cartão"
                  onClick={() => setPaymentType('card')}
                  fill={paymentType === "card"}
                />
              </div>
            </div>
          </div>
        </div>
        {paymentType === 'money' &&
          <div className={styles.infoArea}>
            <div className={styles.infoTitle}>Troco</div>
            <div className={styles.infoBody}>
              <InputField
                color={data.tenant.primaryColor}
                placeholder="Quanto você tem em dinheiro?"
                value={paymentChange ? paymentChange.toString() : ''}
                onChange={newValue => setPaymentChange(parseInt(newValue))}
              />
            </div>
          </div>
        }
        <div className={styles.infoArea}>
          <div className={styles.infoTitle}>Cupom de desconto</div>
          <div className={styles.infoBody}>
            {cupom &&
              <ButtonWithIcon
                color={data.tenant.primaryColor}
                leftIcon="coupon"
                rightIcon='checked'
                label={cupom.toLocaleUpperCase()}
              />
            }
            {!cupom &&
              <div className={styles.cupomInput}>
                <InputField
                  color={data.tenant.primaryColor}
                  placeholder="Tem um cupom?"
                  value={cupomInput}
                  onChange={newValue => setCupomInput(newValue)}
                />
                <Button
                  color={data.tenant.primaryColor}
                  label="OK"
                  onClick={handleSetCupom}
                />
              </div>

            }
          </div>
        </div>
      </div>




      <div className={styles.productsQuantity}>
        {cart.length} {cart.length === 1 ? 'item' : 'itens'}
      </div>

      <div className={styles.productList}>
        {cart.map((cartItem, index) => (
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

      <div className={styles.resumeArea}>

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Subtotal</div>
          <div className={styles.resumeRight}>{formater.formatPrice(subtotal)}</div>
        </div>
        {cupomDiscount > 0 &&
          <div className={styles.resumeItem}>
            <div className={styles.resumeLeft}>Desconto</div>
            <div className={styles.resumeRight}>-{formater.formatPrice(cupomDiscount)}</div>
          </div>
        }

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Frete</div>
          <div className={styles.resumeRight}>{shippingPrice > 0 ? formater.formatPrice(shippingPrice) : '--'}</div>
        </div>

        <div className={styles.resumeLine} />

        <div className={styles.resumeItem}>
          <div className={styles.resumeLeft}>Total</div>
          <div
            className={styles.resumeRightBig}
            style={{ color: data.tenant.primaryColor }}
          >{formater.formatPrice(shippingPrice + subtotal - cupomDiscount)}</div>
        </div>
        <div className={styles.resumeButton}>
          <Button
            color={data.tenant.primaryColor}
            label='Finalizar Pedido'
            onClick={handleFinish}
            fill
            disabled={!shippingAdress}
          />
        </div>
      </div>
    </div>
  )
}

export default Checkout
type Props = {
  tenant: Tenant
  token: string
  user: User | null
  cart: CartItem[]
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

  //Get Cart Products
  const cartCookie = getCookie('cart', context)
  const cart = await api.getCartProducts(cartCookie as string)

  return {
    props: {
      tenant,
      user,
      token,
      cart
    }
  }
}