'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function NotificationsPage() {
  const currentUser = useStore((state) => state.currentUser)
  const notifications = useStore((state) =>
    state.notifications.filter((n) => n.userId === currentUser?.id)
  )
  const markNotificationRead = useStore((state) => state.markNotificationRead)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      default:
        return <Bell className="w-6 h-6 text-gray-500" />
    }
  }

  const markAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) {
        markNotificationRead(n.id)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Notificações</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Nenhuma notificação nova'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <CheckCheck className="w-5 h-5" />
              Marcar Todas como Lidas
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-600">
                Você será notificado sobre novos cultos, ensaios e atualizações da equipe
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow p-6 transition-opacity ${
                  notification.read ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-1">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(notification.date), "d 'de' MMMM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markNotificationRead(notification.id)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
