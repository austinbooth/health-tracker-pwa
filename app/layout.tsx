import './globals.css'
import { Metadata } from 'next'
import { Providers } from './Providers'

export const metadata: Metadata = {
  title: 'Health Tracker',
  description: 'Track your weight etc',
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}