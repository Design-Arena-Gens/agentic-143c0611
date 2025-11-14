'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'
import { Plus, Search, Edit2, Trash2, Music2, ExternalLink } from 'lucide-react'

export default function SongsPage() {
  const songs = useStore((state) => state.songs)
  const addSong = useStore((state) => state.addSong)
  const updateSong = useStore((state) => state.updateSong)
  const deleteSong = useStore((state) => state.deleteSong)

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSong, setEditingSong] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    key: 'C',
    tempo: 120,
    duration: '',
    lyrics: '',
    chords: '',
    category: [] as string[],
    youtubeUrl: '',
    spotifyUrl: '',
  })

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSong) {
      updateSong(editingSong, formData)
    } else {
      addSong({
        id: Date.now().toString(),
        ...formData,
        addedDate: new Date().toISOString().split('T')[0],
      })
    }

    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      key: 'C',
      tempo: 120,
      duration: '',
      lyrics: '',
      chords: '',
      category: [],
      youtubeUrl: '',
      spotifyUrl: '',
    })
    setEditingSong(null)
  }

  const handleEdit = (song: any) => {
    setFormData(song)
    setEditingSong(song.id)
    setShowModal(true)
  }

  const handleDelete = (songId: string) => {
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      deleteSong(songId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-24 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Biblioteca de Músicas</h1>
            <p className="text-gray-600">Gerencie todo o repertório da sua igreja</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            Nova Música
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-800"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Título</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Artista</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Tom</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">BPM</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Duração</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Categoria</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song) => (
                <tr key={song.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Music2 className="w-5 h-5 text-primary-500" />
                      <span className="font-medium text-gray-800">{song.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{song.artist}</td>
                  <td className="py-3 px-4 text-gray-600">{song.key}</td>
                  <td className="py-3 px-4 text-gray-600">{song.tempo}</td>
                  <td className="py-3 px-4 text-gray-600">{song.duration}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {song.category.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(song)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingSong ? 'Editar Música' : 'Nova Música'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artista *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tom</label>
                    <select
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(
                        (key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BPM</label>
                    <input
                      type="number"
                      value={formData.tempo}
                      onChange={(e) =>
                        setFormData({ ...formData, tempo: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duração
                    </label>
                    <input
                      type="text"
                      placeholder="5:30"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categorias
                    </label>
                    <input
                      type="text"
                      placeholder="Adoração, Louvor"
                      value={formData.category.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Letra</label>
                  <textarea
                    rows={6}
                    value={formData.lyrics}
                    onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cifra</label>
                  <textarea
                    rows={4}
                    value={formData.chords}
                    onChange={(e) => setFormData({ ...formData, chords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spotify URL
                    </label>
                    <input
                      type="url"
                      value={formData.spotifyUrl}
                      onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
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
                    {editingSong ? 'Salvar' : 'Adicionar'}
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
