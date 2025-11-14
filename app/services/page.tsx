'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { Plus, Calendar, Edit2, Trash2, Check, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ServicesPage() {
  const services = useStore((state) => state.services)
  const songs = useStore((state) => state.songs)
  const users = useStore((state) => state.users)
  const addService = useStore((state) => state.addService)
  const updateService = useStore((state) => state.updateService)
  const deleteService = useStore((state) => state.deleteService)

  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'Culto Dominical',
    theme: '',
    songs: [] as string[],
    team: [] as any[],
    notes: '',
    status: 'draft' as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingService) {
      updateService(editingService, formData)
    } else {
      addService({
        id: Date.now().toString(),
        ...formData,
      })
    }

    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      type: 'Culto Dominical',
      theme: '',
      songs: [],
      team: [],
      notes: '',
      status: 'draft',
    })
    setEditingService(null)
  }

  const handleEdit = (service: any) => {
    setFormData(service)
    setEditingService(service.id)
    setShowModal(true)
  }

  const handleDelete = (serviceId: string) => {
    if (confirm('Tem certeza que deseja excluir este culto?')) {
      deleteService(serviceId)
    }
  }

  const toggleSong = (songId: string) => {
    setFormData({
      ...formData,
      songs: formData.songs.includes(songId)
        ? formData.songs.filter((id) => id !== songId)
        : [...formData.songs, songId],
    })
  }

  const toggleTeamMember = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    const exists = formData.team.find((m) => m.userId === userId)
    if (exists) {
      setFormData({
        ...formData,
        team: formData.team.filter((m) => m.userId !== userId),
      })
    } else {
      setFormData({
        ...formData,
        team: [...formData.team, { userId, role: user.instrument || 'Membro', confirmed: false }],
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Cultos e Eventos</h1>
            <p className="text-gray-600">Planeje e gerencie todos os cultos da igreja</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            Novo Culto
          </button>
        </div>

        <div className="grid gap-6">
          {services.map((service) => {
            const serviceSongs = songs.filter((s) => service.songs.includes(s.id))
            const confirmedCount = service.team.filter((m) => m.confirmed).length

            return (
              <div key={service.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 rounded-lg p-3">
                      <Calendar className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{service.type}</h3>
                      {service.theme && (
                        <p className="text-gray-600 mt-1">Tema: {service.theme}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {format(parseISO(service.date), "d 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}{' '}
                        às {service.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        service.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'planned'
                          ? 'bg-blue-100 text-blue-800'
                          : service.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {service.status}
                    </span>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Setlist ({serviceSongs.length} músicas)
                    </h4>
                    <div className="space-y-2">
                      {serviceSongs.map((song, idx) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <span className="font-medium">{idx + 1}.</span>
                          <span>
                            {song.title} - {song.artist}
                          </span>
                          <span className="text-xs text-gray-500">({song.key})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Equipe ({confirmedCount}/{service.team.length} confirmados)
                    </h4>
                    <div className="space-y-2">
                      {service.team.map((member) => {
                        const user = users.find((u) => u.id === member.userId)
                        return (
                          <div
                            key={member.userId}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            {member.confirmed ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-gray-400" />
                            )}
                            <span>
                              {user?.name} - {member.role}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {service.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-800 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{service.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingService ? 'Editar Culto' : 'Novo Culto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option>Culto Dominical</option>
                      <option>Culto de Celebração</option>
                      <option>Culto de Oração</option>
                      <option>Evento Especial</option>
                      <option>Conferência</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as any })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="planned">Planejado</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Realizado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Músicas (Setlist)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {songs.map((song) => (
                      <label key={song.id} className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.songs.includes(song.id)}
                          onChange={() => toggleSong(song.id)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {song.title} - {song.artist} ({song.key})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipe</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {users
                      .filter((u) => u.role !== 'admin')
                      .map((user) => (
                        <label key={user.id} className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={formData.team.some((m) => m.userId === user.id)}
                            onChange={() => toggleTeamMember(user.id)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {user.name} {user.instrument && `- ${user.instrument}`}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    {editingService ? 'Salvar' : 'Criar Culto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
