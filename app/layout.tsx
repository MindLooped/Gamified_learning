import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoLearn - Gamified Environmental Education',
  description: 'Transforming environmental education through gamification and AI. Learn sustainability, climate action, and eco-friendly practices in an engaging way.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} backg`}>{children}</body>
    </html>
  )
}
