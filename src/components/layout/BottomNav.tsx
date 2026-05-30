import { Link, useLocation } from 'react-router-dom'

import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Today', match: (pathname: string) => pathname === '/' || pathname.startsWith('/entry/') },
  { href: '/timeline', label: 'Timeline', match: (pathname: string) => pathname === '/timeline' },
  { href: '/analytics', label: 'Analytics', match: (pathname: string) => pathname === '/analytics' },
] as const

export function BottomNav() {
  const location = useLocation()

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 border-t bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/90"
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-3 gap-2 px-4 py-3">
        {navItems.map((item) => {
          const isActive = item.match(location.pathname)

          return (
            <li key={item.href}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-12 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-muted text-text-secondary hover:bg-accent hover:text-accent-foreground',
                )}
                to={item.href}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
