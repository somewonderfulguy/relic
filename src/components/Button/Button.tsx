import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/utils'

import styles from './Button.module.css'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  asChild?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  className,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(styles.button, styles[variant], styles[size], className)}
      {...props}
    />
  )
}
