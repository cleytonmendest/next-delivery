import styles from './style.module.css'
import BackIcon from './backIcon.svg'
import Link from 'next/link'

type Props = {
  backHref: string
  color: string
  title?: string
  subtitle?: string
  invert?:boolean
}

const Header = ({ backHref, color, title, subtitle, invert }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <Link legacyBehavior href={`/${backHref}`}>
          <a className={invert ? styles.buttonTransparent : ''}>
            <BackIcon color={invert ? '#fff' : color} />
          </a>
        </Link>
      </div>
      <div className={styles.centerSide}>
        {title && 
          <div
            className={styles.title}
            style={{color: invert ? '#fff' : '#1b1b1b'}}
          >
            {title}
          </div>}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.rightSide}></div>
    </div>
  )
}

export default Header