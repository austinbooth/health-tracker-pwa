'use client'
import AuthProvider from '../components/AuthContext'
import QueryProvider from '../components/QueryProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </AuthProvider>
  )
}
