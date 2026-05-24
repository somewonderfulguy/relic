import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/utils'

import { buttonVariants, type ButtonVariants } from './Button.variants'

export type ButtonProps = ComponentProps<'button'> &
  ButtonVariants & {
    asChild?: boolean
  }

export const Button = ({
  variant = 'primary',
  size = 'medium',
  className,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  )
}
