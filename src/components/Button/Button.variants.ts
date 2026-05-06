import { cva, type VariantProps } from 'class-variance-authority'

import styles from './Button.module.css'

export type ButtonVariants = VariantProps<typeof buttonVariants>

export const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      destructive: styles.destructive,
    },
    size: {
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
})
