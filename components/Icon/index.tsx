import MailSent from './MailSent.svg'
import Card from './card.svg'
import Checked from './checked.svg'
import Location from './location.svg'
import Money from './money.svg'
import RightArrow from './rightArrow.svg'
import Coupon from './coupon.svg'
import Dots from './dots.svg'
import Edit from './edit.svg'
import Delete from './delete.svg'

type Props ={
    icon: string
    color: string
    width: number
    height: number
}

export const Icon = ({icon, color, width, height}:Props) =>{

    return(
        <div style={{width, height}}>
            {icon === 'mainSent' && <MailSent color={color}/>}
            {icon === 'card' && <Card color={color}/>}
            {icon === 'checked' && <Checked color={color}/>}
            {icon === 'coupon' && <Coupon color={color}/>}
            {icon === 'location' && <Location color={color}/>}
            {icon === 'rightArrow' && <RightArrow color={color}/>}
            {icon === 'money' && <Money color={color}/>}
            {icon === 'dots' && <Dots color={color}/>}
            {icon === 'edit' && <Edit color={color}/>}
            {icon === 'delete' && <Delete color={color}/>}
        </div>
    )
}