import type { ButtonHTMLAttributes, ReactNode } from 'react'
import {
  buttonVisualClass,
  type ButtonSize,
  type ButtonVariant,
} from '@/shared/ui/buttonStyles'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVisualClass(variant, size, className)}
      {...rest}
    >
      {children}
    </button>
  )
}
