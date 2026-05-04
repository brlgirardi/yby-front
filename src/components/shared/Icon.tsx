'use client'

import {
  AlertTriangle,
  ArrowLeft,
  BarChart,
  Bell,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Info,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  Smartphone,
  Trash2,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  X,
  Sparkles,
  Zap,
} from 'lucide-react'

interface IconProps {
  name: string
  size?: number
  color?: string
  /** Default 2 (lucide stroke padrão). */
  strokeWidth?: number
}

/**
 * Wrapper sobre lucide-react com nomes em camelCase. A API antiga
 * `<Icon name="dashboard" />` continua válida — internamente delega para o
 * ícone lucide oficial. Vantagens: tree-shaking, ícone único de origem
 * (mesmo que o branch feat/pricing do yby-ui Tupi), zero SVG inline.
 *
 * Para casos onde você precisa de um ícone fora desta lista, importe
 * direto de `lucide-react` no componente que usa.
 */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  dashboard:      LayoutDashboard,
  users:          Users,
  receipt:        Receipt,
  calendar:       Calendar,
  landmark:       Landmark,
  creditCard:     CreditCard,
  settings:       Settings,
  bell:           Bell,
  search:         Search,
  chevronDown:    ChevronDown,
  chevronUp:      ChevronUp,
  chevronRight:   ChevronRight,
  chevronLeft:    ChevronLeft,
  menu:           Menu,
  eye:            Eye,
  eyeOff:         EyeOff,
  info:           Info,
  filter:         Filter,
  plus:           Plus,
  download:       Download,
  x:              X,
  moreHorizontal: MoreHorizontal,
  trendingUp:     TrendingUp,
  arrowLeft:      ArrowLeft,
  logOut:         LogOut,
  barChart:       BarChart,
  // "reconcile" não existe no lucide — usamos CheckCircle2 (mesma silhueta)
  reconcile:      CheckCircle2,
  userPlus:       UserPlus,
  edit:           Edit,
  trash:          Trash2,
  externalLink:   ExternalLink,
  zap:            Zap,
  smartphone:     Smartphone,
  shoppingCart:   ShoppingCart,
  copy:           Copy,
  alertTriangle:  AlertTriangle,
  checkCircle:    CheckCircle,
  upload:         Upload,
  sparkles:       Sparkles,
  // "pos" — usamos Smartphone (mais próximo conceitualmente)
  pos:            Smartphone,
}

export default function Icon({ name, size = 16, color, strokeWidth = 2 }: IconProps) {
  const LucideIcon = ICON_MAP[name]
  if (!LucideIcon) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Icon] Nome desconhecido: "${name}". Importe direto de lucide-react ou adicione ao ICON_MAP.`)
    }
    return null
  }
  return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} />
}
