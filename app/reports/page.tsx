'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { BarChart, TrendingUp, Calendar, Music } from 'lucide-react'

export default function ReportsPage() {
  const services = useStore((state) => state.services)
  const songs = useStore((state) => state.songs)
  const users = useStore((state) => state.users)

  const completedServices = services.filter((s) => s.status === 'completed').length
  const totalSongs = songs.length
  const totalMembers = users.filter((u) => u.role !== 'admin').length

  const songUsage = songs.map((song) => {
    const usageCount = services.filter((s) => s.songs.includes(song.id)).length
    return { song, count: usageCount }
  })
  .sort((a, b) => b.count - a.count)
  .slice(0, 10)

  const memberParticipation = users
    .filter((u) => u.role !== 'admin')
    .map((user) => {
      const participationCount = services.filter((s) =>
        s.team.some((m) => m.userId === user.id)
      ).length
      return { user, count: participationCount }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Relatórios e Análises</h1>
          <p className="text-gray-600">Visualize estatísticas e insights da adoração</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 rounded-lg p-3">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Cultos Realizados</p>
                <p className="text-3xl font-bold text-gray-800">{completedServices}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% vs mês anterior
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Music className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Repertório Total</p>
                <p className="text-3xl font-bold text-gray-800">{totalSongs}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +5 novas músicas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <BarChart className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Membros Ativos</p>
                <p className="text-3xl font-bold text-gray-800">{totalMembers}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  100% engajamento
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Músicas Mais Utilizadas
            </h3>
            <div className="space-y-4">
              {songUsage.map((item, idx) => (
                <div key={item.song.id} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-300 w-8">{idx + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.song.title}</p>
                    <p className="text-sm text-gray-600">{item.song.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary-600">{item.count}x</p>
                    <p className="text-xs text-gray-500">utilizada</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Participação da Equipe
            </h3>
            <div className="space-y-4">
              {memberParticipation.map((item, idx) => (
                <div key={item.user.id} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-300 w-8">{idx + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.user.name}</p>
                    <p className="text-sm text-gray-600">{item.user.instrument}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{item.count}</p>
                    <p className="text-xs text-gray-500">cultos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Distribuição por Status de Culto
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {['draft', 'planned', 'confirmed', 'completed'].map((status) => {
              const count = services.filter((s) => s.status === status).length
              const percentage = services.length > 0 ? (count / services.length) * 100 : 0
              const labels = {
                draft: 'Rascunho',
                planned: 'Planejado',
                confirmed: 'Confirmado',
                completed: 'Realizado',
              }
              return (
                <div key={status} className="text-center">
                  <div className="mb-2">
                    <div className="text-3xl font-bold text-gray-800">{count}</div>
                    <div className="text-sm text-gray-600">{labels[status as keyof typeof labels]}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
