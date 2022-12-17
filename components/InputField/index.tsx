import { useState } from 'react'
import styles from './style.module.css'
import EyeOn from './eyeOn.svg'
import EyeOff from './eyeOff.svg'
type Props = {
    color: string
    placeholder: string
    value: string
    onChange: (newValue: string) => void
    password?: boolean
}

const InputField = ({ color, placeholder, value, onChange, password }: Props) => {
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setfocused] = useState(false)

    return (
        <div
            className={styles.container}
            style={{
                borderColor: focused ? color : '#f9f9fb',
                backgroundColor : focused ? '#fff' : '#f9f9fb'
            }}
        >
            <input
                type={password ? (showPassword ? 'text' : 'password') : 'text'}
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={()=> setfocused(true)}
                onBlur={()=> setfocused(false)}
            />
            {password &&
                <div
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.showPassword}
                >
                    {showPassword && <EyeOn color='#BBB' />}
                    {!showPassword && <EyeOff color='#BBB' />}
                </div>
            }

        </div>
    )
}

export default InputField