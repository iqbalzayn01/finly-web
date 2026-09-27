import { useSidebar } from '../ui'
import { cn } from '../../lib/utils'

export function Logo() {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === 'collapsed' && !isMobile

  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary aspect-square flex items-center justify-center rounded-md h-9 sm:h-10 w-9 sm:w-10 shrink-0">
        <span className="font-black text-black text-xl">F</span>
      </div>

      <span
        className={cn(
          'truncate text-xl md:text-2xl font-semibold tracking-tight',
          isCollapsed && 'hidden',
        )}
      >
        Finly
      </span>
    </div>
  )
}
