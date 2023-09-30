/* eslint-disable react-hooks/rules-of-hooks */

import { GetServerSideProps } from 'next'
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react'
import { useAppContext } from '../../contexts/app'
import { useApi } from '../../libs/useApi'
import styles from '../../styles/Cart.module.scss'
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


const Cart = (data: Props) => {
  const formater = useFormatter()
  const { setToken, setUser } = useAuthContext()
  const { tenant, setTenant } = useAppContext()
  const [shippingInput, setShippingInput] = useState('')
  const [shippingPrice, setShippingPrice] = useState(0)
  const [shippingTime, setShippingTime] = useState(0)
  const [shippingAdress, setshippingAdress] = useState('')
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

  const handleShippingCalc = () => {
    setshippingAdress('Rua da Macumba')
    setShippingPrice(9.50)
    setShippingTime(20)
  }

  const handleFinish = () => {
    router.push(`/${data.tenant.slug}/checkout`)
  }

  const handleCartChange = (newCount: number, id:number) =>{
    const tmpCart: CartItem[] = [...cart]
    const cartIndex = tmpCart.findIndex(item => item.product.id === id)
    if(newCount > 0){
      tmpCart[cartIndex].qt = newCount;
    }else{
      delete tmpCart[cartIndex]
    }

    let newCart: CartItem[] = tmpCart.filter(item => item)

    setCart(newCart)

    //update Cookie
    let cartCookie: CartCookie[] = []
    for(let i in newCart){
      cartCookie.push({
        id: newCart[i].product.id,
        qt: newCart[i].qt
      })
    }

    setCookie('cart', JSON.stringify(cartCookie))
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Sacola | ${data.tenant.name}`}</title>
      </Head>

      <Header
        backHref={`${data.tenant.slug}/`}
        color={data.tenant.primaryColor}
        title="Sacola"
      />

      <div className={styles.productsQuantity}>
        {cart.length} {cart.length === 1 ? 'item' : 'itens'}
      </div>

      <div className={styles.productList}>
        {cart.map((cartItem, index)=>(
          <CartProductItem
            key={index}
            color={data.tenant.primaryColor}
            quantity={cartItem.qt}
            product={cartItem.product}
            onChange={handleCartChange}
          />
        ))}
      </div>
      <div className={styles.shippingArea}>
          <div className={styles.shippingTitle}>Calcular frete e prazo</div>
          <div className={styles.shippingForm}>
            <InputField
              color={data.tenant.primaryColor}
              placeholder="Digite seu CEP"
              value={shippingInput}
              onChange={newValue => setShippingInput(newValue)}
            />
            <Button
              color={data.tenant.primaryColor}
              label="OK"
              onClick={handleShippingCalc}
            />

          </div>
          {shippingTime > 0 &&
            <div className={styles.shippingInfo}>
              <div className={styles.shippingAdress}>
                {shippingAdress}
              </div>
              <div className={styles.shippingTime}>
                <div className={styles.shippingTimeText}>
                  Receba em até {shippingTime} minutos
                </div>
                <div
                  className={styles.shippingPrice}
                  style={{ color: data.tenant.primaryColor }}
                >
                  {formater.formatPrice(shippingPrice)}
                </div>
              </div>
            </div>
          }

        </div>

        <div className={styles.resumeArea}>

          <div className={styles.resumeItem}>
            <div className={styles.resumeLeft}>Subtotal</div>
            <div className={styles.resumeRight}>{formater.formatPrice(subtotal)}</div>
          </div>

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
            >{formater.formatPrice(shippingPrice + subtotal)}</div>
          </div>
          <div className={styles.resumeButton}>
            <Button
              color={data.tenant.primaryColor}
              label='Continuar'
              onClick={handleFinish}
              fill
            />
          </div>
        </div>
    </div>
  )
}

export default Cart
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