import './globals.css'
import { Metadata } from 'next'
import { Providers } from '../components/providers/Providers'

export const metadata: Metadata = {
  title: 'Health Tracker',
  description: 'Track your weight etc',
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs13", "next13", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    { name: "Austin Booth" },
    {
      name: "Austin Booth",
      url: "https://www.github.com/austinbooth/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/128.png" },
    { rel: "icon", url: "icons/128.png" },
  ],
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