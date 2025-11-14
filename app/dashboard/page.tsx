'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { Calendar, Music, Users, Clock } from 'lucide-react'
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Dashboard() {
  const services = useStore((state) => state.services)
  const songs = useStore((state) => state.songs)
  const users = useStore((state) => state.users)
  const rehearsals = useStore((state) => state.rehearsals)

  const upcomingServices = services
    .filter((s) => isAfter(parseISO(s.date), new Date()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3)

  const upcomingRehearsals = rehearsals
    .filter((r) => isAfter(parseISO(r.date), new Date()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3)

  const recentSongs = songs.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Cultos</p>
                <p className="text-3xl font-bold text-gray-800">{services.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-primary-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Músicas no Repertório</p>
                <p className="text-3xl font-bold text-gray-800">{songs.length}</p>
              </div>
              <Music className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Membros da Equipe</p>
                <p className="text-3xl font-bold text-gray-800">{users.length}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ensaios Agendados</p>
                <p className="text-3xl font-bold text-gray-800">{rehearsals.length}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Próximos Cultos</h3>
            <div className="space-y-4">
              {upcomingServices.map((service) => (
                <div key={service.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{service.type}</p>
                      {service.theme && (
                        <p className="text-sm text-gray-600">{service.theme}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {format(parseISO(service.date), "d 'de' MMMM", { locale: ptBR })} às{' '}
                        {service.time}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        service.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'planned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {service.songs.length} músicas · {service.team.length} membros
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Próximos Ensaios</h3>
            <div className="space-y-4">
              {upcomingRehearsals.map((rehearsal) => {
                const service = services.find((s) => s.id === rehearsal.serviceId)
                return (
                  <div key={rehearsal.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <p className="font-medium text-gray-800">
                      Ensaio - {service?.type || 'Geral'}
                    </p>
                    <p className="text-sm text-gray-600">{rehearsal.location}</p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(rehearsal.date), "d 'de' MMMM", { locale: ptBR })} às{' '}
                      {rehearsal.time}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {rehearsal.attendees.length} participantes confirmados
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Músicas Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Título</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Artista</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Tom</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">BPM</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSongs.map((song) => (
                    <tr key={song.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{song.title}</td>
                      <td className="py-3 px-4 text-gray-600">{song.artist}</td>
                      <td className="py-3 px-4 text-gray-600">{song.key}</td>
                      <td className="py-3 px-4 text-gray-600">{song.tempo}</td>
                      <td className="py-3 px-4 text-gray-600">{song.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
