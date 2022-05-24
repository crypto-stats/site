import { Icon, LucideProps } from 'lucide-react'

type LucideIconProps = {
  Icon: Icon
} & LucideProps

export const LucideIcon = ({ Icon, ...props }: LucideIconProps) => {
  return <Icon {...props} />
}
