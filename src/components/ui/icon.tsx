import * as React from 'react'
import { cn } from '../../lib/utils'

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  filled?: boolean
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  grade?: -25 | 0 | 200
  opticalSize?: 20 | 24 | 40 | 48
  size?: number | string
}

/**
 * Parses Tailwind size classes (e.g. `size-4`, `h-4 w-4`, `size-3.5`, `h-5`, `size-[18px]`)
 * to compute the exact pixel dimensions, 1:1 aspect ratio, optimal optical size, and font weight.
 */
function parseIconDimensions(
  className?: string,
  explicitSize?: number | string,
) {
  if (typeof explicitSize === 'number') {
    const px = explicitSize
    return {
      fontSize: `${px}px`,
      width: `${px}px`,
      height: `${px}px`,
      opsz: px <= 20 ? 20 : px <= 28 ? 24 : px <= 44 ? 40 : 48,
      weight: px <= 16 ? 500 : 400,
    }
  }

  if (typeof explicitSize === 'string') {
    return {
      fontSize: explicitSize,
      width: explicitSize,
      height: explicitSize,
      opsz: 24 as const,
      weight: 400 as const,
    }
  }

  if (className) {
    // Check for size-X, h-X, w-X anywhere in the className string
    const match = className.match(
      /(?:(?:^|\s)(?:size|h|w)-)(\[?[0-9.]+(?:px|rem)?\]?)/,
    )
    if (match) {
      const val = match[1]
      let px: number | undefined

      if (val.startsWith('[') && val.endsWith(']')) {
        const raw = val.slice(1, -1)
        if (raw.endsWith('px')) px = parseFloat(raw)
        else if (raw.endsWith('rem')) px = parseFloat(raw) * 16
        else px = parseFloat(raw)
      } else {
        const num = parseFloat(val)
        if (!isNaN(num)) {
          // Tailwind numeric scale: 1 = 4px, 2.5 = 10px, 3 = 12px, 3.5 = 14px, 4 = 16px, 5 = 20px, 6 = 24px, 8 = 32px, etc.
          px = num * 4
        }
      }

      if (px && !isNaN(px)) {
        return {
          fontSize: `${px}px`,
          width: `${px}px`,
          height: `${px}px`,
          opsz: px <= 20 ? 20 : px <= 28 ? 24 : px <= 44 ? 40 : 48,
          weight: px <= 16 ? 500 : 400,
        }
      }
    }
  }

  return {
    fontSize: 'inherit',
    width: '1em',
    height: '1em',
    opsz: 24 as const,
    weight: 400 as const,
  }
}

