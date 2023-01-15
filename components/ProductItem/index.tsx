import Link from 'next/link';
import { useAppContext } from '../../contexts/app'
import { useFormatter } from '../../libs/useFormatter';
import { Product } from '../../types/Product'
import styles from './style.module.css'

type Props = {
    data: Product;
}

const ProductItem = ({ data }: Props) => {
    const {tenant} = useAppContext()

    const formatter = useFormatter()
    return (
        <Link href={`/${tenant?.slug}/product/${data.id}`}>
            <div className={styles.container}>
                <div className={styles.head} style={{ backgroundColor: tenant?.secondaryColor }}></div>
                <div className={styles.info}>
                    <div className={styles.img}>
                        <img src={data.image} alt="burguer" />
                    </div>
                    <div className={styles.catName}>{data.categoryName}</div>
                    <div className={styles.name}>{data.name}</div>
                    <div className={styles.price} style={{ color: tenant?.primaryColor }}>{formatter.formatPrice(data.price)}</div>
                </div>
            </div>
        </Link>

    )
}

export default ProductItem