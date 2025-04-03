import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nirnay',
  description: 'Fake news detection in live broadcasts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
