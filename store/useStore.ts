import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'leader' | 'member'
  instrument?: string
  avatar?: string
}

export interface Song {
  id: string
  title: string
  artist: string
  key: string
  tempo: number
  duration: string
  lyrics: string
  chords: string
  category: string[]
  addedDate: string
  youtubeUrl?: string
  spotifyUrl?: string
}

export interface TeamMember {
  userId: string
  role: string
  confirmed: boolean
}

export interface Service {
  id: string
  date: string
  time: string
  type: string
  theme?: string
  songs: string[]
  team: TeamMember[]
  notes?: string
  status: 'draft' | 'planned' | 'confirmed' | 'completed'
}

export interface Rehearsal {
  id: string
  serviceId: string
  date: string
  time: string
  location: string
  attendees: string[]
  notes?: string
}

export interface Notification {
  id: string
  userId: string
  message: string
  type: 'info' | 'warning' | 'success'
  read: boolean
  date: string
}

interface Store {
  currentUser: User | null
  users: User[]
  songs: Song[]
  services: Service[]
  rehearsals: Rehearsal[]
  notifications: Notification[]

  setCurrentUser: (user: User | null) => void
  addUser: (user: User) => void
  updateUser: (userId: string, updates: Partial<User>) => void

  addSong: (song: Song) => void
  updateSong: (songId: string, updates: Partial<Song>) => void
  deleteSong: (songId: string) => void

  addService: (service: Service) => void
  updateService: (serviceId: string, updates: Partial<Service>) => void
  deleteService: (serviceId: string) => void

  addRehearsal: (rehearsal: Rehearsal) => void
  updateRehearsal: (rehearsalId: string, updates: Partial<Rehearsal>) => void
  deleteRehearsal: (rehearsalId: string) => void

  addNotification: (notification: Notification) => void
  markNotificationRead: (notificationId: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      currentUser: {
        id: '1',
        name: 'Admin',
        email: 'admin@igreja.com',
        role: 'admin',
      },
      users: [
        {
          id: '1',
          name: 'Admin',
          email: 'admin@igreja.com',
          role: 'admin',
        },
        {
          id: '2',
          name: 'João Silva',
          email: 'joao@igreja.com',
          role: 'leader',
          instrument: 'Guitarra',
        },
        {
          id: '3',
          name: 'Maria Santos',
          email: 'maria@igreja.com',
          role: 'member',
          instrument: 'Vocal',
        },
        {
          id: '4',
          name: 'Pedro Costa',
          email: 'pedro@igreja.com',
          role: 'member',
          instrument: 'Bateria',
        },
        {
          id: '5',
          name: 'Ana Lima',
          email: 'ana@igreja.com',
          role: 'member',
          instrument: 'Teclado',
        },
      ],
      songs: [
        {
          id: '1',
          title: 'Reckless Love',
          artist: 'Cory Asbury',
          key: 'C',
          tempo: 72,
          duration: '5:42',
          lyrics: 'Before I spoke a word, You were singing over me...',
          chords: 'C G Am F',
          category: ['Adoração', 'Contemporâneo'],
          addedDate: '2024-01-15',
        },
        {
          id: '2',
          title: 'Goodness of God',
          artist: 'Bethel Music',
          key: 'D',
          tempo: 120,
          duration: '6:31',
          lyrics: 'I love You Lord, oh Your mercy never fails me...',
          chords: 'D A Bm G',
          category: ['Adoração', 'Louvor'],
          addedDate: '2024-01-10',
        },
        {
          id: '3',
          title: 'Way Maker',
          artist: 'Sinach',
          key: 'G',
          tempo: 132,
          duration: '5:30',
          lyrics: 'You are here, moving in our midst...',
          chords: 'G C Em D',
          category: ['Louvor', 'Contemporâneo'],
          addedDate: '2024-01-05',
        },
      ],
      services: [
        {
          id: '1',
          date: '2025-01-19',
          time: '19:00',
          type: 'Culto Dominical',
          theme: 'A Graça de Deus',
          songs: ['1', '2', '3'],
          team: [
            { userId: '2', role: 'Guitarra', confirmed: true },
            { userId: '3', role: 'Vocal', confirmed: true },
            { userId: '4', role: 'Bateria', confirmed: false },
            { userId: '5', role: 'Teclado', confirmed: true },
          ],
          notes: 'Lembrar de testar o som às 18h',
          status: 'planned',
        },
        {
          id: '2',
          date: '2025-01-26',
          time: '10:00',
          type: 'Culto Matinal',
          songs: ['2', '3'],
          team: [
            { userId: '2', role: 'Guitarra', confirmed: false },
            { userId: '3', role: 'Vocal', confirmed: false },
          ],
          status: 'draft',
        },
      ],
      rehearsals: [
        {
          id: '1',
          serviceId: '1',
          date: '2025-01-17',
          time: '19:00',
          location: 'Sala de Ensaio',
          attendees: ['2', '3', '5'],
          notes: 'Focar nas transições entre músicas',
        },
      ],
      notifications: [
        {
          id: '1',
          userId: '1',
          message: 'Novo ensaio agendado para 17/01',
          type: 'info',
          read: false,
          date: '2025-01-14T10:00:00',
        },
      ],

      setCurrentUser: (user) => set({ currentUser: user }),

      addUser: (user) => set((state) => ({ users: [...state.users, user] })),

      updateUser: (userId, updates) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
        })),

      addSong: (song) => set((state) => ({ songs: [...state.songs, song] })),

      updateSong: (songId, updates) =>
        set((state) => ({
          songs: state.songs.map((s) => (s.id === songId ? { ...s, ...updates } : s)),
        })),

      deleteSong: (songId) =>
        set((state) => ({
          songs: state.songs.filter((s) => s.id !== songId),
        })),

      addService: (service) =>
        set((state) => ({ services: [...state.services, service] })),

      updateService: (serviceId, updates) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === serviceId ? { ...s, ...updates } : s
          ),
        })),

      deleteService: (serviceId) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId),
        })),

      addRehearsal: (rehearsal) =>
        set((state) => ({ rehearsals: [...state.rehearsals, rehearsal] })),

      updateRehearsal: (rehearsalId, updates) =>
        set((state) => ({
          rehearsals: state.rehearsals.map((r) =>
            r.id === rehearsalId ? { ...r, ...updates } : r
          ),
        })),

      deleteRehearsal: (rehearsalId) =>
        set((state) => ({
          rehearsals: state.rehearsals.filter((r) => r.id !== rehearsalId),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),

      markNotificationRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),
    }),
    {
      name: 'worship-planner-storage',
    }
  )
)
