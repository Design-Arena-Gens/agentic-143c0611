'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { Plus, Edit2, Trash2, User, Mail, Music } from 'lucide-react'

export default function TeamPage() {
  const users = useStore((state) => state.users)
  const addUser = useStore((state) => state.addUser)
  const updateUser = useStore((state) => state.updateUser)

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member' as 'admin' | 'leader' | 'member',
    instrument: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {
      updateUser(editingUser, formData)
    } else {
      addUser({
        id: Date.now().toString(),
        ...formData,
      })
    }

    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'member',
      instrument: '',
    })
    setEditingUser(null)
  }

  const handleEdit = (user: any) => {
    setFormData(user)
    setEditingUser(user.id)
    setShowModal(true)
  }

  const roleLabels = {
    admin: 'Administrador',
    leader: 'Líder',
    member: 'Membro',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Equipe de Louvor</h1>
            <p className="text-gray-600">Gerencie todos os membros da equipe</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            Adicionar Membro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h3>
              <p className="text-sm text-primary-600 mb-3">{roleLabels[user.role]}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.instrument && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Music className="w-4 h-4" />
                    <span>{user.instrument}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingUser ? 'Editar Membro' : 'Novo Membro'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="member">Membro</option>
                    <option value="leader">Líder</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrumento/Função
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Guitarra, Vocal, Bateria..."
                    value={formData.instrument}
                    onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
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
                    {editingUser ? 'Salvar' : 'Adicionar'}
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
