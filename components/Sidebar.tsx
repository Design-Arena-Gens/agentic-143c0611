'use client'

import {
  Home,
  Music,
  Calendar,
  Users,
  Settings,
  Bell,
  BarChart3,
  FileText,
  Video
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Calendar, label: 'Cultos', href: '/services' },
  { icon: Music, label: 'Músicas', href: '/songs' },
  { icon: Users, label: 'Equipe', href: '/team' },
  { icon: FileText, label: 'Ensaios', href: '/rehearsals' },
  { icon: Video, label: 'Mídia', href: '/media' },
  { icon: BarChart3, label: 'Relatórios', href: '/reports' },
  { icon: Bell, label: 'Notificações', href: '/notifications' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 fixed left-0 top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-400">Worship Planner</h1>
        <p className="text-sm text-gray-400">Gestão de Adoração</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
