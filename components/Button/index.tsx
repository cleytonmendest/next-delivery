import styles from './style.module.css'

type Props = {
    color: string
    label: string
    onClick : ()=>void
    fill?: boolean
}

const Button = ({color, label, fill, onClick}:Props) => {

  return (
    <div
        className={styles.container}
        onClick={onClick}
        style={{
            color: fill ? '#FFF' : color,
            borderColor: color,
            backgroundColor: fill ? color : 'transparent'
        }}
    >
        {label}
    </div>
  )
}

export default Button