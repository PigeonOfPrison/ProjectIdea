import clsx from 'clsx'

export default function Card({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <div className={clsx('manifest-card', padded && 'pl-6 pr-5 py-5', className)}>{children}</div>
  )
}
