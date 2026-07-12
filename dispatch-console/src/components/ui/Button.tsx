import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-ink-900 text-parchment-100 hover:bg-ink-800',
        variant === 'secondary' &&
          'bg-transparent border border-ink-900/20 text-ink-900 hover:bg-ink-900/5',
        variant === 'danger' && 'bg-stamp text-parchment-100 hover:bg-stamp-dark',
        className,
      )}
      {...props}
    />
  )
}
