import React from 'react'
import { Adress } from '../../types/Adress'
import { Icon } from '../Icon'
import styles from './styles.module.css'

type Props = {
    color: string
    adresses: Adress
    onSelect: (address: Adress) => void
    onEdit: (id: number) => void
    onDelete: (id: number) => void
    menuOpened: number
    setMenuOpened: (id: number) => void
}

const AddressItem = ({ color, adresses, menuOpened, setMenuOpened, onDelete, onEdit, onSelect }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.addressArea} onClick={() => onSelect(adresses)}>
                <div className={styles.adressIcon}>
                    <Icon
                        color={color}
                        icon="location"
                        height={24}
                        width={24}
                    />
                </div>
                <div className={styles.addressText}>{`${adresses.street} ${adresses.number}, ${adresses.city}${adresses.street} ${adresses.number}, ${adresses.city}${adresses.street} ${adresses.number}, ${adresses.city}${adresses.street} ${adresses.number}, ${adresses.city}`}</div>
            </div>
            <div className={styles.btnArea}>
                <div className={styles.menuIcon} onClick={()=> setMenuOpened(adresses.id)}>
                    <Icon
                        color='#6A7D8B'
                        icon='dots'
                        height={24}
                        width={24}
                    />
                </div>
                {menuOpened === adresses.id &&
                    <div className={styles.popup}>
                        <div className={styles.popupItem} onClick={()=> onEdit(adresses.id)}>
                            <div className={styles.popupIcon}>
                                <Icon icon='edit' color='#96A3AB' height={24} width={24} />
                            </div>
                            <div className={styles.popupText}>Editar</div>
                        </div>
                        <div className={styles.popupItem} onClick={()=> onDelete(adresses.id)}>
                            <div className={styles.popupIcon}>
                                <Icon icon='delete' color='#96A3AB' height={24} width={24} />
                            </div>
                            <div className={styles.popupText}>Deletar</div>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default AddressItem