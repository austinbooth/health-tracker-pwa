'use client'
import AuthProvider from './AuthContext'
import QueryProvider from './QueryProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </AuthProvider>
  )
}
