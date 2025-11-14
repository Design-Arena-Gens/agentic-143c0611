'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Video, Image as ImageIcon, FileText, Upload, Folder } from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  type: 'video' | 'image' | 'document'
  category: string
  uploadDate: string
  size: string
}

export default function MediaPage() {
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'Slide Introdução.pptx',
      type: 'document',
      category: 'Apresentações',
      uploadDate: '2025-01-10',
      size: '2.3 MB',
    },
    {
      id: '2',
      name: 'Video Testemunho.mp4',
      type: 'video',
      category: 'Vídeos',
      uploadDate: '2025-01-08',
      size: '45.8 MB',
    },
    {
      id: '3',
      name: 'Banner Evento.jpg',
      type: 'image',
      category: 'Imagens',
      uploadDate: '2025-01-05',
      size: '1.2 MB',
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Apresentações', 'Vídeos', 'Imagens', 'Documentos']

  const filteredMedia =
    selectedCategory === 'all'
      ? mediaItems
      : mediaItems.filter((item) => item.category === selectedCategory)

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-8 h-8 text-purple-500" />
      case 'image':
        return <ImageIcon className="w-8 h-8 text-blue-500" />
      case 'document':
        return <FileText className="w-8 h-8 text-green-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Biblioteca de Mídia</h1>
            <p className="text-gray-600">
              Gerencie apresentações, vídeos e outros recursos visuais
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Upload className="w-5 h-5" />
            Fazer Upload
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gray-100 rounded-lg p-3">{getIcon(item.type)}</div>
                <span className="text-xs text-gray-500">{item.size}</span>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>
                <span>{new Date(item.uploadDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-8 text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Organize Seus Recursos de Mídia
          </h3>
          <p className="text-gray-600 mb-4">
            Faça upload de apresentações, vídeos, imagens e documentos para usar nos cultos
          </p>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Começar Upload
          </button>
        </div>
      </main>
    </div>
  )
}
