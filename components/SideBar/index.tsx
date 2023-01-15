import React from 'react'
import { useAuthContext } from '../../contexts/auth'
import { Tenant } from '../../types/Tenant'
import Button from '../Button'
import styles from './styles.module.css'


type Props = {
    tenant: Tenant
    open: boolean
    onClose: () => void
}

const SideBar = ({tenant, open, onClose}:Props) => {
    const {user} = useAuthContext()

  return (
    <div
        className={styles.container}
        style={{width: open ? '100vw' : '0'}}
    >
        <div className={styles.area}>
            <div className={styles.header}>
                <div 
                    className={styles.loginArea}
                    style={{borderBottomColor: tenant.primaryColor}}
                
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
                            onClick={()=>{}}
                            fill
                        />
                    }
                </div>
                <div
                    className={styles.closeBtn}
                    style={{color: tenant.primaryColor}}
                    onClick={onClose}
                >X</div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.menu}>
                menu
            </div>
        </div>
    </div>
  )
}

export default SideBar