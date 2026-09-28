import {
  Search,
  CircleCheck,
  FileText,
  Gift,
  Megaphone,
  Video,
  CalendarDays,
  Globe,
  Mail,
  Gauge,
  UsersRound,
  UserSearch,
  Sparkles,
  Route,
  LayoutDashboard,
  Heart,
  History,
  Settings,
  Building2,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  search: Search,
  "circle-check": CircleCheck,
  "file-text": FileText,
  gift: Gift,
  megaphone: Megaphone,
  video: Video,
  "calendar-days": CalendarDays,
  globe: Globe,
  mail: Mail,
  gauge: Gauge,
  "users-round": UsersRound,
  "user-search": UserSearch,
  sparkles: Sparkles,
  route: Route,
  "layout-dashboard": LayoutDashboard,
  heart: Heart,
  history: History,
  settings: Settings,
  "building-2": Building2,
};

export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && ICON_MAP[name]) || Sparkles;
}
