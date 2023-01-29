import styles from './style.module.css'

type Props = {
    color: string
    label: string
    onClick : ()=>void
    fill?: boolean
    disabled?: boolean
}

const Button = ({color, label, fill, onClick, disabled}:Props) => {

  return (
    <div
        className={styles.container}
        onClick={!disabled ? onClick : ()=>{}}
        style={{
            color: fill ? '#FFF' : color,
            borderColor: color,
            backgroundColor: fill ? color : 'transparent',
            opacity: disabled ? '.4' : 1
        }}
    >
        {label}
    </div>
  )
}

export default Button