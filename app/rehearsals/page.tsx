'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { Plus, Edit2, Trash2, Clock, MapPin, Users as UsersIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function RehearsalsPage() {
  const rehearsals = useStore((state) => state.rehearsals)
  const services = useStore((state) => state.services)
  const users = useStore((state) => state.users)
  const addRehearsal = useStore((state) => state.addRehearsal)
  const updateRehearsal = useStore((state) => state.updateRehearsal)
  const deleteRehearsal = useStore((state) => state.deleteRehearsal)

  const [showModal, setShowModal] = useState(false)
  const [editingRehearsal, setEditingRehearsal] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    location: '',
    attendees: [] as string[],
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingRehearsal) {
      updateRehearsal(editingRehearsal, formData)
    } else {
      addRehearsal({
        id: Date.now().toString(),
        ...formData,
      })
    }

    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      serviceId: '',
      date: '',
      time: '',
      location: '',
      attendees: [],
      notes: '',
    })
    setEditingRehearsal(null)
  }

  const handleEdit = (rehearsal: any) => {
    setFormData(rehearsal)
    setEditingRehearsal(rehearsal.id)
    setShowModal(true)
  }

  const handleDelete = (rehearsalId: string) => {
    if (confirm('Tem certeza que deseja excluir este ensaio?')) {
      deleteRehearsal(rehearsalId)
    }
  }

  const toggleAttendee = (userId: string) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.includes(userId)
        ? formData.attendees.filter((id) => id !== userId)
        : [...formData.attendees, userId],
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ensaios</h1>
            <p className="text-gray-600">Organize e acompanhe os ensaios da equipe</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            Novo Ensaio
          </button>
        </div>

        <div className="grid gap-6">
          {rehearsals.map((rehearsal) => {
            const service = services.find((s) => s.id === rehearsal.serviceId)
            const attendeeUsers = users.filter((u) => rehearsal.attendees.includes(u.id))

            return (
              <div key={rehearsal.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-lg p-3">
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Ensaio - {service?.type || 'Geral'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(parseISO(rehearsal.date), "d 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}{' '}
                        às {rehearsal.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(rehearsal)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(rehearsal.id)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{rehearsal.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <UsersIcon className="w-5 h-5" />
                    <span>{attendeeUsers.length} participantes</span>
                  </div>
                </div>

                {attendeeUsers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Participantes Confirmados</h4>
                    <div className="flex flex-wrap gap-2">
                      {attendeeUsers.map((user) => (
                        <span
                          key={user.id}
                          className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                        >
                          {user.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {rehearsal.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-800 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{rehearsal.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingRehearsal ? 'Editar Ensaio' : 'Novo Ensaio'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Culto Relacionado
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Ensaio Geral</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.type} - {format(parseISO(service.date), 'dd/MM/yyyy')}
                      </option>
                    ))}
                  </select>
                </div>

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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sala de Ensaio, Auditório..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participantes
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {users
                      .filter((u) => u.role !== 'admin')
                      .map((user) => (
                        <label key={user.id} className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={formData.attendees.includes(user.id)}
                            onChange={() => toggleAttendee(user.id)}
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
                    placeholder="Pontos importantes para o ensaio..."
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
                    {editingRehearsal ? 'Salvar' : 'Criar Ensaio'}
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