/**
 * Universal Google Material Symbols (Rounded) Icon Component
 * https://fonts.google.com/icons?icon.style=Rounded
 *
 * Guarantees strict 1:1 aspect ratio, centered font bounding box, and automatic optical sizing.
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      className,
      filled = false,
      weight,
      grade = 0,
      opticalSize,
      size,
      style,
      ...props
    },
    ref,
  ) => {
    const computed = parseIconDimensions(className, size)
    const effectiveWeight = weight ?? computed.weight
    const effectiveOpsz = opticalSize ?? computed.opsz

    const fontVariationSettings = `'FILL' ${filled ? 1 : 0}, 'wght' ${effectiveWeight}, 'GRAD' ${grade}, 'opsz' ${effectiveOpsz}`

    return (
      <span
        ref={ref}
        aria-hidden="true"
        translate="no"
        data-slot="icon"
        className={cn(
          'material-symbols-rounded inline-flex items-center justify-center shrink-0 select-none align-middle leading-none',
          className,
        )}
        style={{
          fontVariationSettings,
          fontSize: computed.fontSize,
          width: computed.width,
          height: computed.height,
          minWidth: computed.width,
          minHeight: computed.height,
          aspectRatio: '1 / 1',
          boxSizing: 'content-box',
          ...style,
        }}
        {...props}
      >
        {name}
      </span>
    )
  },
)

Icon.displayName = 'Icon'

export type IconComponent = React.ForwardRefExoticComponent<
  Omit<IconProps, 'name'> & React.RefAttributes<HTMLSpanElement>
>

export function createGoogleIcon(
  symbolName: string,
  defaultFilled = false,
): IconComponent {
  const Component = React.forwardRef<HTMLSpanElement, Omit<IconProps, 'name'>>(
    ({ filled = defaultFilled, ...props }, ref) => (
      <Icon ref={ref} name={symbolName} filled={filled} {...props} />
    ),
  )
  Component.displayName = `GoogleIcon(${symbolName})`
  return Component
}

// ==========================================
// Google Material Symbols (Rounded) Mappings
// ==========================================

// Core Navigation & Layout
export const LayoutDashboard = createGoogleIcon('dashboard')
export const Dashboard = createGoogleIcon('dashboard')
export const Wallet = createGoogleIcon('account_balance_wallet')
export const FileText = createGoogleIcon('description')
export const Users = createGoogleIcon('group')
export const Package = createGoogleIcon('inventory_2')
export const Settings = createGoogleIcon('settings')
export const SettingsIcon = createGoogleIcon('settings')
export const Bell = createGoogleIcon('notifications')
export const User = createGoogleIcon('person')
export const LogOut = createGoogleIcon('logout')
export const Menu = createGoogleIcon('menu')
export const X = createGoogleIcon('close')
export const Close = createGoogleIcon('close')
export const Search = createGoogleIcon('search')
export const PanelLeft = createGoogleIcon('dock_to_left')
export const PanelLeftClose = createGoogleIcon('left_panel_close')

// Finance & Analytics
export const TrendingUp = createGoogleIcon('trending_up')
export const ArrowUpRight = createGoogleIcon('north_east')
export const ArrowDownRight = createGoogleIcon('south_east')
export const ArrowLeft = createGoogleIcon('arrow_back')
export const ArrowRight = createGoogleIcon('arrow_forward')
export const DollarSign = createGoogleIcon('attach_money')
export const Receipt = createGoogleIcon('receipt_long')
export const Activity = createGoogleIcon('query_stats')
export const Globe = createGoogleIcon('language')
export const RefreshCw = createGoogleIcon('sync')
export const Building2 = createGoogleIcon('domain')

// Keypad & Hardware Controls
export const Keyboard = createGoogleIcon('keyboard')
export const Delete = createGoogleIcon('backspace')
export const BackspaceIcon = createGoogleIcon('backspace')

// Actions & CRUD
export const Plus = createGoogleIcon('add')
export const Save = createGoogleIcon('save')
export const Send = createGoogleIcon('send')
export const Edit2 = createGoogleIcon('edit')
export const Edit = createGoogleIcon('edit')
export const Trash2 = createGoogleIcon('delete')
export const Trash = createGoogleIcon('delete')
export const MoreVertical = createGoogleIcon('more_vert')
export const Printer = createGoogleIcon('print')
export const Download = createGoogleIcon('download')
export const Share2 = createGoogleIcon('share')
export const Camera = createGoogleIcon('photo_camera')
export const Image = createGoogleIcon('image')
export const ImageIcon = createGoogleIcon('image')
export const Box = createGoogleIcon('inventory_2')
export const Phone = createGoogleIcon('call')
export const Mail = createGoogleIcon('mail')
export const MapPin = createGoogleIcon('location_on')
export const Eye = createGoogleIcon('visibility')
export const EyeOff = createGoogleIcon('visibility_off')

// Status & Feedback
export const Check = createGoogleIcon('check')
export const CheckIcon = createGoogleIcon('check')
export const CheckCircle2 = createGoogleIcon('check_circle')
export const CheckCircle = createGoogleIcon('check_circle')
export const ChevronDown = createGoogleIcon('expand_more')
export const ChevronDownIcon = createGoogleIcon('expand_more')
export const ChevronUp = createGoogleIcon('expand_less')
export const ChevronUpIcon = createGoogleIcon('expand_less')
export const ChevronRight = createGoogleIcon('chevron_right')
export const ChevronLeft = createGoogleIcon('chevron_left')
export const ChevronsUpDown = createGoogleIcon('unfold_more')
export const MoreHorizontal = createGoogleIcon('more_horiz')
export const Clock = createGoogleIcon('schedule')
export const XCircle = createGoogleIcon('cancel')
export const AlertCircle = createGoogleIcon('error')
export const AlertTriangle = createGoogleIcon('warning')
export const Info = createGoogleIcon('info')
export const HelpCircle = createGoogleIcon('help')
export const FileQuestion = createGoogleIcon('help_outline')
export const Home = createGoogleIcon('home')

// Security, Pro & Business
export const Shield = createGoogleIcon('shield')
export const ShieldCheck = createGoogleIcon('verified_user')
export const ShieldAlert = createGoogleIcon('gpp_maybe')
export const Key = createGoogleIcon('key')
export const ExternalLink = createGoogleIcon('open_in_new')
export const Sparkles = createGoogleIcon('auto_awesome')
export const Zap = createGoogleIcon('bolt')
export const BadgeCheck = createGoogleIcon('verified')
export const CreditCard = createGoogleIcon('credit_card')
export const Briefcase = createGoogleIcon('business_center')
export const Folder = createGoogleIcon('folder')
export const Forward = createGoogleIcon('forward')
export const Settings2 = createGoogleIcon('settings')
export const PieChart = createGoogleIcon('pie_chart')
export const BookOpen = createGoogleIcon('menu_book')
export const Frame = createGoogleIcon('crop_free')
export const SquareTerminal = createGoogleIcon('terminal')
export const AudioWaveform = createGoogleIcon('graphic_eq')
export const GalleryVerticalEnd = createGoogleIcon('collections_bookmark')
export const Command = createGoogleIcon('keyboard_command_key')
export const Map = createGoogleIcon('map')

// AI & System
export const Bot = createGoogleIcon('smart_toy')
export const Server = createGoogleIcon('dns')
export const Sliders = createGoogleIcon('tune')
export const SlidersHorizontal = createGoogleIcon('tune')
export const Sun = createGoogleIcon('light_mode')
export const Moon = createGoogleIcon('dark_mode')
export const Monitor = createGoogleIcon('desktop_windows')
