import type { NextPage } from 'next'
import { PropsWithChildren } from 'react'
import Head from 'next/head'
import { useAuth } from './AuthContext'
import SignOutButton from './SignOutButton'
import { useRouter } from 'next/router'
import Loading from './Loading'

const AuthedPage: NextPage<PropsWithChildren> = ({children}) => {
  const { result } = useAuth()
  const router = useRouter()

  if (result.state === 'Loading') {
    return <Loading />
  }

  if (result.state !== 'Authed') {
    router.push('/signin')
    return <Loading />
  }
  
  return (
    <div className="px-8">
      <Head>
        <title>Health tracker</title>
        <meta name="description" content="Track your weight etc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <SignOutButton />
      </header>

      <main className="flex flex-col justify-center items-center py-16 h-[90vh]">
        {children}
      </main>

      <footer className="flex justify-center items-center grow border-t-[1px]">
        Generic footer
      </footer>
    </div>
  )
}

export default AuthedPage
