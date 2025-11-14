'use client'

import { Bell, User } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function Header() {
  const currentUser = useStore((state) => state.currentUser)
  const notifications = useStore((state) =>
    state.notifications.filter((n) => n.userId === currentUser?.id && !n.read)
  )

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Bem-vindo, {currentUser?.name}!
          </h2>
          <p className="text-sm text-gray-600">
            Gerencie todos os aspectos da adoração da sua igreja
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{currentUser?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
