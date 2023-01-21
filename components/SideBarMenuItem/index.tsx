import React from 'react'
import styles from './styles.module.css'
import MenuIcon from './cardapio.svg'
import ConfigIcon from './config.svg'
import FavIcon from './favoritos.svg'
import LogoutIcon from './logout.svg'
import OrderIcon from './pedidos.svg'
import CartIcon from './sacola.svg'

type Props ={
    color: string
    label: string
    icon: 'cart' | 'config' | 'fav' | 'logout' | 'menu' | 'order'
    onClick: () =>void
    disabled? :boolean
}

const SideBarMenuItem = ({color, label, icon, disabled, onClick}:Props) => {
  return (
    <div className={styles.container} onClick={onClick}>
        {icon === 'cart' && <CartIcon color={color}/>}
        {icon === 'menu' && <MenuIcon color={color}/>}
        {icon === 'fav' && <FavIcon color={color}/>}
        {icon === 'config' && <ConfigIcon color={color}/>}
        {icon === 'logout' && <LogoutIcon color={color}/>}
        {icon === 'order' && <OrderIcon color={color}/>}
        <span className={disabled ? styles.disabled : ''}>{label}</span>
    </div>
  )
}

export default SideBarMenuItem