import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useAuthContext } from '../../contexts/auth'
import { Tenant } from '../../types/Tenant'
import Button from '../Button'
import SideBarMenuItem from '../SideBarMenuItem'
import styles from './styles.module.css'


type Props = {
    tenant: Tenant
    open: boolean
    onClose: () => void
}

const SideBar = ({ tenant, open, onClose }: Props) => {
    const { user, setToken } = useAuthContext()

    const router = useRouter()

    return (
        <div
            className={styles.container}
            style={{ width: open ? '100vw' : '0' }}
        >
            <div className={styles.area}>
                <div className={styles.header}>
                    <div
                        className={styles.loginArea}
                        style={{ borderBottomColor: tenant.primaryColor }}

                    >
                        {user &&
                            <div className={styles.userInfo}>
                                <strong>{user.name}</strong>
                                Último pedido há X semanas
                            </div>
                        }
                        {!user &&
                            <Button
                                color={tenant.primaryColor}
                                label='Fazer Login'
                                onClick={() => router.push(`/${tenant.slug}/login`)}
                                fill
                            />
                        }
                    </div>
                    <div
                        className={styles.closeBtn}
                        style={{ color: tenant.primaryColor }}
                        onClick={onClose}
                    >X</div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.menu}>
                    <SideBarMenuItem
                        color='#6a7D88'
                        icon="menu"
                        label='Cardápio'
                        onClick={onClose}
                    />
                    <SideBarMenuItem
                        color='#6a7D88'
                        icon="cart"
                        label='Sacola'
                        onClick={() => router.push(`/${tenant.slug}/cart`)}
                    />
                    <SideBarMenuItem
                        color='#6a7D88'
                        icon="fav"
                        label='Favoritos'
                        onClick={() => { }}
                        disabled
                    />
                    <SideBarMenuItem
                        color='#6a7D88'
                        icon="order"
                        label='Meus Pedidos'
                        onClick={() => router.push(`/${tenant.slug}/orders`)}
                    />
                    <SideBarMenuItem
                        color='#6a7D88'
                        icon="config"
                        label='Configurações'
                        onClick={() => { }}
                        disabled
                    />
                </div>
                <div className={styles.menuBottom}>
                    {user &&
                        <SideBarMenuItem
                            color='#6a7D88'
                            icon="logout"
                            label='Sair'
                            onClick={() => {
                                setToken('')
                                onClose()
                            }}
                        />
                    }

                </div>
            </div>
        </div>
    )
}

export default SideBar