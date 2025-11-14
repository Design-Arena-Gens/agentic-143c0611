'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { Save, Bell, Globe, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  const currentUser = useStore((state) => state.currentUser)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <p className="text-gray-600">Gerencie as preferências do sistema</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-800">Notificações</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Novos cultos agendados</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Ensaios marcados</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Atualizações de setlist</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Novos membros na equipe</span>
                <input type="checkbox" className="rounded" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-800">Regional</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Português (Brasil)</option>
                  <option>English (US)</option>
                  <option>Español</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuso Horário</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>América/São Paulo (GMT-3)</option>
                  <option>América/Manaus (GMT-4)</option>
                  <option>América/Rio Branco (GMT-5)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-800">Aparência</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Claro</option>
                  <option>Escuro</option>
                  <option>Automático</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-800">Segurança</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={currentUser?.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Alterar senha
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
