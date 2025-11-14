import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Worship Planner - Gestão Completa de Adoração',
  description: 'Sistema integrado de planejamento e gerenciamento de adoração para igrejas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
