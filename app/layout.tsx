import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'DB Monitor',
  description: 'PostgreSQL Performance Advisor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
