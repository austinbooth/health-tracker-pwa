import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AuthProvider from '../components/AuthContext'
import QueryProvider from '../components/QueryProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryProvider>
        <Component {...pageProps} />
      </QueryProvider>
    </AuthProvider>
  )
}

export default MyApp
