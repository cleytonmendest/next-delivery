import { useState } from 'react'
import styles from './SearchInput.module.css'
import SearchIcon from './searchIcon.svg'
import { useAppContext } from '../../contexts/app'

type Props = {
    onSearch: (searchValue: string) => void
}

const SearchInput = ({ onSearch }: Props) => {
    const {tenant} = useAppContext()
    const [focused, setFocused] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // if (e.code === 'Enter') {
            onSearch(searchValue) 
        // }
    }

    return (
        <div
            className={styles.container}
            style={{ borderColor: focused ? tenant?.primaryColor : '#FFF' }}
        >
            <div
                className={styles.button}
                onClick={() => onSearch(searchValue)}
            >
                <SearchIcon color={tenant?.primaryColor}/>
            </div>
            <input
                placeholder='Digite o nome do produto' type="text" className={styles.input}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyUp={handleKeyUp}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    )
}

export default SearchInput